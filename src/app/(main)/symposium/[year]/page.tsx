import SymposiumNew from "@/components/symposium-new";
import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";


export const metadata: Metadata = {
  title: "Symposium - UF DSI",
  description: "DSI's annual spring symposium.",
};

export default async function SymposiumNewPage(context) {
  const { year } = await context.params
  if (process.env.NODE_ENV !== 'development' && year === '2026') {
    redirect("/symposium/2025")
  }
  const cookieStore = await cookies();
  const serverbase = await createClient(cookieStore);
  const [speakers, symposium] = await Promise.all([
    serverbase.from("speakers").select().eq('symposium',year),
    serverbase.from("symposiums").select().eq('id', year)
  ]);
  console.log(symposium.data);  
  if (!speakers.data || !symposium.data || symposium.data.length === 0) {
    notFound();
    return;
  }

  return (
    <>
      <div className="flex flex-col w-full items-center mb-4">
        <p>{"Looking for the 2026 symposium? We're working on it."} </p>
        <div className="w-[70%] my-2 h-0.5 bg-gray-700/30 dark:bg-amber-50/30"></div>
      </div>
      
      <SymposiumNew speakers={speakers.data} symposium={symposium.data[0]}/>
    </>
  );
};

