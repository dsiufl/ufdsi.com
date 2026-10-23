import Editor from "./components/Editor";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function page() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const projects = await supabase.from("projects").select("*").order("created_at", { ascending: false });
  if (projects.error) notFound();
  return <Editor projects={projects.data ?? []} />;
}
