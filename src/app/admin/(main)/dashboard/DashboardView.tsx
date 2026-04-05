"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Filter,
  LayoutGrid,
  MoreVertical,
  Search,
  UserPlus,
} from "lucide-react";

const DSI_BLUE = "#0021A5";

export type ActivityRow = {
  id: string;
  description: string;
  created_at: string;
  table_name: string;
};

export type WorkshopCard = {
  id: string;
  title: string;
  speaker: string;
  datetime: string;
  location: string;
  cover: string;
  link: string | null;
};

function badgeVariantForTable(table: string) {
  switch (table) {
    case "people":
      return "default";
    case "speakers":
      return "secondary";
    case "symposium":
      return "outline";
    case "news":
      return "outline";
    default:
      return "secondary";
  }
}

function WorkshopCardItem({ workshop }: { workshop: WorkshopCard }) {
  const upcoming = new Date(workshop.datetime) > new Date();
  return (
    <div
      role={workshop.link ? "link" : undefined}
      tabIndex={workshop.link ? 0 : undefined}
      className={`group overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm transition hover:shadow-md ${
        workshop.link ? "cursor-pointer" : ""
      }`}
      onClick={
        workshop.link
          ? () =>
              window.open(
                workshop.link!,
                "_blank",
                "noopener,noreferrer",
              )
          : undefined
      }
      onKeyDown={
        workshop.link
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                window.open(
                  workshop.link!,
                  "_blank",
                  "noopener,noreferrer",
                );
              }
            }
          : undefined
      }
    >
      <div className="relative h-32 overflow-hidden">
        <Image
          src={workshop.cover}
          alt=""
          fill
          className="object-cover opacity-90 transition group-hover:opacity-100"
          sizes="(max-width: 768px) 100vw, 280px"
        />
        {!upcoming && (
          <span className="absolute right-2 top-2 rounded-md bg-background/90 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            Past
          </span>
        )}
      </div>
      <div className="space-y-1 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
          {workshop.title}
        </h3>
        <p className="text-xs text-muted-foreground">
          {workshop.speaker}
        </p>
        <p className="text-xs text-muted-foreground">
          {new Date(workshop.datetime).toLocaleDateString()} ·{" "}
          {new Date(workshop.datetime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <p className="text-xs text-muted-foreground">{workshop.location}</p>
      </div>
    </div>
  );
}

export function DashboardView({
  firstName,
  roleLabel,
  activities,
  workshops,
}: {
  firstName: string;
  roleLabel: string;
  activities: ActivityRow[];
  workshops: WorkshopCard[];
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return activities;
    return activities.filter((a) =>
      a.description.toLowerCase().includes(q),
    );
  }, [activities, query]);

  const upcoming = workshops.filter(
    (w) => new Date(w.datetime) > new Date(),
  );

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="overflow-hidden rounded-xl border border-border/80 bg-background shadow-sm">
        <div className="border-b border-border/80 px-6 py-6 sm:px-8">
          <Breadcrumb
            items={[
              { label: "Admin", href: "/admin/dashboard" },
              { label: "Dashboard" },
            ]}
          />
          <div className="mt-5 flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Hi, {firstName}
            </h1>
            <p className="text-sm text-muted-foreground">
              {roleLabel} · Monitor recent activity across DSI and stay on top
              of workshops.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-b border-border/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">All activity</span>{" "}
            <span className="tabular-nums text-muted-foreground">
              {filtered.length}
            </span>
          </p>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search activity…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-9 border-border/80 pl-9"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-1.5" type="button">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button
              size="sm"
              className="gap-1.5 font-medium text-white shadow-sm"
              style={{ backgroundColor: DSI_BLUE }}
              asChild
            >
              <Link href="/admin/users">
                <UserPlus className="h-4 w-4" />
                Add user
              </Link>
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="w-10 pl-6 sm:pl-8" />
                <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Activity
                </TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Source
                </TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Time
                </TableHead>
                <TableHead className="w-12 pr-6 text-right sm:pr-8" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-12 text-center text-sm text-muted-foreground"
                  >
                    No activity matches your search.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-border/50 hover:bg-muted/40"
                  >
                    <TableCell className="pl-6 sm:pl-8">
                      <Checkbox
                        checked={!!selected[row.id]}
                        onCheckedChange={(v) =>
                          setSelected((s) => ({
                            ...s,
                            [row.id]: v === true,
                          }))
                        }
                        aria-label={`Select ${row.id}`}
                      />
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="text-sm font-medium leading-snug text-foreground">
                        {row.description}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={badgeVariantForTable(row.table_name)}
                        className="font-normal capitalize"
                      >
                        {row.table_name.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(row.created_at).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </TableCell>
                    <TableCell className="pr-6 text-right sm:pr-8">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground"
                            aria-label="Row actions"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem disabled>
                            View details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between border-t border-border/60 px-6 py-3 sm:px-8">
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} of {activities.length} events
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-8 min-w-8 p-0" disabled>
              1
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/80 bg-background shadow-sm">
        <div className="flex flex-col gap-1 border-b border-border/60 px-6 py-5 sm:px-8">
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold tracking-tight">
              Upcoming workshops
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Next sessions on the calendar — click a card to open details.
          </p>
        </div>
        <div className="p-6 sm:p-8">
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No upcoming workshops scheduled.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((w) => (
                <WorkshopCardItem key={w.id} workshop={w} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
