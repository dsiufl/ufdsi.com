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

  const [workshops, { data: people }] = await Promise.all([
    supabase.from("workshops").select("*").order("datetime", { ascending: true }),
    supabase.schema("admin").from("people").select("id, first_name, last_name"),
  ]);
  if (workshops.error) notFound();
  const names = Object.fromEntries((people ?? []).map((p) => [p.id, `${p.first_name} ${p.last_name}`]));
  return (
    <Editor
      workshops={workshops.data ?? []}
      canPublish={canPublishWorkshops(profile?.role)}
      userId={user?.id}
      names={names}
    />
  );
}
