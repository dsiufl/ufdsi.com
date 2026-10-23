import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getAdminProfile } from "@/lib/supabase/admin";
import { UserResponse } from "@supabase/supabase-js";
import { AdminInfo } from "@/types/db";
import Settings from "./Settings";
import { redirect } from "next/navigation";
export default async function page() {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);
        const { data: { user } }: UserResponse = await supabase.auth.getUser();

        const data = await getAdminProfile<AdminInfo>(user?.id);
        if (!data || !data.account_setup) {
            console.log('redirecting to setup');
            redirect("/admin/welcome");
        }
        return <Settings data={data} />
}