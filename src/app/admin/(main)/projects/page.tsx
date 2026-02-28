import Editor from "./components/Editor";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function page() {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const projects = await supabase.from("projects").select("*")
      if (projects.error) {
        notFound();
      }
    return (
        <div className="pt-[10%] w-full h-screen flex flex-col text-center items-center justify-center">
            <h2>DSI Projects</h2>
            <div className="w-full h-full py-4 px-10 bg-gray-400/20 dark:bg-[#000000]/30 flex flex-col items-start">
                <Editor projects={projects.data} />
            </div>
        </div>
    )
}