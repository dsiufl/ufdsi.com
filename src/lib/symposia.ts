// Per-year symposium details that have no database column. The date, keynote,
// speakers and agenda come from Supabase and are edited in the admin; this file
// holds what is left. Starting a new year means adding one entry below and
// bumping the year in symposium-year.json (next.config.js reads it too, for
// the /symposium redirect).

import symposiumYear from "./symposium-year.json";

export const CURRENT_SYMPOSIUM_YEAR: number = symposiumYear.current;

export const symposiumHref = (year: number = CURRENT_SYMPOSIUM_YEAR) => `/symposium/${year}`;

const TZ = "America/New_York";

export interface Venue {
  name: string;
  street: string;
  postalCode: string;
  mapsUrl: string;
}

export const venueAddress = (venue: Venue) => `${venue.street}, Gainesville, FL ${venue.postalCode}`;

export interface Logo {
  name: string;
  logo: string;
  href?: string;
  // Tile color for logos drawn in white.
  bg?: string;
}

export interface SymposiumConfig {
  year: number;
  // null until the room is booked; the page shows "Venue to be announced".
  venue: Venue | null;
  registerUrl?: string;
  // Slugs of forms built in the admin form builder. The page links to them
  // once they are open, and falls back to email until then.
  speakerFormSlug?: string;
  sponsorFormSlug?: string;
  sponsors: Logo[];
  collaborators: Logo[];
  photos: { src: string; alt: string }[];
}

const REITZ: Venue = {
  name: "Reitz Union",
  street: "655 Reitz Union Drive",
  postalCode: "32603",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Reitz+Union,+655+Reitz+Union+Drive,+Gainesville,+FL",
};

const photos = [
  { src: "/images/symposium-26/filler/3.jpg", alt: "Four students at a University of Florida podium setting up a talk" },
  { src: "/images/symposium-26/filler/4.jpg", alt: "A student presenting a research poster to two attendees" },
  { src: "/images/symposium-26/filler/2.jpg", alt: "Attendees talking at round tables during a networking session" },
  { src: "/images/symposium-26/filler/1.jpg", alt: "Volunteers checking in attendees at a table of name badges" },
  { src: "/images/symposium-26/filler/5.jpg", alt: "A small group in armchairs listening to a speaker" },
  { src: "/images/symposium-26/filler/6.jpg", alt: "About twenty student organizers in white shirts and lanyards posing in a hallway" },
];

export const symposia: Record<number, SymposiumConfig> = {
  2025: {
    year: 2025,
    venue: REITZ,
    sponsors: [
      { name: "AIIRI", logo: "/images/symposium-25/sponsors/AIIRI.png", href: "https://ai.research.ufl.edu/" },
      { name: "CISE", logo: "/images/symposium-25/sponsors/CISE.png", href: "https://www.cise.ufl.edu/" },
      { name: "UF AI2 Center", logo: "/images/symposium-25/sponsors/AI2.png", href: "https://ai.ufl.edu/about/the-ai-center/" },
      { name: "Smathers Libraries", logo: "/images/symposium-25/sponsors/smathers.png", href: "https://uflib.ufl.edu/" },
    ],
    collaborators: [],
    photos: [],
  },
  2026: {
    year: 2026,
    venue: REITZ,
    registerUrl: "https://docs.google.com/forms/d/e/1FAIpQLSeeLjQPm-lw_HWNLitDZzMpdg96bh48pw6cmYsdWsz_a5TyTg/viewform",
    sponsors: [
      { name: "NVIDIA", logo: "/images/symposium-26/sponsors/nvidia.png", bg: "#ffffff" },
      { name: "Mark III", logo: "/images/symposium-26/sponsors/mark-iii.png", bg: "#ffffff" },
      { name: "NLP Logix", logo: "/images/symposium-26/sponsors/nlp-logix.png", bg: "#79bc46" },
      { name: "AIIRI", logo: "/images/symposium-26/sponsors/aiiri.png", bg: "#0b2d81" },
      { name: "Smathers Libraries", logo: "/images/symposium-26/sponsors/smathers.png", bg: "#ffffff" },
      { name: "Study Edge", logo: "/images/symposium-26/sponsors/study_edge.png", bg: "#2fb4e9" },
      { name: "Vyspar", logo: "/images/symposium-26/sponsors/vyspar.png", bg: "#1c1b2e" },
    ],
    collaborators: [
      { name: "UFIT", logo: "/images/symposium-26/sponsors/ufit.png", bg: "#ffffff" },
      { name: "UF Career Connections Center", logo: "/images/symposium-26/sponsors/ufccc.png", bg: "#ffffff" },
    ],
    photos,
  },
  2027: {
    year: 2027,
    venue: REITZ,
    registerUrl: "https://luma.com/8goy8nad",
    // Create these two forms in Admin → Forms with exactly these slugs and set
    // them to Open; the page picks them up within five minutes.
    speakerFormSlug: "symposium-2027-speakers",
    sponsorFormSlug: "symposium-2027-sponsors",
    sponsors: [],
    collaborators: [],
    photos,
  },
};

// Talk tracks, in the order the page lists them.
export const TRACK_ORDER = ["Keynote", "General Track", "Research Track", "Industry Track", "Workshop Track"];

export type Stage = "tba" | "announced" | "lineup" | "archive";

// The page's state comes from data, never from the year itself:
// no date → tba; date but no speakers → announced (calling for speakers and
// sponsors); speakers added → lineup (registration); day has passed → archive.
export function stageOf(date: Date | null, speakerCount: number, now = new Date()): Stage {
  if (!date) return "tba";
  if (localDay(date) < localDay(now)) return "archive";
  return speakerCount > 0 ? "lineup" : "announced";
}

function localDay(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(date);
}

// Dates saved without a time are stored as local midnight.
export function hasTime(date: Date): boolean {
  const time = new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "numeric", hour12: false }).format(date);
  return time !== "00:00" && time !== "24:00";
}

export function formatDay(date: Date): string {
  return date.toLocaleDateString("en-US", { timeZone: TZ, weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit" });
}

// Google Calendar "add event" link. An event with no time is added as all-day.
export function calendarUrl(year: number, date: Date, venue: Venue | null): string {
  const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  let dates: string;
  if (hasTime(date)) {
    dates = `${stamp(date)}/${stamp(new Date(date.getTime() + 8 * 60 * 60 * 1000))}`;
  } else {
    const day = localDay(date).replace(/-/g, "");
    const next = new Date(Date.parse(`${localDay(date)}T12:00:00Z`) + 24 * 60 * 60 * 1000);
    dates = `${day}/${next.toISOString().slice(0, 10).replace(/-/g, "")}`;
  }
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `DSI Symposium ${year}`,
    dates,
    details: `The UF DSI Research Symposium. https://ufdsi.com${symposiumHref(year)}`,
    location: venue ? `${venue.name}, ${venueAddress(venue)}` : "University of Florida, Gainesville, FL",
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

// Some older speaker rows store "images/..." without the leading slash.
export function imageSrc(src: string | null | undefined): string | null {
  if (!src) return null;
  return /^(https?:)?\//.test(src) ? src : `/${src}`;
}
