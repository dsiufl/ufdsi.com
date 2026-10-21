import data from "./hackathons.json";

export type HostType = "collegiate" | "industry";
export type Attendance = "in-person" | "online" | "hybrid" | "unconfirmed";
export type Application = "open" | "not-open" | "interest" | "link" | "closed" | "unknown";

export interface Org {
  name: string;
  short?: string;
  logo?: string;
}

export interface Hackathon {
  id: string;
  series: string;
  semester: string;
  name: string;
  hostType: HostType;
  atUF: boolean;
  host: Org;
  club?: Org;
  city: string;
  state: string;
  country: string;
  venue?: string;
  attendance: Attendance;
  dates: { kind: "confirmed"; start: string; end: string } | { kind: "tba" };
  timeZone?: string;
  endsAt?: string;
  application: Application;
  applicationNote: string;
  category: string;
  description: string;
  eligibility: string;
  cost: string;
  url: string;
  checked: string;
  status: "announced" | "expected";
  dsi?: string;
  usually?: string;
}

export const hackathons = data as Hackathon[];

export const applicationLabel: Record<Application, string> = {
  open: "Applications open",
  "not-open": "Not open yet",
  interest: "Interest form",
  link: "Register",
  closed: "Applications closed",
  unknown: "Check organizer",
};

export const attendanceLabel: Record<Attendance, string> = {
  "in-person": "In person",
  online: "Online",
  hybrid: "Hybrid",
  unconfirmed: "Format TBA",
};

const SEASONS = ["spring", "summer", "fall"] as const;
type Season = (typeof SEASONS)[number];

export interface Semester {
  id: string;
  label: string;
}

const seasonOf = (month: number): Season => (month <= 4 ? "spring" : month <= 6 ? "summer" : "fall");

const semesterKey = (id: string) => {
  const [year, season] = id.split("-");
  return Number(year) * 10 + SEASONS.indexOf(season as Season);
};

export const semesterLabel = (id: string) => {
  const [year, season] = id.split("-");
  return `${season[0].toUpperCase()}${season.slice(1)} ${year}`;
};

export const currentSemester = (now: Date) => `${now.getFullYear()}-${seasonOf(now.getMonth())}`;

// Semesters that have events, from the current one on.
export const semesters = (now: Date): Semester[] => {
  const from = semesterKey(currentSemester(now));
  return Array.from(new Set(hackathons.map((h) => h.semester)))
    .filter((id) => semesterKey(id) >= from)
    .sort((a, b) => semesterKey(a) - semesterKey(b))
    .map((id) => ({ id, label: semesterLabel(id) }));
};

// End of the last day, or the organizer's exact end time when we have it.
export const endsAt = (h: Hackathon) => {
  if (h.dates.kind !== "confirmed") return null;
  if (h.endsAt) return new Date(h.endsAt);
  return new Date(`${h.dates.end}T23:59:59-12:00`);
};

export const hasEnded = (h: Hackathon, now: Date) => {
  const end = endsAt(h);
  return end !== null && end.getTime() < now.getTime();
};

const day = (iso: string) => new Date(`${iso}T12:00:00Z`);
const fmt = (iso: string, options: Intl.DateTimeFormatOptions) =>
  day(iso).toLocaleDateString("en-US", { timeZone: "UTC", ...options });

export const dateRange = (h: Hackathon) => {
  if (h.dates.kind !== "confirmed") return h.usually ? `Dates TBA · usually ${h.usually}` : "Dates TBA";
  const { start, end } = h.dates;
  if (start === end) return fmt(start, { month: "short", day: "numeric", year: "numeric" });
  const year = end.slice(0, 4);
  if (start.slice(0, 7) === end.slice(0, 7)) {
    return `${fmt(start, { month: "short" })} ${Number(start.slice(8))}–${Number(end.slice(8))}, ${year}`;
  }
  const sameYear = start.slice(0, 4) === year;
  const left = fmt(start, { month: "short", day: "numeric", ...(sameYear ? {} : { year: "numeric" }) });
  return `${left}–${fmt(end, { month: "short", day: "numeric" })}, ${year}`;
};

export const monthOf = (h: Hackathon) =>
  h.dates.kind === "confirmed" ? fmt(h.dates.start, { month: "long", year: "numeric" }) : "Dates TBA";

export const dayBadge = (h: Hackathon) =>
  h.dates.kind === "confirmed"
    ? { month: fmt(h.dates.start, { month: "short" }), day: fmt(h.dates.start, { day: "numeric" }) }
    : { month: "TBA", day: "–" };

export const place = (h: Hackathon) => {
  if (h.attendance === "online") return "Online";
  const where = [h.city, h.state || (h.country !== "United States" ? h.country : "")].filter(Boolean).join(", ");
  return h.attendance === "hybrid" && where ? `${where} + online` : where || "Location TBA";
};

export type TypeFilter = "all" | "uf" | "collegiate" | "industry";
export type FormatFilter = "any" | "in-person" | "online";

export interface Filters {
  semester: string;
  type: TypeFilter;
  format: FormatFilter;
  open: boolean;
  q: string;
}

export const matches = (h: Hackathon, f: Filters) => {
  if (h.semester !== f.semester) return false;
  if (f.type === "uf" && !h.atUF) return false;
  if ((f.type === "collegiate" || f.type === "industry") && h.hostType !== f.type) return false;
  if (f.format === "online" && h.attendance !== "online" && h.attendance !== "hybrid") return false;
  if (f.format === "in-person" && h.attendance !== "in-person" && h.attendance !== "hybrid") return false;
  if (f.open && h.application !== "open" && h.application !== "link") return false;
  if (f.q) {
    const text = [h.name, h.host.name, h.host.short, h.club?.name, h.city, h.state, h.category].join(" ").toLowerCase();
    if (!f.q.toLowerCase().split(/\s+/).every((word) => text.includes(word))) return false;
  }
  return true;
};

export const sortByDate = (a: Hackathon, b: Hackathon) => {
  const as = a.dates.kind === "confirmed" ? a.dates.start : "9999";
  const bs = b.dates.kind === "confirmed" ? b.dates.start : "9999";
  return as.localeCompare(bs) || a.name.localeCompare(b.name);
};
