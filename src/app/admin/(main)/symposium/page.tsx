
import { Button } from "@/components/ui/button";
import type { AdminInfo, Symposium } from "@/types/db";
import { createClerkBridgedServerClient } from "@/lib/supabase/server";
import Main from "./components/Main";
import { auth } from "@clerk/nextjs/server";

export default async function Page() {
    const { userId } = await auth();
    const supabase = await createClerkBridgedServerClient();
    const symposiums = await supabase.from("symposiums").select('*')
    const {data: profile}: {data: AdminInfo} = await supabase.schema("admin").from("people").select().eq('id', userId).single()

    // `/api/symposium/create` now reads the Clerk session itself; this prop is
    // vestigial and kept only so Main's existing fetch body doesn't break.
    return (
        <div className="md:top-0 flex flex-col h-screen w-full items-center justify-center">
            <Main symposiums={symposiums.data} token={null} />
        </div>
    )
}