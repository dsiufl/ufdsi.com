import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Client from "./client";

export const metadata: Metadata = {
  title: "Symposium - UF DSI",
  description: "DSI's annual spring symposium.",
};

export default async function Page({ params }: { params: { year: string } }) {
    const { year } = await params;
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const {data: symposium, error: symError} = await supabase.from('symposiums').select('*').eq('year', year).single()
    const {data: speakers, error: spkError} = await supabase.from('speakers').select('*').eq('symposium', year)
    if (symError) {
        console.error(symError);
        return <div>Error loading symposium data.</div>;
    }
    if (spkError) {
        console.error(spkError);
        return <div>Error loading speakers data.</div>;
    }
    if (!symposium || symposium.length === 0) {
        return <div>No symposium found for the year {year}.</div>;
    }
    
    return (
        <Client symposium={symposium} speakers={speakers} selectedYear={year}/>
    );
}

