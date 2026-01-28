import { cookies } from "next/headers";
import Users from "./components/Users";
import { createClient } from "@supabase/supabase-js";

export default async function Page() {
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
        <div className="relative top-0 left-0 flex flex-col items-center w-full h-screen">
            <h1>Manage users</h1>
            <Users data={data} />
        </div>
    );
}