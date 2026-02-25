import { createClient } from "@/lib/supabase/server";
import Form from "./components/Form";
import { cookies } from "next/headers";
import { unauthorized } from "next/navigation";

export default async function Page({ params }) {
    const supabase = await createClient(await cookies());
    const {data: { session}} = await supabase.auth.getSession();
    if (!session) {
        unauthorized();
    }
    
    console.log('password setup')
    return (
        <div className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen">
            <div className="flex flex-col items-center justify-center dark:bg-[#000000]/30 border shadow-xl p-8 rounded-xl">
                    <h2 className="mb-4">Create your password</h2>
                    <p className="mb-8 text-center max-w-md">Welcome to Data Science and Informatics. Please set your password to access the admin dashboard.</p>
                    <Form />
            </div>
        </div>
    )
}