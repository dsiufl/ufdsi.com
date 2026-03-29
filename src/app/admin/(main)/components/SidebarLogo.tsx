'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SidebarLogo() {
    const router = useRouter();
    return (
        <div
            onClick={() => router.push('/admin/dashboard')}
            className="cursor-pointer py-2 w-fit h-fit flex items-center justify-start"
        >
            <Image
                src="/images/logo/hd-transparent-dsi-logo.png"
                alt="DSI logo"
                width={100}
                height={100}
            />
        </div>
    );
}
