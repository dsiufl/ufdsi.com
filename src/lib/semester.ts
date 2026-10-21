import { Workshop } from "@/types/db";

const TZ = "America/New_York";
const WEEKS = 16;
const DAY = 24 * 60 * 60 * 1000;

export interface SemesterWorkshop {
  id: string;
  title: string;
  speaker: string;
  when: string;
  location: string;
}

export interface SemesterWeek {
  number: number;
  range: string;
  status: "past" | "now" | "upcoming";
  workshops: SemesterWorkshop[];
}

export interface Semester {
  name: string;
  weeks: SemesterWeek[];
  total: number;
  currentWeek: number | null;
  // False when the current term has no workshops yet and an earlier one is shown.
  isCurrent: boolean;
}

// Calendar date in Gainesville, as a UTC-midnight timestamp so week math
// never depends on the server's timezone.
function localDay(date: Date): number {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(date);
  return Date.parse(`${parts}T00:00:00Z`);
}

function firstMondayOnOrAfter(year: number, month: number, day: number): number {
  const start = Date.UTC(year, month, day);
  const offset = (8 - new Date(start).getUTCDay()) % 7;
  return start + offset * DAY;
}

// UF terms start around the first full week of January and the third week of August.
function semesterStarts(year: number) {
  return [
    { name: `Spring ${year}`, start: firstMondayOnOrAfter(year, 0, 5) },
    { name: `Fall ${year}`, start: firstMondayOnOrAfter(year, 7, 18) },
  ];
}

const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const fullDate = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: TZ,
});

function buildTerm(
  term: { name: string; start: number },
  workshops: Workshop[],
  today: number,
): Omit<Semester, "isCurrent"> {
  const weeks: SemesterWeek[] = Array.from({ length: WEEKS }, (_, i) => {
    const start = term.start + i * 7 * DAY;
    const end = start + 6 * DAY;
    return {
      number: i + 1,
      range: shortDate.format(start),
      status: today > end ? "past" : today < start ? "upcoming" : "now",
      workshops: [],
    };
  });

  let total = 0;
  for (const workshop of workshops) {
    const date = new Date(workshop.datetime);
    const index = Math.floor((localDay(date) - term.start) / (7 * DAY));
    if (index < 0 || index >= WEEKS) continue;
    total += 1;
    weeks[index].workshops.push({
      id: String(workshop.id),
      title: workshop.title,
      speaker: workshop.speaker,
      when: formatWhen(date),
      location: workshop.location,
    });
  }

  return {
    name: term.name,
    weeks,
    total,
    currentWeek: weeks.find((week) => week.status === "now")?.number ?? null,
  };
}

// The current term, or the most recent earlier term with workshops when the
// current one has none posted yet.
// Workshops saved with a date but no time come back as midnight; show the date alone.
function formatWhen(date: Date): string {
  const parts = fullDate.formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value;
  const isMidnight = get("hour") === "12" && get("minute") === "00" && get("dayPeriod") === "AM";
  return isMidnight ? `${get("weekday")}, ${get("month")} ${get("day")}` : fullDate.format(date);
}

export function buildSemester(workshops: Workshop[], now = new Date()): Semester {
  const today = localDay(now);
  const year = new Date(today).getUTCFullYear();
  const sorted = [...workshops].sort((a, b) => +new Date(a.datetime) - +new Date(b.datetime));
  const terms = [year - 2, year - 1, year]
    .flatMap(semesterStarts)
    .filter((term) => term.start <= today)
    .reverse();

  const current = buildTerm(terms[0], sorted, today);
  if (current.total > 0) return { ...current, isCurrent: true };

  for (const term of terms.slice(1)) {
    const earlier = buildTerm(term, sorted, today);
    if (earlier.total > 0) return { ...earlier, isCurrent: false };
  }
  return { ...current, isCurrent: true };
}
