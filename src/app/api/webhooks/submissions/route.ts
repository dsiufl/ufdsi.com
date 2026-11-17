import { NextRequest } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { adminClient } from "@/lib/supabase/admin";

// Google Form submissions (scripts/google-forms-webhook.gs) land here as drafts.
// An admin attaches a cover and publishes them with the usual toggle.
// Who sent each one is kept in admin.draft_submissions, out of the public tables.

type Fields = Record<string, unknown>;
type Mapped = { row: Record<string, unknown> } | { error: string };

const TZ = "America/New_York";
const MAX_BODY = 64 * 1024;
const NEWS_CATEGORIES = [
  { value: "Articles", label: "Article" },
  { value: "Competition", label: "Competition" },
  { value: "Workshop", label: "Workshop article" },
];
// characters
const LIMITS: Record<string, number> = {
  title: 200,
  speaker: 200,
  location: 200,
  category: 50,
  datetime: 40,
  link: 2000,
  summary: 1000,
  description: 5000,
  content: 40000,
};

// Form answers come in as strings, or arrays for checkbox questions.
const text = (f: Fields, key: string) => {
  const v = f[key];
  const s = Array.isArray(v) ? v.join(", ") : typeof v === "string" || typeof v === "number" ? String(v) : "";
  return s.trim() || undefined;
};

const check = (f: Fields, required: string[], optional: string[]) => {
  const gone = required.filter((k) => !text(f, k));
  if (gone.length) return `Missing required fields: ${gone.join(", ")}`;
  const long = [...required, ...optional].filter((k) => (text(f, k)?.length ?? 0) > LIMITS[k]);
  if (long.length) return `Too long: ${long.map((k) => `${k} (max ${LIMITS[k]} characters)`).join(", ")}`;
  return null;
};

const ZONED = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/;
const LOCAL = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/;
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

// How far New York's wall clock is ahead of UTC (negative) at the instant t.
const nyOffset = (t: number) => {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
      .formatToParts(t)
      .map((x) => [x.type, x.value]),
  );
  return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - Math.floor(t / 1000) * 1000;
};

// ISO 8601 with a zone is taken as is. "2026-11-05 18:00" (what a Google Forms date-time
// question gives) is Gainesville time. Anything else is an error message.
const parseDatetime = (s: string): Date | string => {
  const bad = `Couldn't read datetime "${s}". Use YYYY-MM-DD HH:MM (Eastern time) or ISO 8601 with a zone.`;
  if (DATE_ONLY.test(s)) return "datetime needs a time as well as a date";
  // Date rolls Feb 31 over into March instead of failing, so check the calendar date by hand
  const [y, mo, d] = s.slice(0, 10).split("-").map(Number);
  const day = new Date(Date.UTC(y, mo - 1, d));
  if (day.getUTCMonth() !== mo - 1 || day.getUTCDate() !== d) return bad;
  if (ZONED.test(s)) {
    const zoned = new Date(s);
    return isNaN(zoned.getTime()) ? bad : zoned;
  }
  const m = LOCAL.exec(s);
  if (!m) return bad;
  const [h, mi, se] = m.slice(4).map((n) => Number(n ?? 0));
  if (h > 23 || mi > 59 || se > 59) return bad;
  const wall = Date.UTC(y, mo - 1, d, h, mi, se);
  // the offset that applies at that wall time, not at the wall time read as UTC; the second
  // pass settles the hours around a DST change
  const first = wall - nyOffset(wall);
  return new Date(wall - nyOffset(first));
};

// One entry per form. Adding a form type is one more entry here.
const TYPES: Record<string, { table: "workshops" | "news"; link: "workshop_id" | "news_id"; map: (f: Fields) => Mapped }> = {
  workshop: {
    table: "workshops",
    link: "workshop_id",
    map: (f) => {
      const error = check(f, ["title", "speaker", "datetime"], ["description", "link", "location"]);
      if (error) return { error };
      const datetime = parseDatetime(text(f, "datetime")!);
      if (typeof datetime === "string") return { error: datetime };
      const link = text(f, "link");
      if (link && !/^https?:\/\/\S+$/i.test(link)) return { error: "link must be an http(s) URL" };
      return {
        row: {
          title: text(f, "title"),
          speaker: text(f, "speaker"),
          datetime: datetime.toISOString(),
          description: text(f, "description") ?? null,
          link: link ?? null,
          // leave the column default when the form skips it
          ...(text(f, "location") && { location: text(f, "location") }),
        },
      };
    },
  },
  news: {
    table: "news",
    link: "news_id",
    map: (f) => {
      const error = check(f, ["title", "category"], ["summary", "content"]);
      if (error) return { error };
      const raw = text(f, "category")!.toLowerCase();
      const match = NEWS_CATEGORIES.find((c) => c.value.toLowerCase() === raw || c.label.toLowerCase() === raw);
      if (!match) {
        return { error: `Unknown category "${text(f, "category")}". Expected one of: ${NEWS_CATEGORIES.map((c) => c.label).join(", ")}` };
      }
      return {
        row: {
          title: text(f, "title"),
          category: match.value,
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

const fail = (error: string, status: number) => Response.json({ error }, { status });

export async function POST(req: NextRequest) {
  if (!authorized(req.headers.get("authorization"))) return fail("Unauthorized", 401);

  const tooBig = `Body is over ${MAX_BODY / 1024}KB`;
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY) return fail(tooBig, 413);
  const raw = await req.text();
  if (Buffer.byteLength(raw) > MAX_BODY) return fail(tooBig, 413);

  let body: { type?: unknown; responseId?: unknown; fields?: unknown; email?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    return fail("Body must be JSON", 400);
  }
  if (!body || typeof body !== "object") return fail("Body must be a JSON object", 400);

  const config = typeof body.type === "string" ? TYPES[body.type.trim().toLowerCase()] : undefined;
  if (!config) return fail(`Unknown type "${body.type}". Expected one of: ${Object.keys(TYPES).join(", ")}`, 400);
  const responseId = typeof body.responseId === "string" ? body.responseId.trim() : "";
  if (!responseId) return fail("Missing responseId", 400);
  if (responseId.length > 200) return fail("responseId is too long", 400);
  if (!body.fields || typeof body.fields !== "object" || Array.isArray(body.fields)) return fail("fields must be an object", 400);
  const email = typeof body.email === "string" && body.email.trim() ? body.email.trim().toLowerCase() : null;
  if (email && email.length > 320) return fail("email is too long", 400);

  const mapped = config.map(body.fields as Fields);
  if ("error" in mapped) return fail(mapped.error, 400);

  const db = adminClient();
  const sources = () => db.schema("admin").from("draft_submissions");

  // Claim the response id first; the unique constraint is what catches a resend.
  const { data: claimed, error: claimError } = await sources()
    .insert({ table_name: config.table, source_response_id: responseId, submitted_by_email: email })
    .select("id")
    .single();
  let sourceId: string | undefined = claimed?.id;

  if (claimError?.code === "23505") {
    const { data: existing, error } = await sources().select("*").eq("source_response_id", responseId).single();
    if (error || !existing) {
      console.error("Form submission lookup failed:", error);
      return fail("Couldn't save the submission", 500);
    }
    const rowId: string | null = existing.news_id ?? existing.workshop_id;
    if (rowId) {
      // An edited response: refresh the draft, but never touch one that's been published
      // (or one whose type changed in the edit).
      if (existing.table_name !== config.table) return Response.json({ duplicate: true }, { status: 200 });
      const { data: updated, error: updateError } = await db
        .from(config.table)
        .update(mapped.row)
        .eq("id", rowId)
        .eq("status", "draft")
        .select("id");
      if (updateError) {
        console.error("Form submission update failed:", updateError);
        return fail("Couldn't save the submission", 500);
      }
      if (!updated?.length) return Response.json({ duplicate: true }, { status: 200 });
      await sources().update({ submitted_by_email: email }).eq("id", existing.id);
      return Response.json({ updated: true, id: rowId }, { status: 200 });
    }
    // claimed by an earlier attempt that never made its draft: finish it now
    sourceId = existing.id;
  } else if (claimError) {
    console.error("Form submission claim failed:", claimError);
    return fail("Couldn't save the submission", 500);
  }

  const { data: row, error } = await db
    .from(config.table)
    .insert({ ...mapped.row, status: "draft", author: null })
    .select("id")
    .single();
  if (error || !row) {
    console.error("Form submission insert failed:", error);
    await sources().delete().eq("id", sourceId);
    return fail("Couldn't save the submission", 500);
  }

  const { error: linkError } = await sources()
    .update({ table_name: config.table, [config.link]: row.id, submitted_by_email: email })
    .eq("id", sourceId);
  if (linkError) {
    console.error("Form submission link failed:", linkError);
    await db.from(config.table).delete().eq("id", row.id);
    await sources().delete().eq("id", sourceId);
    return fail("Couldn't save the submission", 500);
  }
  return Response.json({ id: row.id }, { status: 201 });
}
