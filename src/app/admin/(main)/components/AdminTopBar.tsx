"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClerk } from "@clerk/nextjs";
import { LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminTopBar({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  const router = useRouter();
  const { signOut: clerkSignOut } = useClerk();
  const [loading, setLoading] = useState(false);
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "?";

  const signOut = async () => {
    setLoading(true);
    await clerkSignOut({ redirectUrl: "/admin/login" });
    setLoading(false);
  };

  return (
    <div className="flex w-full items-center justify-end gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-auto gap-2 rounded-lg px-2 py-1.5 hover:bg-muted"
          >
            <Avatar className="h-9 w-9 border-0">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="hidden text-left text-sm font-medium leading-tight sm:block">
              {firstName} {lastName}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push("/admin/settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            disabled={loading}
            onClick={signOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
