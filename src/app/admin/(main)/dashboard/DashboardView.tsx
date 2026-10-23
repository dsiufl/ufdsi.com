"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NewMenu } from "../components/CreateButton";
import { Empty, PageHeader, Panel } from "../components/PageHeader";

export type ActivityRow = {
  id: string;
  actor: string;
  description: string;
  created_at: string;
  table_name: string;
  action: string;
};

export type WorkshopCard = {
  id: string;
  title: string;
  speaker: string;
  datetime: string;
  location: string;
  link: string | null;
};

type Stats = { upcoming: number; drafts: number; openForms: number; thisWeek: number };
type Point = { at: string; table: string };

const TZ = "America/New_York";
const DAY = 86400000;
const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

function ago(iso: string) {
  const s = (new Date(iso).getTime() - Date.now()) / 1000;
  const steps: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.35, "week"],
    [12, "month"],
  ];
  let v = s;
  for (const [n, unit] of steps) {
    if (Math.abs(v) < n) return unit === "second" ? "just now" : rtf.format(Math.round(v), unit);
    v /= n;
  }
  return rtf.format(Math.round(v), "year");
}

const SECTIONS: { key: string; label: string; tables: string[] }[] = [
  { key: "workshops", label: "Workshops", tables: ["workshops"] },
  { key: "news", label: "News", tables: ["news"] },
  { key: "symposium", label: "Symposium", tables: ["symposium", "symposiums", "speakers"] },
  { key: "users", label: "Users", tables: ["people"] },
  { key: "projects", label: "Projects", tables: ["projects"] },
];
const sectionOf = (table: string) => SECTIONS.find((s) => s.tables.includes(table));

const VERB: Record<string, string> = { INSERT: "Created", UPDATE: "Updated", DELETE: "Deleted" };

function Stat({ value, label, href }: { value: number; label: string; href: string }) {
  return (
    <Link href={href} className="admin-stat">
      <span className="admin-stat__label">{label}</span>
      <span className="admin-stat__value">{value}</span>
    </Link>
  );
}

// Round the axis up so four even steps land on whole numbers.
function niceMax(n: number) {
  const raw = Math.max(n, 1) / 4;
  const p = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map((f) => f * p).find((v) => v >= raw)!;
  return Math.max(4, Math.ceil(step) * 4);
}

const short = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: TZ });

function useBuckets(history: Point[], mode: "week" | "day") {
  return useMemo(() => {
    const size = mode === "week" ? 7 * DAY : DAY;
    const count = mode === "week" ? 8 : 14;
    const end = Date.now();
    const buckets = Array.from({ length: count }, (_, i) => {
      const from = end - (count - i) * size;
      return { from: new Date(from), to: new Date(from + size - 1), value: 0 };
    });
    for (const h of history) {
      const i = Math.floor((new Date(h.at).getTime() - (end - count * size)) / size);
      if (i >= 0 && i < count) buckets[i].value++;
    }
    return buckets;
  }, [history, mode]);
}

function BarChart({ history }: { history: Point[] }) {
  const [mode, setMode] = useState<"week" | "day">("week");
  const [hover, setHover] = useState<number | null>(null);
  const buckets = useBuckets(history, mode);
  const max = niceMax(Math.max(...buckets.map((b) => b.value)));
  const ticks = [1, 0.75, 0.5, 0.25, 0].map((f) => Math.round(max * f));
  const total = buckets.reduce((n, b) => n + b.value, 0);
  const label = (b: (typeof buckets)[number]) => (mode === "week" ? `${short(b.from)} – ${short(b.to)}` : short(b.from));

  return (
    <Panel
      title="Site activity"
      meta={`${total} changes`}
      actions={
        <div className="admin-tabs" role="group" aria-label="Range">
          <button type="button" aria-pressed={mode === "week"} onClick={() => setMode("week")}>8 weeks</button>
          <button type="button" aria-pressed={mode === "day"} onClick={() => setMode("day")}>14 days</button>
        </div>
      }
    >
      <div className="px-5 pb-5">
        <div className="relative flex h-56 gap-3">
          <div className="admin-mono flex w-6 flex-col justify-between text-right text-[11px] text-muted-foreground" aria-hidden>
            {ticks.map((t) => (
              <span key={t} className="-translate-y-1/2 first:translate-y-0 last:translate-y-0">{t}</span>
            ))}
          </div>
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between" aria-hidden>
              {ticks.map((t) => (
                <span key={t} className="border-t" style={{ borderColor: t === 0 ? "var(--a-line-hi)" : "var(--a-line-soft)" }} />
              ))}
            </div>
            <div className="absolute inset-0 flex items-end gap-2" onMouseLeave={() => setHover(null)}>
              {buckets.map((b, i) => {
                const on = hover === i || (hover === null && i === buckets.length - 1);
                return (
                  <div
                    key={i}
                    className="relative flex h-full flex-1 items-end justify-center outline-none"
                    onMouseEnter={() => setHover(i)}
                    onFocus={() => setHover(i)}
                    onBlur={() => setHover(null)}
                    tabIndex={0}
                    aria-label={`${label(b)}: ${b.value} changes`}
                  >
                    <div
                      className="w-full max-w-8"
                      style={{
                        height: `${(b.value / max) * 100}%`,
                        minHeight: b.value ? 2 : 0,
                        background: on ? "var(--a-signal)" : "var(--a-ink)",
                        opacity: on ? 1 : 0.82,
                      }}
                    />
                    {hover === i && (
                      <div
                        className="pointer-events-none absolute z-10 -translate-y-2 whitespace-nowrap border bg-popover px-2.5 py-1.5 text-xs"
                        style={{ bottom: `${(b.value / max) * 100}%`, borderColor: "var(--a-line-hi)" }}
                      >
                        <p className="admin-mono text-muted-foreground">{label(b)}</p>
                        <p className="mt-0.5 text-sm font-semibold text-foreground">
                          <span className="admin-mono">{b.value}</span> {b.value === 1 ? "change" : "changes"}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="admin-mono ml-9 mt-2 flex gap-2 text-center text-[11px] text-muted-foreground" aria-hidden>
          {buckets.map((b, i) => (
            <span key={i} className={`flex-1 whitespace-nowrap ${i % 2 ? (mode === "day" ? "invisible" : "max-sm:invisible") : ""}`}>{short(b.from)}</span>
          ))}
        </div>
        <table className="sr-only">
          <caption>Site changes per {mode}</caption>
          <tbody>
            {buckets.map((b, i) => (
              <tr key={i}><th>{label(b)}</th><td>{b.value}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function Breakdown({ history }: { history: Point[] }) {
  const rows = useMemo(() => {
    const counts = new Map<string, number>();
    for (const h of history) {
      const key = sectionOf(h.table)?.key ?? "other";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    const list = SECTIONS.map((s) => ({ key: s.key, label: s.label, value: counts.get(s.key) ?? 0 }));
    if (counts.get("other")) list.push({ key: "other", label: "Other", value: counts.get("other")! });
    return list.sort((a, b) => b.value - a.value);
  }, [history]);
  const total = rows.reduce((n, r) => n + r.value, 0);
  const top = Math.max(...rows.map((r) => r.value), 1);

  return (
    <Panel title="Where edits went" meta="8 wk">
      {total === 0 ? (
        <Empty title="No edits yet" />
      ) : (
        <ul className="flex flex-col gap-3.5 px-5 pb-5 text-sm">
          {rows.map((r, i) => (
            <li key={r.key}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-foreground">{r.label}</span>
                <span className="admin-mono text-muted-foreground">
                  {r.value} <span className="inline-block w-9 text-right text-foreground">{total ? Math.round((r.value / total) * 100) : 0}%</span>
                </span>
              </div>
              <div className="mt-1.5 h-1.5" style={{ background: "var(--a-line-soft)" }}>
                <div className="h-full" style={{ width: `${(r.value / top) * 100}%`, background: i === 0 ? "var(--a-signal)" : "var(--a-ink)", opacity: i === 0 ? 1 : 0.75 }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

export function DashboardView({
  greeting,
  role,
  activities,
  history,
  workshops,
  stats,
}: {
  greeting: string;
  role: string;
  activities: ActivityRow[];
  history: Point[];
  workshops: WorkshopCard[];
  stats: Stats;
}) {
  const [query, setQuery] = useState("");
  const [all, setAll] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return activities;
    return activities.filter((a) => a.description.toLowerCase().includes(q));
  }, [activities, query]);
  const shown = all || query ? filtered : filtered.slice(0, 7);

  return (
    <div className="admin-page">
      <PageHeader
        label={role}
        title={greeting}
        description="What changed across the site lately, and what's coming up next."
        actions={
<NewMenu />
        }
      />

      <div className="admin-stats -mt-7">
        <Stat value={stats.upcoming} label="Upcoming workshops" href="/admin/workshops" />
        <Stat value={stats.drafts} label={stats.drafts === 1 ? "Draft to review" : "Drafts to review"} href="/admin/news?status=draft" />
        <Stat value={stats.openForms} label={stats.openForms === 1 ? "Open form" : "Open forms"} href="/admin/forms" />
        <Stat value={stats.thisWeek} label="Changes this week" href="#activity" />
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <BarChart history={history} />
        <Breakdown history={history} />
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Panel
          title="Recent activity"
          meta={filtered.length}
          actions={
            <>
              <div className="relative w-full sm:w-48">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Filter" value={query} onChange={(e) => setQuery(e.target.value)} className="h-8 pl-8" />
              </div>
              {!query && filtered.length > 7 && (
                <Button variant="ghost" size="sm" onClick={() => setAll((v) => !v)}>
                  {all ? "Show less" : "Show all"}
                </Button>
              )}
            </>
          }
        >
          <div id="activity" className="scroll-mt-20" />
          {shown.length === 0 ? (
            <Empty title={query ? "No matches" : "Nothing yet"}>
              {query ? "Try a different search." : "Edits to workshops, news, users and the symposium show up here."}
            </Empty>
          ) : (
            <ol className="admin-rows">
              {shown.map((row) => {
                const section = sectionOf(row.table_name);
                const rest = row.description.startsWith(row.actor) ? row.description.slice(row.actor.length) : ` ${row.description}`;
                return (
                  <li key={row.id} className="admin-item items-baseline">
                    <time
                      dateTime={row.created_at}
                      title={new Date(row.created_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: TZ })}
                      className="w-24 shrink-0 text-xs text-muted-foreground"
                      suppressHydrationWarning
                    >
                      {ago(row.created_at)}
                    </time>
                    <p className="min-w-0 flex-1 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{row.actor}</span>
                      {rest}
                    </p>
                    <span className="admin-tag hidden shrink-0 sm:inline">
                      {section?.label ?? row.table_name.replace(/_/g, " ")}
                      {VERB[row.action] ? ` · ${VERB[row.action]}` : ""}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
        </Panel>

        <Panel
          title="Coming up"
          actions={
            <Link href="/admin/workshops" className="text-[13px] font-medium text-[var(--a-blue)] underline-offset-4 hover:underline">
              All workshops
            </Link>
          }
        >
          {workshops.length === 0 ? (
            <Empty title="No workshops scheduled">Add one so it shows on the public calendar.</Empty>
          ) : (
            <ul className="admin-rows">
              {workshops.map((w, i) => {
                const d = new Date(w.datetime);
                const part = (o: Intl.DateTimeFormatOptions) => d.toLocaleString("en-US", { timeZone: TZ, ...o });
                const body = (
                  <>
                    <span className={`admin-date${i === 0 ? " is-next" : ""}`}>
                      <span>{part({ month: "short" })}</span>
                      <strong>{part({ day: "numeric" })}</strong>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 block text-sm font-medium leading-snug text-foreground">{w.title}</span>
                      <span className="admin-mono mt-1 block truncate text-xs text-muted-foreground">
                        {part({ weekday: "short", hour: "numeric", minute: "2-digit" })} · {w.location}
                      </span>
                    </span>
                    {w.link && <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />}
                  </>
                );
                return (
                  <li key={w.id}>
                    {w.link ? (
                      <a href={w.link} target="_blank" rel="noopener noreferrer" className="admin-item">
                        {body}
                      </a>
                    ) : (
                      <div className="admin-item">{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
