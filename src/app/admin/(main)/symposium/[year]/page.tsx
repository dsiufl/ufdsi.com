

import { createUserClient } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import Editor from "./components/Editor";
import { notFound } from "next/navigation";
import type { Symposium } from "@/types/db";

export default async function Page({
    params
}: {
    params: Promise<{year: number}>
}) {
    const { year } = await params;
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore);
    const {data: symposium}: {data: Symposium} = await supabase.from("symposiums").select().eq("id", year).single();
    const {data: speakers} = await supabase.from("speakers").select().eq("symposium", symposium.year);
    if (!symposium || !speakers) {
        notFound();
        return;
    }
    return (
        <>
             <Editor speakers={speakers} symposium={symposium} /> 
        </>
        
    )
}