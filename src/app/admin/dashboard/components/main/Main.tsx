'use client';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { useState } from "react";
import Actions from "../pages/Actions";
import { AdminInfo } from "@/types/db";

export default function Main({data}: {data: AdminInfo}) {
    const [page, setPage] = useState<"Actions" | "Settings">("Actions")
    return (
        <div className="w-[90%] h-[70%] max-w-7xl p-5 bg-white dark:bg-black border border-white/10 rounded-xl">
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button>{page} <ArrowDown /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="max-h-[200px]">
                        <DropdownMenuItem 
                            className={`${page == "Actions" ? "bg-gray-700" : ""}`}
                            onClick={() => setPage("Actions")}
                        >
                            Actions
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            className={`${page == "Settings" ? "bg-gray-700" : ""}`}
                            onClick={() => setPage("Settings")}
                        >
                            Settings
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                {
                    page === "Actions" ? <Actions data={data} /> : <></>
                }
            </div>
    );
}