import Editor from "./components/Editor";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { canPublishWorkshops } from "@/lib/workshops";

export default async function page() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.schema("admin").from("people").select("role").eq("id", user?.id).single();

  const [workshops, { data: people }, { data: sources }] = await Promise.all([
    supabase.from("workshops").select("*").order("datetime", { ascending: true }),
    supabase.schema("admin").from("people").select("id, first_name, last_name"),
    supabase.schema("admin").from("draft_submissions").select("workshop_id, submitted_by_email").not("workshop_id", "is", null),
  ]);
  if (workshops.error) notFound();
  const names = Object.fromEntries((people ?? []).map((p) => [p.id, `${p.first_name} ${p.last_name}`]));
  // workshops that came in through the Google Form, and who sent them
  const senders = Object.fromEntries((sources ?? []).map((s) => [s.workshop_id, s.submitted_by_email ?? ""]));
  return (
    <Editor
      workshops={workshops.data ?? []}
      canPublish={canPublishWorkshops(profile?.role)}
      userId={user?.id}
      names={names}
      senders={senders}
    />
  );
}
