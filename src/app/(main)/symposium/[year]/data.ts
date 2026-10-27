import { createPublicClient } from "@/lib/supabase/public";
import { stageOf, symposia, TRACK_ORDER } from "@/lib/symposia";
import type { AgendaItem, Speaker, Symposium } from "@/types/db";
import { cache } from "react";

const BREAK_WORDS = ["break", "lunch", "coffee", "breakfast", "check in", "check-in"];

export const isBreak = (item: AgendaItem) => BREAK_WORDS.some((word) => item.session.toLowerCase().includes(word));

// "10:30AM - 11:30AM" → minutes after midnight of the start, for sorting.
function startMinutes(time: string | null): number {
  const match = time?.match(/(\d{1,2}):(\d{2})\s*([AP]M)/i);
  if (!match) return Infinity;
  const hour = (Number(match[1]) % 12) + (match[3].toUpperCase() === "PM" ? 12 : 0);
  return hour * 60 + Number(match[2]);
}

const trackRank = (track: string | null) => {
  const index = TRACK_ORDER.indexOf(track ?? "");
  return index === -1 ? TRACK_ORDER.length : index;
};

// Everything the symposium pages need for one year, fetched once per render.
// Throws on a query error so a cached good page is kept rather than replaced
// with an empty one.
export const loadSymposium = cache(async (param: string) => {
  const year = Number(param);
  if (!Number.isInteger(year)) return null;
  const config = symposia[year];

  const supabase = createPublicClient();
  const slugs = [config?.speakerFormSlug, config?.sponsorFormSlug].filter(Boolean) as string[];
  const [rowRes, speakerRes, yearsRes, countsRes, formsRes] = await Promise.all([
    supabase.from("symposiums").select("*").eq("year", year).maybeSingle(),
    supabase.from("speakers").select("*").eq("symposium", year),
    supabase.from("symposiums").select("year, date, agenda").order("year", { ascending: false }),
    supabase.from("speakers").select("symposium"),
    slugs.length ? supabase.from("forms").select("slug, status, deadline").in("slug", slugs) : Promise.resolve({ data: [], error: null }),
  ]);
  for (const res of [rowRes, speakerRes, yearsRes, countsRes, formsRes]) {
    if (res.error) throw new Error(`Symposium ${year}: ${res.error.message}`);
  }

  const row = rowRes.data as Symposium | null;
  if (!row && !config) return null;

  const speakers = ((speakerRes.data ?? []) as Speaker[])
    .filter((speaker) => !speaker.deleted)
    .sort((a, b) => trackRank(a.track) - trackRank(b.track) || startMinutes(a.time) - startMinutes(b.time));
  const keynote =
    speakers.find((speaker) => speaker.id === row?.keynote) ??
    speakers.find((speaker) => speaker.track === "Keynote") ??
    null;
  const date = row?.date ? new Date(row.date) : null;
  const agenda = (row?.agenda ?? []).filter((item) => !item.deleted);

  const speakerCounts = new Map<number, number>();
  for (const { symposium } of countsRes.data ?? []) {
    if (symposium) speakerCounts.set(symposium, (speakerCounts.get(symposium) ?? 0) + 1);
  }
  const otherYears = (yearsRes.data ?? [])
    .filter((other) => other.year !== year && other.date && new Date(other.date) < new Date())
    .map((other) => ({
      year: other.year as number,
      date: new Date(other.date),
      speakers: speakerCounts.get(other.year) ?? 0,
      sessions: ((other.agenda ?? []) as AgendaItem[]).filter((item) => !item.deleted && !isBreak(item)).length,
    }));

  const now = new Date();
  const openForm = (slug?: string) => {
    const form = (formsRes.data ?? []).find((f) => f.slug === slug);
    const open = form?.status === "open" && (!form.deadline || new Date(form.deadline) > now);
    return open ? `/forms/${slug}` : null;
  };

  return {
    year,
    config: config ?? { year, venue: null, sponsors: [], collaborators: [], photos: [] },
    date,
    stage: stageOf(date, speakers.length, now),
    speakers,
    keynote,
    agenda,
    otherYears,
    speakerFormUrl: openForm(config?.speakerFormSlug),
    sponsorFormUrl: openForm(config?.sponsorFormSlug),
    renderedAt: now.getTime(),
  };
});

export type SymposiumData = NonNullable<Awaited<ReturnType<typeof loadSymposium>>>;
