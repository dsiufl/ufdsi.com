'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SidebarLogo() {
    const router = useRouter();
    return (
        <Button
            onClick={() => {
                router.push('/admin/dashboard');
            }}
            className={`header-logo block bg-transparent hover:!bg-transparent !p-0`}
        >
            <div className="py-2 w-full h-fit flex items-center justify-start">
                <Image
                    src="/images/logo/hd-transparent-dsi-logo.png"
                    alt="DSI logo"
                    width={100}
                    height={100}
                />
            </div>
            
        </Button>
    );
}