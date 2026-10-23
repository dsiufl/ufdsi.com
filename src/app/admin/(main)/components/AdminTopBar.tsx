"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createUserClient } from "@/lib/supabase/client";
import { ChevronsUpDown, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

/** Account chip in the sidebar footer. */
export function AdminTopBar({
  firstName,
  lastName,
  role,
}: {
  firstName: string;
  lastName: string;
  role?: string;
}) {
  const router = useRouter();
  const supabase = createUserClient();
  const [loading, setLoading] = useState(false);
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "?";

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    router.push("/admin/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-sidebar-accent data-[state=open]:bg-sidebar-accent">
          <span className="is-round flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--a-ink)] text-[13px] font-semibold text-white">
            {initials}
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-sm font-medium text-foreground">
              {firstName} {lastName}
            </span>
            {role && <span className="block truncate text-xs text-muted-foreground">{role}</span>}
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-[--radix-dropdown-menu-trigger-width] min-w-52">
        <DropdownMenuLabel className="font-normal text-muted-foreground">Signed in as {firstName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/admin/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          Profile and password
        </DropdownMenuItem>
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
  );
}
