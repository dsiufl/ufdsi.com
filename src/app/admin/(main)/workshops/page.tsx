import Editor from "./components/Editor";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function page() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const workshops = await supabase.from("workshops").select("*").order("datetime", { ascending: true });
  if (workshops.error) notFound();
  return <Editor workshops={workshops.data ?? []} />;
}
