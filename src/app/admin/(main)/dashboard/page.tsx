import Header from "@/components/Header";
import { createClient } from "@/lib/supabase/server";
import { AdminInfo } from "@/types/db";
import { UserResponse } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import Image from "next/image";
import Main from "./components/main/Main";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { use } from "react";

export default async function Page() {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const { data: { user } }: UserResponse = await supabase.auth.getUser();

    const req: {data: AdminInfo} = await supabase.schema("admin").from('people').select().eq('id', user?.id).single()
    const data = req.data;
    
    if (!data || !data.account_setup) {
        console.log('redirecting to setup');
        redirect('/admin/setup');
    }   
    return (
        <div className="relative md:absolute md:top-0 flex flex-col h-screen w-full items-center justify-center">
            <div className="relative w-[90%] max-w-7xl flex justify-between mb-2">
                <div className="h-[50px] flex flex-row justify-center items-center">
                    <p className="font-bold">{data?.first_name} {data?.last_name}</p>
                </div>
                <div className="flex flex-row gap-2 justify-center">
                    <p>{data?.role} | Data Science and Informatics</p>
                </div>
            </div>
            <Main data={data} />   
        </div> 
    );
}