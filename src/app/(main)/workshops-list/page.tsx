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
              <ul className="site-upcoming">
                {upcoming.map((workshop) => {
                  const when = new Date(workshop.datetime);
                  return (
                    <li key={workshop.id}>
                      <time className="site-date" dateTime={when.toISOString()}>
                        <span>{fmt(when, { month: "short" })}</span>
                        <strong>{fmt(when, { day: "numeric" })}</strong>
                      </time>
                      <div>
                        <h3 className="site-h3">{workshop.title}</h3>
                        <p>
                          {fmt(when, {
                            weekday: "long",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                          {workshop.location && ` · ${workshop.location}`}
                          {workshop.speaker && (
                            <>
                              <br />
                              With {workshop.speaker}
                            </>
                          )}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          )}
        </div>
      </section>

      {past.length > 0 && (
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
                Notebooks stay online after each session. Every one we have
                published is in the{" "}
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
            <Reveal>
              <ul className="site-rows">
                {past.map((workshop) => {
                  const when = new Date(workshop.datetime);
                  const body = (
                    <>
                      <span className="site-row__meta">
                        {fmt(when, { month: "short", year: "numeric" })}
                      </span>
                      <span>
                        <h3 className="site-h3">{workshop.title}</h3>
                        {workshop.speaker && (
                          <span className="site-row__lead">
                            With {workshop.speaker}
                          </span>
                        )}
                      </span>
                      <span className="site-row__action">
                        {workshop.link ? (
                          <>
                            Notebook{" "}
                            <span className="site-arrow" aria-hidden="true">
                              →
                            </span>
                          </>
                        ) : null}
                      </span>
                    </>
                  );
                  return (
                    <li key={workshop.id} className="site-row">
                      {workshop.link ? (
                        <a
                          href={workshop.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="site-row__inner site-row__inner--index"
                        >
                          {body}
                        </a>
                      ) : (
                        <div className="site-row__inner site-row__inner--index">
                          {body}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Reveal>
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
