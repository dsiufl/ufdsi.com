import ClosingCTA from "@/components/site/ClosingCTA";
import Reveal from "@/components/site/Reveal";
import { DISCORD_URL } from "@/components/site/links";
import { createPublicClient } from "@/lib/supabase/public";
import { Workshop } from "@/types/db";
import { Metadata } from "next";
import Image from "next/image";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Workshops | UF DSI",
  description:
    "Hands-on data science and AI workshops at the University of Florida, open to every major and every year.",
};

const CALENDAR_URL =
  "https://calendar.google.com/calendar/u/0?cid=ZHNpdWZsQGdtYWlsLmNvbQ";
const ARCHIVE_URL = "https://github.com/dsiufl/WorkshopArchive";
const TZ = "America/New_York";

const fmt = (date: Date, options: Intl.DateTimeFormatOptions) =>
  date.toLocaleString("en-US", { timeZone: TZ, ...options });

// Rows saved without a time come back as midnight Eastern.
const hasTime = (date: Date) =>
  fmt(date, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }) !== "00:00";

const termOf = (date: Date) => {
  const month = Number(fmt(date, { month: "numeric" }));
  const season = month <= 4 ? "Spring" : month <= 7 ? "Summer" : "Fall";
  return `${season} ${fmt(date, { year: "numeric" })}`;
};

const stamp = (date: Date) => date.toISOString().replace(/[-:]|\.\d{3}/g, "");

const calendarUrl = (w: Workshop) => {
  const start = new Date(w.datetime);
  let dates: string;
  if (hasTime(start)) {
    dates = `${stamp(start)}/${stamp(new Date(start.getTime() + 60 * 60 * 1000))}`;
  } else {
    const day = fmt(start, { year: "numeric", month: "2-digit", day: "2-digit" });
    const [m, d, y] = day.split("/");
    const next = new Date(Date.UTC(+y, +m - 1, +d + 1)).toISOString().slice(0, 10).replace(/-/g, "");
    dates = `${y}${m}${d}/${next}`;
  }
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `DSI workshop: ${w.title}`,
    dates,
    details: [w.description, w.speaker && `With ${w.speaker}`, w.link].filter(Boolean).join("\n\n"),
    location: w.location ?? "",
  });
  return `https://calendar.google.com/calendar/render?${params}`;
};

export default async function WorkshopsPage() {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("workshops")
    .select("*")
    .order("datetime", { ascending: false });
  if (error) throw new Error(`Workshops: ${error.message}`);
  const workshops = (data ?? []) as Workshop[];

  const now = Date.now();
  const upcoming = workshops
    .filter((w) => new Date(w.datetime).getTime() >= now)
    .reverse();
  const past = workshops.filter((w) => new Date(w.datetime).getTime() < now);

  const byTerm = new Map<string, Workshop[]>();
  for (const w of past) {
    const key = termOf(new Date(w.datetime));
    byTerm.set(key, [...(byTerm.get(key) ?? []), w]);
  }
  const terms = [...byTerm];

  return (
    <main>
      <section className="site-intro" aria-labelledby="workshops-title">
        <div className="site-wrap">
          <p className="site-label">Workshops</p>
          <h1
            id="workshops-title"
            className="site-h1"
            style={{ maxWidth: "14ch" }}
          >
            Learn by doing.
          </h1>
          <p className="site-lede">
            Hands-on sessions, from a first pandas DataFrame to neural networks
            and GPU computing on HiPerGator. Bring a laptop. Open to every major
            and every year.
          </p>
          <div className="site-hero__actions">
            <a
              href={CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="site-btn site-btn--primary"
            >
              Add the DSI calendar{" "}
              <span className="site-arrow" aria-hidden="true">
                →
              </span>
            </a>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="site-btn site-btn--ghost"
            >
              Join the Discord
            </a>
          </div>
        </div>
      </section>

      <section
        className="site-section site-section--tight"
        id="calendar"
        aria-labelledby="upcoming-title"
        style={{ borderTop: "1px solid var(--line)" }}
      >
        <div className="site-wrap">
          <Reveal
            className={`site-head site-head--split${upcoming.length ? "" : " is-last"}`}
          >
            <h2 id="upcoming-title" className="site-h2 site-h2--small">
              Coming up.
            </h2>
            {upcoming.length === 0 && (
              <p className="site-lede">
                Nothing is scheduled right now. New workshops are announced in
                the Discord and land on the DSI calendar, so adding it is the
                easiest way to hear first.
              </p>
            )}
          </Reveal>
          {upcoming.length > 0 && (
            <Reveal>
              <ul className="site-ws-tickets">
                {upcoming.map((workshop, i) => (
                  <Ticket key={workshop.id} workshop={workshop} next={i === 0} />
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </section>

      {terms.length > 0 && (
        <section
          className="site-section site-section--tight"
          aria-labelledby="past-title"
        >
          <div className="site-wrap">
            <Reveal className="site-head site-head--split">
              <h2 id="past-title" className="site-h2 site-h2--small">
                Past workshops.
              </h2>
              <p className="site-lede">
                Notebooks stay online after each session, so you can work
                through any of these on your own. Every one we have published
                is in the{" "}
                <a
                  className="site-link"
                  href={ARCHIVE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  workshop archive on GitHub
                </a>
                .
              </p>
            </Reveal>
            {terms.map(([term, list]) => (
              <Reveal key={term} className="site-ws-term">
                <h3 className="site-ws-term__title">
                  {term}
                  <span>{list.length} {list.length === 1 ? "workshop" : "workshops"}</span>
                </h3>
                <ul className="site-ws-grid">
                  {list.map((workshop) => (
                    <Card key={workshop.id} workshop={workshop} />
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="site-section" aria-labelledby="ufit-title">
        <div className="site-wrap site-hero__grid">
          <Reveal className="site-hero__copy">
            <h2 id="ufit-title" className="site-h2">
              Partnership workshops with UFIT.
            </h2>
            <p className="site-body">
              With UFIT we run workshops on deep learning, high-performance
              computing and research tooling, using the same HiPerGator
              infrastructure UF researchers use. The best known is the NVIDIA
              Deep Learning Institute workshop, which comes with an NVIDIA
              certificate.
            </p>
            <p className="site-body">
              <a
                href="https://www.rc.ufl.edu/highlight-articles/ufit-collaboration-feature.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read UFIT&rsquo;s feature on the collaboration
              </a>
            </p>
          </Reveal>
          <Reveal>
            <figure className="site-plate">
              <div className="site-plate__frame">
                <Image
                  src="/images/workshop/dsixufit.jpg"
                  alt="About thirty workshop attendees posing in front of the NVIDIA Auditorium sign"
                  fill
                  sizes="(min-width: 992px) 48vw, 100vw"
                />
              </div>
            </figure>
          </Reveal>
        </div>
      </section>

      <ClosingCTA />
    </main>
  );
}

function Cover({ workshop, sizes }: { workshop: Workshop; sizes: string }) {
  return (
    <div className="site-ws-slide">
      {workshop.cover ? (
        <Image src={workshop.cover} alt="" fill sizes={sizes} />
      ) : (
        <span aria-hidden="true">{workshop.title}</span>
      )}
    </div>
  );
}

function Ticket({ workshop, next }: { workshop: Workshop; next: boolean }) {
  const when = new Date(workshop.datetime);
  const timed = hasTime(when);
  return (
    <li className={`site-ws-ticket${next ? " is-next" : ""}`}>
      <time className="site-ws-ticket__stub" dateTime={when.toISOString()}>
        <span>{fmt(when, { weekday: "short" })}</span>
        <strong>{fmt(when, { day: "numeric" })}</strong>
        <span>{fmt(when, { month: "short" })}</span>
      </time>
      <div className="site-ws-ticket__body">
        {next && <p className="site-label">Next up</p>}
        <h3 className="site-ws-ticket__title">{workshop.title}</h3>
        {workshop.description && <p className="site-ws-ticket__desc">{workshop.description}</p>}
        <dl className="site-ws-facts">
          <div>
            <dt>When</dt>
            <dd>
              {fmt(when, { weekday: "long", month: "long", day: "numeric" })}
              {timed ? `, ${fmt(when, { hour: "numeric", minute: "2-digit" })}` : ", time TBA"}
            </dd>
          </div>
          <div>
            <dt>Where</dt>
            <dd>{workshop.location || "Room TBA"}</dd>
          </div>
          {workshop.speaker && (
            <div>
              <dt>Led by</dt>
              <dd>{workshop.speaker}</dd>
            </div>
          )}
        </dl>
        <p className="site-ws-ticket__actions">
          <a href={calendarUrl(workshop)} target="_blank" rel="noopener noreferrer" className="site-btn site-btn--primary site-btn--small">
            Add to Google Calendar
          </a>
          {workshop.link && (
            <a href={workshop.link} target="_blank" rel="noopener noreferrer" className="site-btn site-btn--ghost site-btn--small">
              Notebook
            </a>
          )}
        </p>
      </div>
      <div className="site-ws-ticket__cover">
        <Cover workshop={workshop} sizes="(min-width: 992px) 30vw, 100vw" />
      </div>
    </li>
  );
}

function Card({ workshop }: { workshop: Workshop }) {
  const when = new Date(workshop.datetime);
  const inner = (
    <>
      <Cover workshop={workshop} sizes="(min-width: 992px) 25vw, (min-width: 575px) 50vw, 100vw" />
      <div className="site-ws-card__body">
        <time className="site-ws-card__date" dateTime={when.toISOString()}>
          {fmt(when, { month: "short", day: "numeric", year: "numeric" })}
        </time>
        <h4 className="site-h3">{workshop.title}</h4>
        {workshop.description && <p className="site-ws-card__desc">{workshop.description}</p>}
        <p className="site-ws-card__meta">
          {[workshop.speaker && `With ${workshop.speaker}`, workshop.location].filter(Boolean).join(" · ")}
        </p>
        <span className={`site-ws-card__cta${workshop.link ? "" : " is-off"}`}>
          {workshop.link ? (
            <>
              Open the notebook{" "}
              <span className="site-arrow" aria-hidden="true">
                →
              </span>
            </>
          ) : (
            "Notebook not posted"
          )}
        </span>
      </div>
    </>
  );
  return (
    <li className="site-ws-card">
      {workshop.link ? (
        <a href={workshop.link} target="_blank" rel="noopener noreferrer">
          {inner}
        </a>
      ) : (
        <div>{inner}</div>
      )}
    </li>
  );
}
