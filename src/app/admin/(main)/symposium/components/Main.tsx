'use client';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { Symposium } from "@/types/db";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowDownWideNarrow } from "lucide-react";
import { useState } from "react";

export default function Main({symposiums}: {symposiums: Symposium[]}) {
    const router = useRouter();
    const [ loading, setLoading ] = useState<boolean>(false);
    return (
        <div className="size-96 p-4 dark:bg-black flex flex-col items-center justify-center">
            <h3 className="mb-0">Choose a symposium</h3>
            <div className="h-0.5 w-full dark:bg-amber-50/30 my-4"></div>
            <div className="w-full flex flex-col justify-center items-center">
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button className="bg-transparent border border-[#FF5722]  hover:!translate-y-0 hover:bg-transparent"><ArrowDownWideNarrow />
                            {loading ? <Spinner /> : "Select Symposium"}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {symposiums.map((symp) => (
                            <DropdownMenuItem key={symp.id} onClick={() => {
                                router.push(`/admin/symposium/${symp.id}`)
                                setLoading(true);
                            }}>
                                Symposium {symp.id} - {new Date(symp.date).toLocaleDateString()}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                    
                </DropdownMenu>
            
            <Button className="m-4 bg-tran" onClick={() => {}}>Create Symposium</Button>
            </div>
        </div>
    );
}