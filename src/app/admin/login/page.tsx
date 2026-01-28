import { createClient } from "@supabase/supabase-js";
import Login from "./components/Login";
import validateToken from "@/lib/supabase/validate";
import { redirect } from "next/navigation";




export default async function Page({ params }: {params: { [key: string]: string | string[] | undefined}}) {
    
    return (
        <div className="absolute flex h-screen w-screen items-center justify-start z-0 bg-[url(/images/hero/landing-page.jpg)]">
            <Login />
        </div>
    )
    
}