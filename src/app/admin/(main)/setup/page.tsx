import { Button } from "@/components/ui/button";
import Setup from "./components/Setup";
import { createCacheKey } from "next/dist/client/components/segment-cache/cache-key";
import { createClient } from "@/lib/supabase/server";
import { createClient as cc } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect, unauthorized } from "next/navigation";
import { Profile } from "@/types/db";

export default async function Page() {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const { data: {user} } = await supabase.auth.getUser();
    if (!user) {
        unauthorized();
    }
    const adminbase = cc(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_ADMIN_KEY!,
        {auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false,
        }}
    )
    console.log(await adminbase.auth.admin.generateLink({
        email: user?.email!,
        type: "magiclink"
    }))
    const session = await supabase.auth.getSession();
    const token = session.data.session.access_token;
    const {data: profile}: {data: Profile} = await supabase.schema("admin").from('people').select().eq('id', user.id).single()
    profile.email = user.email;
    if (profile.account_setup) {
        redirect('/admin/dashboard');
    }
    return (
        <div className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen">

        
        <div className="flex flex-col items-center justify-center dark:bg-[#000000]/30 shadow-xl p-8 rounded-xl">
                <h2 className="mb-4">Setup Admin Account</h2>
                <p className="mb-8 text-center max-w-md">Welcome to Data Science and Informatics. Please create one to access the admin dashboard.</p>
                <Setup data={profile} token={token} />    
        </div>
        </div>
    )    
}