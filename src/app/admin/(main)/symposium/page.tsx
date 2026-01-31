
import { Button } from "@/components/ui/button";
import type { AdminInfo, Symposium } from "@/types/db";
import { createClient } from "@/lib/supabase/server";
import Main from "./components/Main";
import { cookies } from "next/headers";

export default async function Page() {
    const cookieStore = await cookies()
    const supabase = await createClient(cookieStore);
    const symposiums = await supabase.from("symposiums").select('*')
    const {data: { user }} = await supabase.auth.getUser();
    const token = await supabase.auth.getSession().then((res) => res.data.session?.access_token || null);
    const {data: profile}: {data: AdminInfo} = await supabase.schema("admin").from("people").select().eq('id', user.id).single()

    return (
        <div className="relative md:absolute md:top-0 flex flex-col h-screen w-full items-center justify-center">
            <Main symposiums={symposiums.data} token={token} />
        </div>
    )
}