import ClosingCTA from "@/components/site/ClosingCTA";
import LogoTiles from "@/components/site/LogoTiles";
import Reveal from "@/components/site/Reveal";
import TierTable from "@/components/site/TierTable";
import { SPONSOR_EMAIL } from "@/lib/sponsorship";
import {
  calendarUrl,
  CURRENT_SYMPOSIUM_YEAR,
  formatDay,
  formatTime,
  hasTime,
  imageSrc,
  symposia,
  symposiumHref,
  venueAddress,
} from "@/lib/symposia";
import type { Speaker } from "@/types/db";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Countdown from "./Countdown";
import { loadSymposium, SymposiumData } from "./data";

// Served from cache and rebuilt in the background at most every five minutes,
// so admin edits show up without a deploy.
export const revalidate = 300;

export function generateStaticParams() {
  return Object.keys(symposia).map((year) => ({ year }));
}

type Params = { params: Promise<{ year: string }> };

const SUMMARY =
  "Talks, research and workshops on data science and AI, organized by students at the University of Florida.";

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const data = await loadSymposium((await params).year);
  if (!data) return { title: "Symposium | UF DSI" };
  const when = data.date ? formatDay(data.date) : `Spring ${data.year}`;
  return {
    title: `DSI Symposium ${data.year} | UF DSI`,
    description: `${when}. ${SUMMARY}`,
    alternates: { canonical: symposiumHref(data.year) },
  };
}

const mailto = (subject: string) =>
  `mailto:${SPONSOR_EMAIL}?subject=${encodeURIComponent(subject)}`;

const tracks = [
  {
    name: "General",
    body: "Talks for a broad audience on where data science and AI are heading.",
  },
  {
    name: "Research",
    body: "Faculty and graduate researchers presenting their own work.",
  },
  {
    name: "Industry",
    body: "Practitioners on careers and the work behind real products.",
  },
  {
    name: "Workshop",
    body: "Hands-on sessions, often led by student organizations.",
  },
];

export default async function SymposiumPage({ params }: Params) {
  const data = await loadSymposium((await params).year);
  if (!data) notFound();
  const { year, config, date, stage, speakers, keynote, agenda, otherYears } =
    data;

  const upcoming = stage !== "archive";
  const speakHref =
    data.speakerFormUrl ?? mailto(`Speaking at the DSI Symposium ${year}`);
  const sponsorHref =
    data.sponsorFormUrl ?? mailto(`Sponsoring the DSI Symposium ${year}`);
  const previous = otherYears.find((other) => other.year < year);
  const previousSponsors = previous
    ? symposia[previous.year]?.sponsors ?? []
    : [];
  const recorded = speakers.filter((speaker) => speaker.youtube).length;
  const others = speakers.filter((speaker) => speaker.id !== keynote?.id);

  return (
    <main>
      <EventData data={data} />

      <section className="site-symp-hero" aria-labelledby="symp-title">
        <div className="site-wrap site-symp-hero__grid">
          <div className="site-symp-hero__copy">
            <p className="site-label">UF DSI Research Symposium</p>
            <h1 id="symp-title" className="site-symp-title">
              Symposium <span>{year}</span>
            </h1>
            <p className="site-lede">
              {stage === "archive"
                ? `Held ${date ? formatDay(date) : year}. `
                : ""}
              {SUMMARY}
              {stage === "announced" && " The lineup is being built now."}
            </p>
            <div className="site-hero__actions">
              {stage === "lineup" && config.registerUrl && (
                <a
                  href={config.registerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-btn site-btn--primary"
                >
                  Register{" "}
                  <span className="site-arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              )}
              {(stage === "announced" || stage === "tba") && (
                <>
                  <a href={speakHref} className="site-btn site-btn--primary">
                    Propose a talk{" "}
                    <span className="site-arrow" aria-hidden="true">
                      →
                    </span>
                  </a>
                  <a href="#sponsor" className="site-btn site-btn--ghost">
                    Sponsor {year}
                  </a>
                </>
              )}
              {stage === "archive" && year !== CURRENT_SYMPOSIUM_YEAR && (
                <Link
                  href={symposiumHref()}
                  className="site-btn site-btn--primary"
                >
                  Symposium {CURRENT_SYMPOSIUM_YEAR}{" "}
                  <span className="site-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              )}
              {agenda.length > 0 && (
                <Link
                  href={`${symposiumHref(year)}/agenda`}
                  className="site-btn site-btn--ghost"
                >
                  Full agenda
                </Link>
              )}
            </div>
          </div>

          <div className="site-symp-hero__copy">
            <dl className="site-facts">
              <div>
                <dt>Date</dt>
                <dd>
                  {date ? formatDay(date) : "To be announced"}
                  {date && upcoming && (
                    <a
                      className="site-dim"
                      href={calendarUrl(year, date, config.venue)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Add to calendar
                    </a>
                  )}
                </dd>
              </div>
              {(upcoming || (date && hasTime(date))) && (
                <div>
                  <dt>Time</dt>
                  <dd>
                    {date && hasTime(date)
                      ? `Doors open ${formatTime(date)}`
                      : "To be announced"}
                  </dd>
                </div>
              )}
              <div>
                <dt>Venue</dt>
                <dd>
                  {config.venue ? (
                    <a
                      href={config.venue.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {config.venue.name}, {venueAddress(config.venue)}
                    </a>
                  ) : (
                    "University of Florida campus, room to be announced"
                  )}
                </dd>
              </div>
            </dl>
            {date && upcoming && (
              <Countdown target={date.getTime()} renderedAt={data.renderedAt} />
            )}
          </div>
        </div>
      </section>

      {config.photos.length > 0 && (
        <div className="site-wrap">
          <ul
            className="site-gallery"
            aria-label="Photos from past DSI symposiums"
          >
            {config.photos.map((photo, i) => (
              <li key={photo.src}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={640}
                  height={480}
                  sizes="(min-width: 1200px) 16vw, (min-width: 768px) 33vw, 50vw"
                  priority={i < 2}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {stage === "announced" && previous && previous.speakers > 0 && (
        <section className="site-section" aria-labelledby="last-title">
          <div className="site-wrap site-split">
            <Reveal>
              <h2 id="last-title" className="site-h2">
                {previous.year}, in numbers.
              </h2>
            </Reveal>
            <Reveal>
              <dl className="site-ledger">
                <div>
                  <dt>Speakers</dt>
                  <dd>{previous.speakers}</dd>
                </div>
                {previous.sessions > 0 && (
                  <div>
                    <dt>Sessions on the agenda</dt>
                    <dd>{previous.sessions}</dd>
                  </div>
                )}
                {previousSponsors.length > 0 && (
                  <div>
                    <dt>Sponsors</dt>
                    <dd>{previousSponsors.length}</dd>
                  </div>
                )}
              </dl>
              <p className="site-body" style={{ marginTop: 20 }}>
                <Link href={symposiumHref(previous.year)}>
                  See the {previous.year} symposium
                </Link>
              </p>
            </Reveal>
          </div>
        </section>
      )}

      {(stage === "announced" || stage === "tba") && (
        <section
          className="site-section"
          id="speak"
          aria-labelledby="speak-title"
        >
          <div className="site-wrap">
            <Reveal className="site-head site-head--split">
              <h2 id="speak-title" className="site-h2">
                Speak at the {year} symposium.
              </h2>
              <div>
                <p className="site-lede">
                  We are looking for talks from industry, research labs and
                  student organizations. Tell us what you would like to present
                  and which track it fits.
                </p>
                <div className="site-hero__actions">
                  <a href={speakHref} className="site-btn site-btn--primary">
                    Propose a talk{" "}
                    <span className="site-arrow" aria-hidden="true">
                      →
                    </span>
                  </a>
                </div>
              </div>
            </Reveal>
            <Reveal>
              <dl className="site-tracks">
                {tracks.map((track) => (
                  <div key={track.name}>
                    <dt>{track.name} track</dt>
                    <dd>{track.body}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>
      )}

      {keynote && (
        <section className="site-section" aria-labelledby="keynote-title">
          <div className="site-wrap">
            <Reveal className="site-keynote">
              <div className="site-keynote__photo">
                {imageSrc(keynote.cover) && (
                  <Image
                    src={imageSrc(keynote.cover)!}
                    alt=""
                    width={320}
                    height={400}
                    sizes="(min-width: 768px) 320px, 240px"
                  />
                )}
              </div>
              <div className="site-keynote__body">
                <p className="site-label">Keynote</p>
                <h2 id="keynote-title" className="site-keynote__name">
                  {keynote.name}
                </h2>
                <p className="site-keynote__aff">{keynote.affiliation}</p>
                {keynote.title && (
                  <p className="site-keynote__talk">
                    {keynote.title.replace(/^Keynote:\s*/i, "")}
                  </p>
                )}
                {keynote.description && (
                  <p className="site-body">{keynote.description}</p>
                )}
                {keynote.youtube && (
                  <a
                    className="site-watch"
                    href={keynote.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Watch the recording
                  </a>
                )}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section
          className="site-section"
          id="speakers"
          aria-labelledby="speakers-title"
        >
          <div className="site-wrap">
            <Reveal className="site-head site-head--split">
              <h2 id="speakers-title" className="site-h2">
                {keynote ? "Speakers." : "The lineup."}
              </h2>
              {recorded > 0 && (
                <p className="site-lede">
                  {recorded === speakers.length
                    ? "Every talk was recorded."
                    : `${recorded} of ${speakers.length} talks were recorded.`}{" "}
                  Each speaker links to their recording.
                </p>
              )}
            </Reveal>
            {groupByTrack(others).map((group) => (
              <Reveal key={group.track} className="site-track">
                {group.track && (
                  <h3 className="site-h3 site-track__title">
                    {group.track}
                    <span className="site-dim">{group.speakers.length}</span>
                  </h3>
                )}
                <ul className="site-speakers">
                  {group.speakers.map((speaker) => (
                    <SpeakerItem
                      key={speaker.id}
                      speaker={speaker}
                      nested={Boolean(group.track)}
                    />
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {upcoming && (
        <section
          className="site-section"
          id="sponsor"
          aria-labelledby="sponsor-title"
        >
          <div className="site-wrap">
            <Reveal className="site-head site-head--split">
              <h2 id="sponsor-title" className="site-h2">
                Sponsor the {year} symposium.
              </h2>
              <div>
                <p className="site-lede">
                  Put your team in front of UF students from every major who are
                  working in data science and AI. Packages start at $500, and we
                  can build one around what you need.
                </p>
                <div className="site-hero__actions">
                  <a href={sponsorHref} className="site-btn site-btn--primary">
                    Talk to us about sponsoring{" "}
                    <span className="site-arrow" aria-hidden="true">
                      →
                    </span>
                  </a>
                  <Link href="/sponsors" className="site-btn site-btn--ghost">
                    Sponsorship details
                  </Link>
                </div>
              </div>
            </Reveal>
            <Reveal>
              <TierTable />
            </Reveal>
          </div>
        </section>
      )}

      {config.sponsors.length > 0 && (
        <section
          className="site-section site-section--tight"
          aria-labelledby="sponsors-title"
        >
          <div className="site-wrap">
            <Reveal className="site-head">
              <h2 id="sponsors-title" className="site-h2 site-h2--small">
                {upcoming ? `${year} sponsors.` : "Sponsored by."}
              </h2>
            </Reveal>
            <Reveal>
              <LogoTiles logos={config.sponsors} />
            </Reveal>
            {config.collaborators.length > 0 && (
              <Reveal>
                <h3 className="site-h3" style={{ margin: "40px 0 20px" }}>
                  In collaboration with
                </h3>
                <LogoTiles logos={config.collaborators} />
              </Reveal>
            )}
          </div>
        </section>
      )}

      {upcoming &&
        config.sponsors.length === 0 &&
        previous &&
        previousSponsors.length > 0 && (
          <section
            className="site-section site-section--tight"
            aria-labelledby="past-sponsors-title"
          >
            <div className="site-wrap">
              <Reveal className="site-head">
                <h2 id="past-sponsors-title" className="site-h2 site-h2--small">
                  Our {previous.year} sponsors.
                </h2>
              </Reveal>
              <Reveal>
                <LogoTiles logos={previousSponsors} />
              </Reveal>
            </div>
          </section>
        )}

      {otherYears.length > 0 && (
        <section
          className="site-section site-section--tight"
          aria-labelledby="years-title"
        >
          <div className="site-wrap">
            <Reveal className="site-head">
              <h2 id="years-title" className="site-h2 site-h2--small">
                {upcoming ? "Past symposiums." : "Other years."}
              </h2>
            </Reveal>
            <Reveal>
              <ul className="site-rows">
                {otherYears.map((other) => (
                  <li key={other.year} className="site-row">
                    <Link
                      href={symposiumHref(other.year)}
                      className="site-row__inner site-row__inner--index"
                    >
                      <span className="site-row__meta">{other.year}</span>
                      <span>
                        <span className="site-h3">{formatDay(other.date)}</span>
                        {other.speakers > 0 && (
                          <span className="site-row__lead">
                            {other.speakers} speakers
                          </span>
                        )}
                      </span>
                      <span className="site-row__action">
                        View{" "}
                        <span className="site-arrow" aria-hidden="true">
                          →
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      )}

      <ClosingCTA />
    </main>
  );
}

function groupByTrack(speakers: Speaker[]) {
  const groups: { track: string; speakers: Speaker[] }[] = [];
  for (const speaker of speakers) {
    const track = speaker.track?.trim() ?? "";
    const group = groups.find((g) => g.track === track);
    if (group) group.speakers.push(speaker);
    else groups.push({ track, speakers: [speaker] });
  }
  return groups;
}

// Names sit under a track heading (h3) when there is one, otherwise under the h2.
function SpeakerItem({
  speaker,
  nested,
}: {
  speaker: Speaker;
  nested: boolean;
}) {
  const Name = nested ? "h4" : "h3";
  const src = imageSrc(speaker.cover);
  const meta = [speaker.time, speaker.location].filter(Boolean).join(" · ");
  return (
    <li className="site-speaker">
      <div className="site-speaker__photo">
        {src && (
          <Image
            src={src}
            alt=""
            width={400}
            height={400}
            sizes="(min-width: 1200px) 240px, (min-width: 768px) 30vw, 45vw"
          />
        )}
      </div>
      <Name className="site-speaker__name">{speaker.name}</Name>
      <p className="site-speaker__aff">{speaker.affiliation}</p>
      {speaker.title && <p className="site-speaker__talk">{speaker.title}</p>}
      {meta && <p className="site-speaker__meta">{meta}</p>}
      {speaker.description && (
        <details>
          <summary>Abstract</summary>
          <p>{speaker.description}</p>
        </details>
      )}
      {speaker.youtube && (
        <div>
          <a
            className="site-watch"
            href={speaker.youtube}
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch<span className="sr-only"> {speaker.name}&rsquo;s talk</span>
          </a>
        </div>
      )}
    </li>
  );
}

// schema.org Event, so search results can show the date and place.
function EventData({ data }: { data: SymposiumData }) {
  const { year, date, config, speakers, stage } = data;
  if (!date) return null;
  const day = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
  }).format(date);
  const venue = config.venue;
  const event = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `DSI Symposium ${year}`,
    description: SUMMARY,
    startDate: hasTime(date) ? date.toISOString() : day,
    endDate: day,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: `https://ufdsi.com${symposiumHref(year)}`,
    image: [
      `https://ufdsi.com${config.photos[0]?.src ?? "/images/hero/group-photo.png"}`,
    ],
    location: {
      "@type": "Place",
      name: venue
        ? `${venue.name}, University of Florida`
        : "University of Florida",
      address: {
        "@type": "PostalAddress",
        ...(venue && {
          streetAddress: venue.street,
          postalCode: venue.postalCode,
        }),
        addressLocality: "Gainesville",
        addressRegion: "FL",
        addressCountry: "US",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "UF Data Science and Informatics",
      url: "https://ufdsi.com",
    },
    ...(speakers.length > 0 && {
      performer: speakers.map((speaker) => ({
        "@type": "Person",
        name: speaker.name,
      })),
    }),
    ...(stage === "lineup" &&
      config.registerUrl && {
        offers: {
          "@type": "Offer",
          url: config.registerUrl,
          availability: "https://schema.org/InStock",
        },
      }),
  };
  return (
    <script
      type="application/ld+json"
      // Plain data built above; escape "<" so a value can never close the tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(event).replace(/</g, "\\u003c"),
      }}
    />
  );
}
