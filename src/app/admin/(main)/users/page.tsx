import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Users from "./components/Users";
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

const ALLOWED_ROLES = ["President", "Technology Coordinator"];

export default async function Page() {
    // Gate: only Presidents / Technology Coordinators may view the user list.
    const cookieStore = await cookies();
    const userClient = await createServerClient(cookieStore);
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) redirect("/admin/login");
    const { data: profile } = await userClient.schema("admin").from("people").select("role").eq("id", user.id).single();
    if (!profile?.role || !ALLOWED_ROLES.includes(profile.role)) {
        redirect("/admin/dashboard");
    }

    const supabase = await createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_ADMIN_KEY!,
    )
    const { data, error } = await supabase.schema('admin').from('people').select('*');
    if (error) {
        console.log(error);
        throw new Error('Error fetching users');
    }
    return (
        <div className="pt-[10%] relative top-0 left-0 flex flex-col items-center w-full h-screen">
            <h1>Manage users</h1>
            <Users data={data} />
        </div>
    );
}