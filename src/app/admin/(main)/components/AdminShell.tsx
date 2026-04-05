"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Calendar,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Layers,
  Newspaper,
  Settings,
  Users,
  Wrench,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AdminTopBar } from "./AdminTopBar";
import AuthFooter from "./AuthFooter";
import SidebarLogo from "./SidebarLogo";

export type AdminNavItem = {
  title: string;
  href: string;
};

function navItemIsActive(pathname: string, href: string) {
  if (href === "/admin/dashboard") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function iconForHref(href: string): LucideIcon {
  if (href.includes("dashboard")) return LayoutDashboard;
  if (href.includes("forms")) return FileText;
  if (href.includes("users")) return Users;
  if (href.includes("symposium")) return GraduationCap;
  if (href.includes("workshop")) return Calendar;
  if (href.includes("news")) return Newspaper;
  if (href.includes("templates")) return Layers;
  if (href.includes("projects")) return Wrench;
  return LayoutDashboard;
}

export function AdminShell({
  navItems,
  children,
  user,
}: {
  navItems: AdminNavItem[];
  children: ReactNode;
  user?: { firstName: string; lastName: string };
}) {
  const pathname = usePathname();

  const dashboardItem = navItems.find((i) => i.href === "/admin/dashboard");
  const restItems = navItems.filter((i) => i.href !== "/admin/dashboard");

  return (
    <SidebarProvider defaultOpen>
      <Sidebar
        collapsible="offcanvas"
        className="border-r border-sidebar-border"
      >
        <SidebarHeader className="gap-1 border-b border-sidebar-border px-3 py-4">
          <SidebarLogo />
          <p className="px-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Admin · v1
          </p>
        </SidebarHeader>
        <SidebarContent className="gap-0 px-2 py-4">
          {dashboardItem ? (
            <SidebarGroup>
              <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                General
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={navItemIsActive(
                        pathname,
                        dashboardItem.href,
                      )}
                      className="h-9 text-[13px]"
                    >
                      <Link href={dashboardItem.href}>
                        <LayoutDashboard className="size-4 shrink-0 opacity-80" />
                        <span>{dashboardItem.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ) : null}

          {restItems.length > 0 ? (
            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                DSI
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {restItems.map((item) => {
                    const Icon = iconForHref(item.href);
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={navItemIsActive(pathname, item.href)}
                          className="h-9 text-[13px]"
                        >
                          <Link href={item.href}>
                            <Icon className="size-4 shrink-0 opacity-80" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ) : null}
        </SidebarContent>
        <SidebarFooter className="gap-3 border-t border-sidebar-border p-3">
          <div className="flex flex-col gap-1 px-1">
            <Link
              href="/admin/settings"
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Settings className="size-4 opacity-80" />
              Settings
            </Link>
            <a
              href="https://ufdsi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <BookOpen className="size-4 opacity-80" />
              Documentation
            </a>
          </div>
          <AuthFooter />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex min-h-svh flex-col bg-muted/50">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4 md:px-6">
          <SidebarTrigger className="-ml-1 md:hidden" />
          <span className="flex-1 text-sm font-semibold tracking-tight md:hidden">
            DSI Admin
          </span>
          <div className="ml-auto flex items-center justify-end md:flex-1">
            {user ? (
              <AdminTopBar
                firstName={user.firstName}
                lastName={user.lastName}
              />
            ) : null}
          </div>
        </header>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
