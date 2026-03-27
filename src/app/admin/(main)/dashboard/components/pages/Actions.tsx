'use client';
import { Button } from "@/components/ui/button";
import { createUserClient } from "@/lib/supabase/client";
import { Action, AdminInfo } from "@/types/db";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";


export default function Actions({data, className}: {data?: AdminInfo, className?: string}) {
    const [actions, setActions] = useState<Action[] | undefined>(undefined);
    const [size, setSize] = useState<{width: number, height: number}>({width:0, height:0})
    const supabase = createUserClient();
    const router = useRouter()
    
    useEffect(() => {

        console.log("getting...")
        supabase.schema('admin').from('actions').select().contains('role',[data.role]).then((done) => {
            console.log("actions", done)
            setActions(done.data)
        })
    }, [])
    useEffect(() => {
        setSize({width: window.innerWidth, height: window.innerHeight})
        const func = () => {
            setSize({width: window.innerWidth, height: window.innerHeight})
        }
        window.addEventListener('resize', func)
        return () => {
            window.removeEventListener('resize', func)
        }
    }, [window])

    return (
        <div className={`mt-2 w-full flex flex-col lg:flex-row flex-grow gap-4 py-2 ${className}`}>
            
            {actions && actions.map((action, index) => (
                <div key={index} className=" relative md:h-[13rem] rounded-xl p-4 w-full shadow-2xl hover:bg-amber-50 dark:bg-[#000000]/30">
                    <h3>{action.title}</h3>
                    <p className="line-clamp-1 md:line-clamp-2 lg:line-clamp-3 text-ellipsis flex shrink">{action.description}</p>
                    <div className="flex lg:absolute bottom-0 py-4">
                        <a className="relative bottom-0 button" onClick={() => {
                            router.push(action.redirect)
                        }}>{action.action}</a>
                    </div>
                    
                </div>
            ))}
        </div>
    )
}