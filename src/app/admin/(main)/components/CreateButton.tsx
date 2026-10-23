"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar, ChevronDown, Newspaper, Plus, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useState } from "react";
import { useCreateShortcut } from "./CommandMenu";

/** The page's main "new" button. Also bound to the C key. */
export function CreateButton({ label, href, onClick }: { label: string; href?: string; onClick?: () => void }) {
  const router = useRouter();
  const go = useCallback(() => (onClick ? onClick() : href && router.push(href)), [onClick, href, router]);
  useCreateShortcut(go);
  return (
    <Button onClick={go} title={`${label} (C)`}>
      <Plus /> {label}
      <kbd className="admin-kbd admin-kbd--on-primary ml-0.5 hidden !h-5 sm:inline-flex">C</kbd>
    </Button>
  );
}

const NEW_ITEMS = [
  { section: "/admin/news", label: "Article", href: "/admin/news/article/new", icon: Newspaper },
  { section: "/admin/workshops", label: "Workshop", href: "/admin/workshops?new=1", icon: Calendar },
  { section: "/admin/projects", label: "Project", href: "/admin/projects?new=1", icon: Wrench },
];

/** Sections the signed-in person can open, from the sidebar. */
export const AdminPagesContext = createContext<string[]>([]);

/** One "New" button with a menu of what you can create. C opens it. */
export function NewMenu() {
  const pages = useContext(AdminPagesContext);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const items = NEW_ITEMS.filter((i) => pages.includes(i.section));
  useCreateShortcut(useCallback(() => setOpen(true), []));
  if (!items.length) return null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button title="New (C)">
          <Plus /> New
          <ChevronDown className="-mr-1 opacity-80" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {items.map((i) => (
          <DropdownMenuItem key={i.href} onSelect={() => router.push(i.href)}>
            <i.icon className="text-muted-foreground" /> {i.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
