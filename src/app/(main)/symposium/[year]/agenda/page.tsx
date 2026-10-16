import { formatDay, symposia, symposiumHref, venueAddress } from "@/lib/symposia";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isBreak, loadSymposium } from "../data";
import PrintButton from "./PrintButton";

export const revalidate = 300;

export function generateStaticParams() {
  return Object.keys(symposia).map((year) => ({ year }));
}

type Params = { params: Promise<{ year: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { year } = await params;
  return {
    title: `Symposium ${year} agenda | UF DSI`,
    description: `The full schedule for the DSI Symposium ${year}.`,
  };
}

// "9:00am - 9:30am" → ["9:00am", "9:30am"]
function splitRange(range: string): [string, string | null] {
  const [start, end] = range.split(/\s*[-–]\s*/);
  return [start?.trim() ?? range, end?.trim() || null];
}

export default async function AgendaPage({ params }: Params) {
  const data = await loadSymposium((await params).year);
  if (!data) notFound();
  const { year, date, config, agenda } = data;

  return (
    <main>
      <section className="site-intro" aria-labelledby="agenda-title">
        <div className="site-wrap">
          <Link href={symposiumHref(year)} className="site-crumb site-noprint">
            <span aria-hidden="true">←</span> Symposium {year}
          </Link>
          <p className="site-label">Schedule</p>
          <h1 id="agenda-title" className="site-h1">
            {year} agenda.
          </h1>
          <p className="site-lede">
            {date ? formatDay(date) : `Spring ${year}`}
            {config.venue ? ` · ${config.venue.name}, ${venueAddress(config.venue)}` : ""}
          </p>
          {agenda.length > 0 && (
            <div className="site-hero__actions site-noprint">
              <PrintButton />
            </div>
          )}
        </div>
      </section>

      <section className="site-section" style={{ paddingTop: 0 }} aria-label="Sessions">
        <div className="site-wrap" style={{ maxWidth: "calc(960px + var(--pad) * 2)" }}>
          {agenda.length === 0 ? (
            <p className="site-empty">
              The {year} schedule has not been posted yet. It will appear here once the lineup is set.
            </p>
          ) : (
            <ol className="site-agenda">
              {agenda.map((item) => {
                const [start, end] = splitRange(item.time_range);
                return (
                  <li key={item.id} className={isBreak(item) ? "is-break" : undefined}>
                    <p className="site-agenda__time">
                      {start}
                      {end && <span>to {end}</span>}
                    </p>
                    <div>
                      <h2 className="site-agenda__session">{item.session}</h2>
                      {item.description && <p className="site-agenda__desc">{item.description}</p>}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </section>
    </main>
  );
}
