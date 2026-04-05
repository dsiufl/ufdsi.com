import { createClient } from "@/lib/supabase/server";
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

  const req: { data: AdminInfo | null } = await supabase
    .schema("admin")
    .from("people")
    .select()
    .eq("id", user?.id)
    .single();
  const data = req.data;

  if (!data || !data.account_setup) {
    redirect("/admin/setup");
  }

  const { data: activities } = await supabase
    .schema("admin")
    .from("activity_log")
    .select("*, people (first_name, last_name)")
    .order("created_at", { ascending: false })
    .limit(25);

  const { data: workshops } = await supabase
    .from("workshops")
    .select("*")
    .order("datetime", { ascending: true })
    .limit(12);

  const rows: ActivityRow[] = (activities ?? []).map((activity) => ({
    id: activity.id,
    description: buildActivityDescription(activity as Activity),
    created_at:
      typeof activity.created_at === "string"
        ? activity.created_at
        : new Date(activity.created_at).toISOString(),
    table_name: activity.table_name,
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
    cover: w.cover,
    link: w.link,
  }));

  const roleLabel = `${data.role} · Data Science and Informatics`;

  return (
    <DashboardView
      firstName={data.first_name ?? "there"}
      roleLabel={roleLabel}
      activities={rows}
      workshops={workshopCards}
    />
  );
}
