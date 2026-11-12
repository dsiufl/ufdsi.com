import { auth } from "@clerk/nextjs/server";
import { createClerkBridgedServerClient } from "@/lib/supabase/server";
import { AdminInfo } from "@/types/db";
import Settings from "./Settings";
import { redirect } from "next/navigation";
export default async function page() {
        const { userId } = await auth();
        const supabase = await createClerkBridgedServerClient();

        const req: {data: AdminInfo} = await supabase.schema("admin").from('people').select().eq('id', userId).single()
        const data = req.data;
        if (!data || !data.account_setup) {
            console.log('redirecting to setup');
            redirect('/admin/setup');
        }
        return <Settings data={data} />
}