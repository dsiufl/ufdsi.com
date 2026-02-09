'use client';
import { Button } from "@/components/ui/button";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { createUserClient } from "@/lib/supabase/client";
import { Profile } from "@/types/db";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { User } from "@supabase/supabase-js";
import { Ellipsis, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthFooter() {
    const supabase = createUserClient();
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ profile, setProfile ] = useState<Profile | null>(null);
    useEffect(() => {
        supabase.auth.getUser().then(({data: {user}}) => {
            return supabase.schema("admin").from('people').select().eq('id', user?.id).single()
        }).then(({data}) => {
            setProfile(data);
        });
    }, [])
    const router = useRouter();
    const handleSignOut = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        setLoading(false);
        router.push('/admin/login');
    };

    return (
        <>
            <p>{profile && profile.first_name + ' ' + profile.last_name}</p>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Ellipsis className="cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="z-50 min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin] max-h-[200px]">
                    <DropdownMenuItem onClick={() => router.push('/admin/settings')}>
                        <Button className="!bg-[#000000]/30">Settings</Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                        <Button className="!bg-[#000000]/30">Sign out</Button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}