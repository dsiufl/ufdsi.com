'use client';
import { Button } from "@/components/ui/button";
import { createUserClient } from "@/lib/supabase/client";
import { AdminInfo } from "@/types/db";
import { useRouter } from "next/navigation";

export default function Info({data}: {data: AdminInfo}) {
    const userbase = createUserClient();
    const router = useRouter();
    return (
        <div className="relative w-[90%] max-w-7xl flex justify-between mb-2">
        <div className="h-[50px] flex flex-row justify-center items-center">
            <p className="font-bold">{data?.displayName}</p>
        </div>
        <div className="flex flex-row gap-2 justify-center">
            <p>{data?.role} | Data Science and Informatics</p>
            <Button onClick={() => {
                userbase.auth.signOut()
                console.log("signed out..")
                router.refresh();
                

            }} className="danger">Sign out</Button>
        </div>
        </div>
    )
}