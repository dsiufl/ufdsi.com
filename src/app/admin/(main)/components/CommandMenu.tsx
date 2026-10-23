"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, CornerDownLeft, Plus, Search, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export type Command = {
  id: string;
  label: string;
  group: "Go to" | "Create" | "Other";
  icon: LucideIcon;
  hint?: string;
  run: () => void;
};

const isTyping = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));

export function useCommands(pages: { title: string; href: string; icon: LucideIcon }[]) {
  const router = useRouter();
  const has = (href: string) => pages.some((p) => p.href === href);

  return useMemo<Command[]>(() => {
    const create: [string, string, string][] = [
      ["/admin/workshops", "New workshop", "/admin/workshops?new=1"],
      ["/admin/news", "New article", "/admin/news/article/new"],
      ["/admin/projects", "New project", "/admin/projects?new=1"],
      ["/admin/forms", "New form", "/admin/forms/new"],
      ["/admin/users", "New user", "/admin/users?new=1"],
    ];
    return [
      ...pages.map((p) => ({ id: p.href, label: p.title, group: "Go to" as const, icon: p.icon, run: () => router.push(p.href) })),
      { id: "settings", label: "Settings", group: "Go to" as const, icon: Settings, run: () => router.push("/admin/settings") },
      ...create
        .filter(([section]) => has(section))
        .map(([, label, href]) => ({ id: href, label, group: "Create" as const, icon: Plus, run: () => router.push(href) })),
      { id: "site", label: "Open ufdsi.com", group: "Other" as const, icon: ArrowUpRight, run: () => window.open("/", "_blank", "noopener") },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages]);
}

export function CommandMenu({ commands }: { commands: Command[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "/" && !isTyping(e.target)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? commands.filter((c) => c.label.toLowerCase().includes(q)) : commands;
  }, [commands, query]);

  useEffect(() => setActive(0), [query, open]);
  useEffect(() => {
    list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const run = (c?: Command) => {
    if (!c) return;
    setOpen(false);
    setQuery("");
    c.run();
  };

  let i = -1;
  const groups = (["Go to", "Create", "Other"] as const).map((g) => ({ g, items: shown.filter((c) => c.group === g) }));

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-8 w-full max-w-xs items-center gap-2 rounded-md border bg-muted/40 px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">Search or jump to…</span>
        <kbd className="admin-kbd">⌘K</kbd>
      </button>
      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setQuery(""); }}>
        <DialogContent className="top-[20%] max-w-lg translate-y-0 gap-0 overflow-hidden rounded-xl p-0 [&>button]:hidden">
          <DialogTitle className="sr-only">Command menu</DialogTitle>
          <div className="flex items-center gap-2 border-b px-3">
            <Search className="size-4 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, shown.length - 1)); }
                if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
                if (e.key === "Enter") { e.preventDefault(); run(groups.flatMap((g) => g.items)[active]); }
              }}
              placeholder="Type a page or action"
              className="h-11 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="admin-kbd">esc</kbd>
          </div>
          <div ref={list} className="max-h-80 overflow-y-auto p-1">
            {shown.length === 0 && <p className="px-3 py-8 text-center text-sm text-muted-foreground">Nothing matches &ldquo;{query}&rdquo;.</p>}
            {groups.map(({ g, items }) =>
              items.length ? (
                <div key={g} className="pb-1">
                  <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{g}</p>
                  {items.map((c) => {
                    i += 1;
                    const idx = i;
                    const Icon = c.icon;
                    return (
                      <button
                        key={c.id}
                        data-index={idx}
                        onMouseMove={() => setActive(idx)}
                        onClick={() => run(c)}
                        className={`flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-none ${idx === active ? "bg-accent text-accent-foreground" : ""}`}
                      >
                        <Icon className="size-4 text-muted-foreground" />
                        <span className="flex-1">{c.label}</span>
                        {idx === active && <CornerDownLeft className="size-3.5 text-muted-foreground" />}
                      </button>
                    );
                  })}
                </div>
              ) : null,
            )}
          </div>
          <div className="flex items-center gap-4 border-t px-4 py-2 text-xs text-muted-foreground">
            <span><kbd className="admin-kbd">↑↓</kbd> move</span>
            <span><kbd className="admin-kbd">↵</kbd> open</span>
            <span className="ml-auto"><kbd className="admin-kbd">C</kbd> creates on list pages</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/** Press C (outside a text field) to run a page's create action. */
export function useCreateShortcut(create: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "c" || e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      if (document.querySelector('[role="dialog"]')) return;
      e.preventDefault();
      create();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [create]);
}
