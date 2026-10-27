"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClerk } from "@clerk/nextjs";
import { Ellipsis } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

/** Compact account actions for the sidebar footer (profile is in the top bar). */
export default function AuthFooter() {
  const { signOut } = useClerk();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut({ redirectUrl: "/admin/login" });
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-between border-t border-sidebar-border pt-3">
      <span className="text-[11px] text-muted-foreground">Account</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
            aria-label="Account menu"
          >
            <Ellipsis className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push("/admin/settings")}
          >
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            disabled={loading}
            onClick={handleSignOut}
          >
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
