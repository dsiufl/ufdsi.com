
import { cookies } from "next/headers";
import Workshops from "./components/Workshops";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function WorkshopsPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const workshops = await supabase.from("workshops").select("*");
  console.log("workshops", workshops);
  if (workshops.error) {
    notFound();
  }
  return (
    <Workshops workshops={workshops.data ?? []} />
  );
} 