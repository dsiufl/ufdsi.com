"use client";

import { Spinner } from "@/components/ui/spinner";
import { Symposium } from "@/types/db";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Empty, PageHeader } from "../../components/PageHeader";
import { CreateButton } from "../../components/CreateButton";

const fmt = (d: Date | string | null) =>
  d ? new Date(`${String(d).slice(0, 10)}T12:00:00Z`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" }) : "Date not set";

export default function Main({ symposiums, token }: { symposiums: Symposium[]; token: string | null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const openNew = useCallback(() => setOpen(true), []);
  const [year, setYear] = useState(String(new Date().getFullYear() + 1));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const sorted = [...(symposiums ?? [])].sort((a, b) => b.year - a.year);
  const today = new Date().toISOString().slice(0, 10);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(undefined);
    const res = await fetch("/api/symposium/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, year: Number(year) }),
    });
    const body = await res.json().catch(() => ({}));
    if (res.ok) {
      router.push(`/admin/symposium/${body.symposium.id}`);
    } else {
      setError(body.error ?? "Couldn't create it.");
      setBusy(false);
    }
  };

  return (
    <div className="admin-page">
      <PageHeader
        label="Content"
        title="Symposium"
        description="Speakers, tracks and the agenda for each year's symposium. Pick a year to edit it."
        actions={
          <CreateButton label="New year" onClick={openNew} />
        }
      />

      <Dialog open={open} onOpenChange={(o) => !busy && setOpen(o)}>
        <DialogContent className="max-w-sm">
          <form onSubmit={create} className="flex flex-col gap-5">
            <DialogHeader>
              <DialogTitle>New symposium</DialogTitle>
              <DialogDescription>Starts empty. You can add the date, speakers and agenda next.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Label htmlFor="symposium-year">Year</Label>
              <Input id="symposium-year" type="number" min={2020} max={2100} value={year} onChange={(e) => setYear(e.target.value)} required />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={busy}>
                {busy ? <Spinner /> : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {sorted.length === 0 ? (
        <div className="admin-panel">
          <Empty title="No symposiums yet">Create the first year to start adding speakers.</Empty>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((s, i) => {
            const upcoming = s.date ? String(s.date).slice(0, 10) >= today : i === 0;
            return (
              <li key={s.id}>
                <Link
                  href={`/admin/symposium/${s.id}`}
                  className="admin-panel group flex h-full flex-col gap-6 p-6 transition-colors hover:border-foreground/30"
                >
                  <div className="flex items-center justify-between">
                    {upcoming ? (
                      <span className="admin-pill admin-pill--info">Upcoming</span>
                    ) : (
                      <span className="admin-pill admin-pill--plain">Past</span>
                    )}
                    <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <div>
                    <p className="text-[44px] font-semibold leading-none tracking-[-0.04em] tabular-nums">{s.year}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{fmt(s.date)}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
