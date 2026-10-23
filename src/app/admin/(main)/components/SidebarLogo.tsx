import Image from "next/image";
import Link from "next/link";

export default function SidebarLogo() {
  return (
    <Link href="/admin/dashboard" aria-label="Go to dashboard" className="flex w-fit items-center">
      <Image
        src="/images/logo/hd-transparent-dsi-logo.png"
        alt="DSI"
        width={132}
        height={44}
        className="h-8 w-auto object-contain object-left dark:brightness-0 dark:invert"
      />
    </Link>
  );
}
