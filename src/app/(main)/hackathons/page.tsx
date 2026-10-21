import ClosingCTA from "@/components/site/ClosingCTA";
import Reveal from "@/components/site/Reveal";
import { DISCORD_URL } from "@/components/site/links";
import {
  FormatFilter,
  Hackathon,
  TypeFilter,
  applicationLabel,
  attendanceLabel,
  currentSemester,
  dateRange,
  dayBadge,
  feedUrls,
  googleCalendarUrl,
  hackathons,
  hasEnded,
  matches,
  monthOf,
  place,
  semesters,
  sortByDate,
} from "@/lib/hackathons";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hackathons | UF DSI",
  description:
    "A calendar of college and industry hackathons open to UF students, with dates, application status and the ones DSI goes to.",
};

type Params = { semester?: string; type?: string; format?: string; open?: string; q?: string };

const TYPES: { id: TypeFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "uf", label: "At UF" },
  { id: "collegiate", label: "College" },
  { id: "industry", label: "Industry" },
];

const FORMATS: { id: FormatFilter; label: string }[] = [
  { id: "any", label: "Any format" },
  { id: "in-person", label: "In person" },
  { id: "online", label: "Online" },
];

export default async function HackathonsPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const now = new Date();
  const terms = semesters(now);
  const semester = terms.find((t) => t.id === params.semester)?.id ?? terms.find((t) => t.id === currentSemester(now))?.id ?? terms[0]?.id;
  const filters = {
    semester,
    type: (TYPES.some((t) => t.id === params.type) ? params.type : "all") as TypeFilter,
    format: (FORMATS.some((f) => f.id === params.format) ? params.format : "any") as FormatFilter,
    open: params.open === "1",
    q: (params.q ?? "").trim().slice(0, 80),
  };

  const href = (change: Partial<Record<keyof Params, string | undefined>>) => {
    const next = new URLSearchParams();
    const merged = {
      semester: semester === terms[0]?.id ? undefined : semester,
      type: filters.type === "all" ? undefined : filters.type,
      format: filters.format === "any" ? undefined : filters.format,
      open: filters.open ? "1" : undefined,
      q: filters.q || undefined,
      ...change,
    };
    for (const [key, value] of Object.entries(merged)) if (value) next.set(key, value);
    const qs = next.toString();
    return qs ? `/hackathons?${qs}#calendar` : "/hackathons#calendar";
  };

  const shown = hackathons.filter((h) => matches(h, filters)).sort(sortByDate);
  const upcoming = shown.filter((h) => !hasEnded(h, now));
  const past = shown.filter((h) => hasEnded(h, now)).reverse();

  const groups = new Map<string, Hackathon[]>();
  for (const h of upcoming) {
    const key = monthOf(h);
    groups.set(key, [...(groups.get(key) ?? []), h]);
  }

  const feed = feedUrls();
  const filtered = filters.type !== "all" || filters.format !== "any" || filters.open || filters.q;

  return (
    <main>
      <section className="site-intro" aria-labelledby="hackathons-title">
        <div className="site-wrap">
          <p className="site-label">Hackathons</p>
          <h1 id="hackathons-title" className="site-h1" style={{ maxWidth: "15ch" }}>
            Find your next hackathon.
          </h1>
          <p className="site-lede">
            College and company hackathons open to UF students, with dates, where to apply and the ones DSI goes to
            together. Dates nobody has announced yet stay TBA.
          </p>
          <div className="site-hero__actions">
            <a href={feed.google} target="_blank" rel="noopener noreferrer" className="site-btn site-btn--primary">
              Follow in Google Calendar{" "}
              <span className="site-arrow" aria-hidden="true">
                →
              </span>
            </a>
            <a href={feed.webcal} className="site-btn site-btn--ghost">
              Apple or Outlook
            </a>
          </div>
        </div>
      </section>

      <section
        className="site-section site-section--tight"
        id="calendar"
        aria-labelledby="calendar-title"
        style={{ borderTop: "1px solid var(--line)" }}
      >
        <div className="site-wrap">
          <div className="site-hack-bar">
            <h2 id="calendar-title" className="site-h2 site-h2--small">
              {terms.find((t) => t.id === semester)?.label}.
            </h2>
            <form action="/hackathons#calendar" method="get" className="site-hack-search" role="search">
              {semester !== terms[0]?.id && <input type="hidden" name="semester" value={semester} />}
              {filters.type !== "all" && <input type="hidden" name="type" value={filters.type} />}
              {filters.format !== "any" && <input type="hidden" name="format" value={filters.format} />}
              {filters.open && <input type="hidden" name="open" value="1" />}
              <label htmlFor="hack-q" className="sr-only">
                Search hackathons
              </label>
              <input id="hack-q" type="search" name="q" defaultValue={filters.q} placeholder="Search by name, school or city" />
              <button type="submit" className="site-btn site-btn--ghost">
                Search
              </button>
            </form>
          </div>

          <nav aria-label="Semester">
            <ul className="site-filter site-hack-filter">
              {terms.map((t) => (
                <li key={t.id}>
                  <Link href={href({ semester: t.id === terms[0]?.id ? undefined : t.id })} aria-current={t.id === semester ? "page" : undefined} scroll={false}>
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Filters">
            <ul className="site-filter site-hack-filter">
              {TYPES.map((t) => (
                <li key={t.id}>
                  <Link href={href({ type: t.id === "all" ? undefined : t.id })} aria-current={t.id === filters.type ? "page" : undefined} scroll={false}>
                    {t.label}
                  </Link>
                </li>
              ))}
              <li className="site-hack-filter__gap" aria-hidden="true" />
              {FORMATS.map((f) => (
                <li key={f.id}>
                  <Link href={href({ format: f.id === "any" ? undefined : f.id })} aria-current={f.id === filters.format ? "page" : undefined} scroll={false}>
                    {f.label}
                  </Link>
                </li>
              ))}
              <li className="site-hack-filter__gap" aria-hidden="true" />
              <li>
                <Link href={href({ open: filters.open ? undefined : "1" })} aria-current={filters.open ? "page" : undefined} scroll={false}>
                  Open to apply
                </Link>
              </li>
            </ul>
          </nav>

          <p className="site-hack-count">
            <span>
              {upcoming.length} coming up
              {past.length > 0 && `, ${past.length} already happened`}
              {filtered && (
                <>
                  {" · "}
                  <Link href={href({ type: undefined, format: undefined, open: undefined, q: undefined })} scroll={false} className="site-link">
                    Clear filters
                  </Link>
                </>
              )}
            </span>
            <span className="site-hack-legend">
              <span aria-hidden="true">★</span> DSI goes as a group
            </span>
          </p>

          {upcoming.length === 0 && (
            <p className="site-lede site-hack-empty">
              Nothing matches. Try another semester or clear the filters.
            </p>
          )}

          {[...groups].map(([month, events]) => (
            <Reveal key={month} className="site-hack-month">
              <h3 className="site-hack-month__title">{month}</h3>
              <ul className="site-upcoming site-hack-list">
                {events.map((h) => (
                  <Event key={h.id} h={h} />
                ))}
              </ul>
            </Reveal>
          ))}

          {past.length > 0 && (
            <details className="site-hack-past">
              <summary>Already happened ({past.length})</summary>
              <ul className="site-upcoming site-hack-list">
                {past.map((h) => (
                  <Event key={h.id} h={h} ended />
                ))}
              </ul>
            </details>
          )}

          <p className="site-hack-note">
            Listings come from organizer sites and are checked by hand, so confirm dates and eligibility on the official
            page before you apply. Know one we&rsquo;re missing? Tell us in the{" "}
            <a className="site-link" href={DISCORD_URL} target="_blank" rel="noopener noreferrer">
              Discord
            </a>
            .
          </p>
        </div>
      </section>

      <ClosingCTA />
    </main>
  );
}

function Event({ h, ended = false }: { h: Hackathon; ended?: boolean }) {
  const badge = dayBadge(h);
  const gcal = googleCalendarUrl(h);
  const status = ended ? "Ended" : applicationLabel[h.application];
  const tone = ended ? "muted" : h.application === "open" || h.application === "link" ? "go" : h.application === "closed" ? "muted" : "info";

  return (
    <li className={`site-hack${ended ? " is-ended" : ""}`}>
      <time className="site-date" dateTime={h.dates.kind === "confirmed" ? h.dates.start : undefined}>
        <span>{badge.month}</span>
        <strong>{badge.day}</strong>
      </time>
      <div className="site-hack__body">
        <div className="site-hack__head">
          {h.host.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={h.host.logo} alt="" width={20} height={20} className="site-hack__logo" loading="lazy" />
          )}
          <span className="site-hack__host">{h.host.short ?? h.host.name}</span>
          {h.atUF && h.host.short !== "UF" && <span className="site-hack__tag">At UF</span>}
          {h.hostType === "industry" && <span className="site-hack__tag">Industry</span>}
        </div>
        <h4 className="site-h3">
          {h.dsi && (
            <span className="site-hack__star" title="DSI goes as a group">
              ★<span className="sr-only">DSI involvement: </span>
            </span>
          )}
          {h.name}
        </h4>
        <p>
          {dateRange(h)} · {place(h)}
          {h.attendance !== "in-person" && h.attendance !== "online" && ` · ${attendanceLabel[h.attendance]}`}
        </p>
        <p className="site-hack__status">
          <span className={`site-hack__pill site-hack__pill--${tone}`}>{status}</span>
          {!ended && h.applicationNote && h.application !== "unknown" && <span>{h.applicationNote}</span>}
        </p>
        <details className="site-hack__more">
          <summary>Details</summary>
          <div>
            <p>{h.description}</p>
            {h.dsi && <p className="site-hack__dsi">★ {h.dsi}</p>}
            <dl>
              {h.venue && (
                <>
                  <dt>Venue</dt>
                  <dd>{h.venue}</dd>
                </>
              )}
              {h.club && (
                <>
                  <dt>Run by</dt>
                  <dd>{h.club.name}</dd>
                </>
              )}
              <dt>Who can go</dt>
              <dd>{h.eligibility || "See organizer"}</dd>
              <dt>Cost</dt>
              <dd>{h.cost || "See organizer"}</dd>
              <dt>Last checked</dt>
              <dd>{new Date(`${h.checked}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}</dd>
            </dl>
            <p className="site-hack__links">
              <a href={h.url} target="_blank" rel="noopener noreferrer" className="site-link">
                Official site <span aria-hidden="true">→</span>
              </a>
              {gcal && !ended && (
                <a href={gcal} target="_blank" rel="noopener noreferrer" className="site-link">
                  Add to Google Calendar
                </a>
              )}
            </p>
          </div>
        </details>
      </div>
    </li>
  );
}
