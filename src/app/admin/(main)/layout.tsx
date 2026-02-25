import Header from "@/components/Header";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import AuthFooter from "./components/AuthFooter";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import SidebarLogo from "./components/SidebarLogo";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { AdminInfo } from "@/types/db";
export default async function Layout({children}) {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/admin/login');
    }
    const req: {data: AdminInfo} = await supabase.schema("admin").from('people').select().eq('id', user?.id).single()
    const data = req.data;
    const actions = await supabase.schema('admin').from('actions').select().contains('role',[data.role]);
    console.log("actions", actions);
    return (
        <div className="flex w-screen h-screen">
            <SidebarProvider className="w-fit">
                <SidebarTrigger className="md:absolute md:hidden fixed top-5 md:top-auto right-5 md:right-auto md:left-[110%]" style={{zIndex: 100}}>
                    
                </SidebarTrigger>
                <Sidebar className="relative !bg-[#000000]/30">
                    <SidebarHeader className="flex flex-row items-start justify-start p-4 mb-5">
                        <SidebarLogo />
                        <SidebarTrigger className="absolute left-[110%]">
                            <ArrowLeft className="cursor-pointer" />
                        </SidebarTrigger>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarGroup className="flex gap-2">
                            {actions.data && actions.data.map((action, index) => (
                                <Link key={index} href={action.redirect} className="w-full h-full p-2 rounded-xl hover:shadow-xl hover:border transition duration-300 hover:dark:bg-[#000000]/50">
                                    {action.title}
                                </Link>
                            ))}
                        </SidebarGroup>
                    </SidebarContent>
                    <SidebarFooter className="absolute bottom-0 w-full flex flex-row items-center justify-between py-2">
                        <AuthFooter />
                    </SidebarFooter>
                </Sidebar>
                
    
             </SidebarProvider>
            <div className="h-screen overflow-y-scroll grow">
            {children}
            </div>
            
        </div>
    )
}