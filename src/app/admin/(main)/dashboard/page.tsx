import { createClient } from "@/lib/supabase/server";
import { getAdminProfile } from "@/lib/supabase/admin";
import type { Activity, AdminInfo, Speaker, Symposium } from "@/types/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardView, type ActivityRow, type WorkshopCard } from "./DashboardView";

function buildActivityDescription(
  activity: Activity,
): string {
  let description = "";
  if (activity.people) {
    description += `${activity.people.first_name} ${activity.people.last_name} `;
  } else {
    description += "A user ";
  }

  switch (activity.action_type) {
    case "INSERT":
      description += "created";
      break;
    case "UPDATE":
      description += "updated";
      break;
    case "DELETE":
      description += "deleted";
      break;
    default:
      description += activity.action_type;
  }

  switch (activity.table_name) {
    case "speakers": {
      const speaker = (activity.new_data ??
        activity.old_data ??
        {}) as Speaker;
      description += ` speaker ${speaker.name}`;
      const speakerSymposium = speaker.symposium ?? "unknown";
      description += ` for ${speakerSymposium} symposium`;
      break;
    }
    case "symposium": {
      const symposium = activity.new_data
        ? (activity.new_data as Symposium).year
        : null;
      description += ` ${symposium} symposium`;
      break;
    }
    case "people": {
      const pdata = activity.new_data ?? activity.old_data;
      const person = pdata
        ? `${(pdata as AdminInfo).first_name} ${(pdata as AdminInfo).last_name}`
        : "a user";
      description += ` user ${person}`;
      break;
    }
    case "news": {
      const article = activity.new_data ?? activity.old_data;
      const title = article ? (article as { title?: string }).title : "an article";
      description += ` news article ${title}`;
      break;
    }
    case "workshops":
    case "projects": {
      const row = (activity.new_data ?? activity.old_data) as { title?: string } | null;
      const kind = activity.table_name === "workshops" ? "workshop" : "project";
      description += row?.title ? ` ${kind} ${row.title}` : ` a ${kind}`;
      break;
    }
    default:
      description += ` on ${activity.table_name}`;
  }

  return description;
}

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const data = await getAdminProfile<AdminInfo>(user?.id);

  if (!data || !data.account_setup) {
    redirect("/admin/welcome");
  }

  const { data: activities } = await supabase
    .schema("admin")
    .from("activity_log")
    .select("*, people (first_name, last_name)")
    .order("created_at", { ascending: false })
    .limit(25);

  const now = new Date();
  const since = new Date(now.getTime() - 8 * 7 * 86400000).toISOString();
  const [{ data: workshops }, { count: upcoming }, { count: drafts }, { count: openForms }, { data: history }] = await Promise.all([
    supabase
      .from("workshops")
      .select("*")
      .gte("datetime", new Date(now.getTime() - 3 * 3600 * 1000).toISOString())
      .order("datetime", { ascending: true })
      .limit(5),
    supabase.from("workshops").select("id", { count: "exact", head: true }).gte("datetime", now.toISOString()),
    supabase.from("news").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("forms").select("id", { count: "exact", head: true }).eq("status", "open"),
    supabase
      .schema("admin")
      .from("activity_log")
      .select("created_at, table_name")
      .gte("created_at", since)
      .limit(5000),
  ]);

  const rows: ActivityRow[] = (activities ?? []).map((activity) => ({
    id: activity.id,
    actor: activity.people
      ? `${activity.people.first_name} ${activity.people.last_name}`
      : "A user",
    description: buildActivityDescription(activity as Activity),
    created_at:
      typeof activity.created_at === "string"
        ? activity.created_at
        : new Date(activity.created_at).toISOString(),
    table_name: activity.table_name,
    action: activity.action_type,
  }));

  const workshopCards: WorkshopCard[] = (workshops ?? []).map((w) => ({
    id: w.id,
    title: w.title,
    speaker: w.speaker,
    datetime:
      typeof w.datetime === "string"
        ? w.datetime
        : new Date(w.datetime).toISOString(),
    location: w.location,
    link: w.link,
  }));

  const hour = Number(
    now.toLocaleString("en-US", { hour: "numeric", hourCycle: "h23", timeZone: "America/New_York" }),
  );
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const weekAgo = now.getTime() - 7 * 86400000;

  return (
    <DashboardView
      greeting={`${greeting}, ${data.first_name ?? "there"}.`}
      role={data.role}
      activities={rows}
      history={(history ?? []).map((h) => ({
        at: typeof h.created_at === "string" ? h.created_at : new Date(h.created_at).toISOString(),
        table: h.table_name,
      }))}
      workshops={workshopCards}
      stats={{
        upcoming: upcoming ?? workshopCards.length,
        drafts: drafts ?? 0,
        openForms: openForms ?? 0,
        thisWeek: rows.filter((r) => new Date(r.created_at).getTime() > weekAgo).length,
      }}
    />
  );
}
