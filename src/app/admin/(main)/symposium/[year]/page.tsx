

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
    const {data: symposium}: {data: Symposium | null} = await supabase.from("symposiums").select().eq("id", year).maybeSingle();
    if (!symposium) notFound();
    const {data: speakers} = await supabase.from("speakers").select().eq("symposium", symposium.year);
    if (!speakers) notFound();
    return (
        <Editor speakers={speakers} symposium={symposium} />
    )
}