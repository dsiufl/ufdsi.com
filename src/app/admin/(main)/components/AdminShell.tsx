"use client";

import "@/styles/admin.css";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  Calendar,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Layers,
  Newspaper,
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
import { CommandMenu, useCommands } from "./CommandMenu";
import { AdminPagesContext } from "./CreateButton";
import { ChevronRight } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import { IBM_Plex_Mono } from "next/font/google";

const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });
import SidebarLogo from "./SidebarLogo";

export type AdminNavItem = {
  title: string;
  href: string;
};

const GROUPS: { label: string; match: string[] }[] = [
  { label: "Overview", match: ["dashboard"] },
  { label: "Content", match: ["workshop", "news", "projects", "symposium"] },
  { label: "Events", match: ["forms", "templates"] },
  { label: "Team", match: ["users"] },
];

function navItemIsActive(pathname: string, href: string) {
  if (href === "/admin/dashboard") return pathname === href;
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

const CHILD: Record<string, string> = {
  "news/article/new": "New article",
  "news/article": "Edit article",
  "forms/new": "New form",
  forms: "Form",
  "templates/new": "New template",
  templates: "Edit template",
  symposium: "Edit year",
};

function crumbs(pathname: string, items: AdminNavItem[]) {
  const rest = pathname.replace(/^\/admin\/?/, "");
  if (rest.startsWith("settings")) return [{ title: "Settings" }];
  const section = items.find((i) => navItemIsActive(pathname, i.href));
  if (!section) return [{ title: "Admin" }];
  const parts = rest.split("/");
  const out: { title: string; href?: string }[] = [{ title: section.title, href: section.href }];
  if (parts.length > 1) {
    const key = parts.join("/");
    const label =
      CHILD[key] ?? CHILD[parts.slice(0, -1).join("/")] ?? CHILD[parts[0]] ?? "Details";
    out.push({ title: label });
  }
  return out;
}

function groupItems(items: AdminNavItem[]) {
  const used = new Set<string>();
  const groups = GROUPS.map((g) => {
    const list = items.filter((i) => !used.has(i.href) && g.match.some((m) => i.href.includes(m)));
    list.forEach((i) => used.add(i.href));
    return { label: g.label, items: list };
  });
  const rest = items.filter((i) => !used.has(i.href));
  if (rest.length) groups.push({ label: "More", items: rest });
  return groups.filter((g) => g.items.length);
}

export function AdminShell({
  navItems,
  children,
  user,
}: {
  navItems: AdminNavItem[];
  children: ReactNode;
  user?: { firstName: string; lastName: string; role?: string };
}) {
  const pathname = usePathname();
  const pages = useMemo(() => navItems.map((i) => ({ ...i, icon: iconForHref(i.href) })), [navItems]);
  const commands = useCommands(pages);
  const trail = crumbs(pathname, navItems);
  const hrefs = useMemo(() => navItems.map((i) => i.href), [navItems]);
  const { setTheme } = useTheme();
  // The admin is light only.
  useEffect(() => setTheme("light"), [setTheme]);

  return (
    <AdminPagesContext.Provider value={hrefs}>
    <SidebarProvider defaultOpen className={`admin-root ${mono.variable}`}>
      <Sidebar collapsible="offcanvas" className="fixed border-r border-sidebar-border">
        <SidebarHeader className="px-4 pb-2 pt-5">
          <div className="flex items-center justify-between px-1">
            <SidebarLogo />
            <span className="text-xs font-medium text-muted-foreground">Admin</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="gap-1 px-2 py-2">
          {groupItems(navItems).map((group) => (
            <SidebarGroup key={group.label} className="py-1.5">
              <SidebarGroupLabel className="h-7 px-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {group.items.map((item) => {
                    const Icon = iconForHref(item.href);
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={navItemIsActive(pathname, item.href)}
                          className="group/nav relative h-9 rounded-none px-3 focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring/40 text-[14px] hover:bg-transparent hover:text-foreground data-[active=true]:bg-transparent data-[active=true]:font-medium data-[active=true]:text-foreground data-[active=true]:before:absolute data-[active=true]:before:inset-y-1.5 data-[active=true]:before:left-0 data-[active=true]:before:w-[2px] data-[active=true]:before:bg-[var(--a-signal)]"
                        >
                          <Link href={item.href}>
                            <Icon className="size-4 shrink-0 opacity-70 group-data-[active=true]/nav:opacity-100" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter className="gap-1 p-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-2.5 py-2 text-[13px] text-sidebar-foreground transition-colors hover:text-foreground"
          >
            View ufdsi.com
            <ArrowUpRight className="size-4 opacity-60" />
          </a>
          {user && <AdminTopBar firstName={user.firstName} lastName={user.lastName} role={user.role} />}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex min-h-svh flex-col bg-background">
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 bg-background/85 px-4 backdrop-blur md:px-8">
          <SidebarTrigger className="-ml-1.5 text-muted-foreground" />
          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
            {trail.map((c, i) => (
              <span key={i} className="flex min-w-0 items-center gap-1.5">
                {i > 0 && <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/60" />}
                {c.href && i < trail.length - 1 ? (
                  <Link href={c.href} className="truncate text-muted-foreground hover:text-foreground">
                    {c.title}
                  </Link>
                ) : (
                  <span className="truncate font-medium text-foreground" aria-current="page">{c.title}</span>
                )}
              </span>
            ))}
          </nav>
          <div className="ml-auto flex flex-1 items-center justify-end gap-2">
            <div className="hidden w-full max-w-xs sm:block">
              <CommandMenu commands={commands} />
            </div>
          </div>
        </header>
        <div className="flex min-h-0 flex-1 flex-col px-4 pb-16 pt-4 sm:px-6 md:px-8 lg:pt-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
    </AdminPagesContext.Provider>
  );
}
