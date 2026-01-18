import Header from "@/components/Header";
import { createClient } from "@/lib/supabase/server";
import { AdminInfo } from "@/types/db";
import { UserResponse } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import Image from "next/image";
import Main from "./components/main/Main";
import Info from "./components/main/Info";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function Page() {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const { data: { user } }: UserResponse = await supabase.auth.getUser();
    console.log(user);
    const req: {data: AdminInfo} = await supabase.schema("admin").from('people').select().eq('id', user?.id).single()
    const data = req.data;
    console.log(req);
    
    return (
        <>
        <Header />
        <div className="absolute bottom-0 overflow-y-auto left-0 flex h-screen w-screen flex-col items-center justify-center">
            <div className="relative w-[90%] max-w-7xl flex justify-between mb-2">
            <div className="h-[50px] flex flex-row justify-center items-center">
                <p className="font-bold">{data?.displayName}</p>
            </div>
            <div className="flex flex-row gap-2 justify-center">
                <p>{data?.role} | Data Science and Informatics</p>
                <Button onClick={() => {
                    supabase.auth.signOut()
                    console.log("signed out..")
                    redirect('/admin/login')
                    

                }} className="danger">Sign out</Button>
            </div>
        </div>
            <Main data={data} />   
        </div>
        </>
    );
}