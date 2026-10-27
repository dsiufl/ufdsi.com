import type { ReactNode } from "react";
import { AdminShell, type AdminNavItem } from "./components/AdminShell";
import { redirect } from "next/navigation";
import { createClerkBridgedServerClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { AdminInfo } from "@/types/db";

// Every page under this layout needs a live Clerk session + DB lookup --
// never statically prerender it at build time.
export const dynamic = "force-dynamic";

export default async function Layout({ children }: { children: ReactNode }) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/admin/login");
  }
  const supabase = await createClerkBridgedServerClient();
  const req: { data: AdminInfo | null } = await supabase
    .schema("admin")
    .from("people")
    .select()
    .eq("id", userId)
    .single();
  const data = req.data;
  const actions = await supabase
    .schema("admin")
    .from("actions")
    .select()
    .contains("role", [data?.role]);

  const actionItems: AdminNavItem[] =
    actions.data?.map((action) => ({
      title: action.title,
      href: action.redirect,
    })) ?? [];

  const deduped = actionItems.filter(
    (a, i, arr) => arr.findIndex((x) => x.href === a.href) === i,
  );
  const withoutDashboard = deduped.filter((a) => a.href !== "/admin/dashboard");
  const navItems: AdminNavItem[] = [
    { title: "Dashboard", href: "/admin/dashboard" },
    ...withoutDashboard,
    ...(!deduped.some((a) => a.href === "/admin/templates")
      ? [{ title: "Templates", href: "/admin/templates" }]
      : []),
  ];

  return (
    <AdminShell
      navItems={navItems}
      user={
        data
          ? {
              firstName: data.first_name ?? "User",
              lastName: data.last_name ?? "",
            }
          : undefined
      }
    >
      {children}
    </AdminShell>
  );
}
