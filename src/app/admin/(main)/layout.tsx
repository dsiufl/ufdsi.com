import type { ReactNode } from "react";
import { AdminShell, type AdminNavItem } from "./components/AdminShell";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { AdminInfo } from "@/types/db";

export default async function Layout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login");
  }
  const req: { data: AdminInfo | null } = await supabase
    .schema("admin")
    .from("people")
    .select()
    .eq("id", user?.id)
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
