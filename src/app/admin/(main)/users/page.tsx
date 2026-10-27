export const dynamic = 'force-dynamic';

import { redirect } from "next/navigation";
import Users from "./components/Users";
import { auth } from "@clerk/nextjs/server";
import { createClerkBridgedServerClient } from "@/lib/supabase/server";

const ALLOWED_ROLES = ["President", "Technology Coordinator"];

export default async function Page() {
    const { userId } = await auth();
    if (!userId) redirect("/admin/login");

    // RLS (people_select_all_privileged) returns every officer row for
    // President/Technology Coordinator; everyone else just gets their own
    // row back — no separate service-role bypass needed anymore.
    const supabase = await createClerkBridgedServerClient();
    const { data, error } = await supabase.schema('admin').from('people').select('*');
    if (error) {
        console.log(error);
        throw new Error('Error fetching users');
    }

    const self = data?.find((p) => p.id === userId);
    if (!self?.role || !ALLOWED_ROLES.includes(self.role)) {
        redirect("/admin/dashboard");
    }

    return (
        <div className="container pt-20">
            <Users data={data ?? []} />
        </div>
    );
}
