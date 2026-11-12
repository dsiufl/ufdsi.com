import Setup from "./components/Setup";
import { createClerkBridgedServerClient } from "@/lib/supabase/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect, unauthorized } from "next/navigation";
import { Profile } from "@/types/db";

export default async function Page() {
    const { userId } = await auth();
    if (!userId) {
        unauthorized();
    }
    const supabase = await createClerkBridgedServerClient();
    const { data: profile }: { data: Profile } = await supabase
        .schema("admin")
        .from("people")
        .select()
        .eq("id", userId)
        .single();

    if (profile?.account_setup) {
        redirect('/admin/dashboard');
    }
    if (profile && !profile.email) {
        const user = await currentUser();
        profile.email = user?.primaryEmailAddress?.emailAddress ?? profile.email;
    }
    return (
        <div className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen">
        <div className="flex flex-col items-center justify-center dark:bg-[#000000]/30 shadow-xl p-8 rounded-xl">
                <h2 className="mb-4">Setup Admin Account</h2>
                <p className="mb-8 text-center max-w-md">Welcome to Data Science and Informatics. Please create one to access the admin dashboard.</p>
                <Setup data={profile} />
        </div>
        </div>
    )
}