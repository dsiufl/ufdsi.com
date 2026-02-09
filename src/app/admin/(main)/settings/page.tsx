import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { UserResponse } from "@supabase/supabase-js";
import { AdminInfo } from "@/types/db";
import Settings from "./Settings";
import { redirect } from "next/navigation";
export default async function page() {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);
        const { data: { user } }: UserResponse = await supabase.auth.getUser();

        const req: {data: AdminInfo} = await supabase.schema("admin").from('people').select().eq('id', user?.id).single()
        const data = req.data;
        if (!data || !data.account_setup) {
            console.log('redirecting to setup');
            redirect('/admin/setup');
        }
        return <Settings data={data} />
}