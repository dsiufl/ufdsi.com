import { NextRequest } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { adminClient } from "@/lib/supabase/admin";

// Google Form submissions (scripts/google-forms-webhook.gs) land here as drafts.
// An admin attaches a cover and publishes them with the usual toggle.

type Fields = Record<string, unknown>;
type Mapped = { row: Record<string, unknown> } | { error: string };

const TZ = "America/New_York";
const NEWS_CATEGORIES = [
  { value: "Articles", label: "Article" },
  { value: "Competition", label: "Competition" },
  { value: "Workshop", label: "Workshop article" },
];

// Form answers come in as strings, or arrays for checkbox questions.
const text = (f: Fields, key: string) => {
  const v = f[key];
  const s = Array.isArray(v) ? v.join(", ") : typeof v === "string" || typeof v === "number" ? String(v) : "";
  return s.trim() || undefined;
};

const missing = (f: Fields, keys: string[]) => {
  const gone = keys.filter((k) => !text(f, k));
  return gone.length ? `Missing required fields: ${gone.join(", ")}` : null;
};

// "2026-11-05 18:00" with no zone is a Gainesville time; anything with a zone is taken as is.
const parseDatetime = (s: string) => {
  const naive = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?$/.test(s);
  if (!naive) return new Date(s);
  const local = s.replace(" ", "T");
  const asUtc = new Date(`${local}Z`);
  const offset = asUtc.toLocaleString("en-US", { timeZone: TZ, timeZoneName: "longOffset" }).split("GMT")[1] || "+00:00";
  return new Date(`${local}${offset}`);
};

// One entry per form. Adding a form type is one more entry here.
const TYPES: Record<string, { table: string; map: (f: Fields) => Mapped }> = {
  workshop: {
    table: "workshops",
    map: (f) => {
      const error = missing(f, ["title", "speaker", "datetime"]);
      if (error) return { error };
      const datetime = parseDatetime(text(f, "datetime")!);
      if (isNaN(datetime.getTime())) return { error: `Couldn't read datetime "${text(f, "datetime")}"` };
      return {
        row: {
          title: text(f, "title"),
          speaker: text(f, "speaker"),
          datetime: datetime.toISOString(),
          description: text(f, "description") ?? null,
          link: text(f, "link") ?? null,
          // leave the column default when the form skips it
          ...(text(f, "location") && { location: text(f, "location") }),
        },
      };
    },
  },
  news: {
    table: "news",
    map: (f) => {
      const error = missing(f, ["title", "category"]);
      if (error) return { error };
      const raw = text(f, "category")!;
      const match = NEWS_CATEGORIES.find((c) => [c.value, c.label].some((n) => n.toLowerCase() === raw.toLowerCase()));
      return {
        row: {
          title: text(f, "title"),
          category: match?.value ?? raw,
          summary: text(f, "summary") ?? null,
          content: text(f, "content") ?? null,
        },
      };
    },
  },
};

// Hashing both sides first keeps the compare constant time even when the lengths differ.
const authorized = (header: string | null) => {
  const token = process.env.FORMS_WEBHOOK_TOKEN;
  if (!token || !header?.startsWith("Bearer ")) return false;
  const digest = (s: string) => createHash("sha256").update(s).digest();
  return timingSafeEqual(digest(header.slice("Bearer ".length).trim()), digest(token));
};

export async function POST(req: NextRequest) {
  if (!authorized(req.headers.get("authorization"))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { type?: unknown; responseId?: unknown; fields?: unknown; email?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Body must be JSON" }, { status: 400 });
  }
  if (!body || typeof body !== "object") return Response.json({ error: "Body must be a JSON object" }, { status: 400 });

  const config = typeof body.type === "string" ? TYPES[body.type.trim().toLowerCase()] : undefined;
  if (!config) {
    return Response.json({ error: `Unknown type "${body.type}". Expected one of: ${Object.keys(TYPES).join(", ")}` }, { status: 400 });
  }
  if (typeof body.responseId !== "string" || !body.responseId.trim()) {
    return Response.json({ error: "Missing responseId" }, { status: 400 });
  }
  if (!body.fields || typeof body.fields !== "object" || Array.isArray(body.fields)) {
    return Response.json({ error: "fields must be an object" }, { status: 400 });
  }

  const mapped = config.map(body.fields as Fields);
  if ("error" in mapped) return Response.json({ error: mapped.error }, { status: 400 });

  const email = typeof body.email === "string" && body.email.trim() ? body.email.trim().toLowerCase() : null;
  const { data, error } = await adminClient()
    .from(config.table)
    .insert({
      ...mapped.row,
      status: "draft",
      author: null,
      source_response_id: body.responseId.trim(),
      submitted_by_email: email,
    })
    .select("id")
    .single();

  // Apps Script retries, or a resubmitted trigger: already have it.
  if (error?.code === "23505") return Response.json({ duplicate: true }, { status: 200 });
  if (error) {
    console.error("Form submission insert failed:", error);
    return Response.json({ error: "Couldn't save the submission" }, { status: 500 });
  }
  return Response.json({ id: data.id }, { status: 201 });
}
