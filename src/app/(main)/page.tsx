import ScrollUp from "@/components/Common/ScrollUp";
import ClosingCTA from "@/components/site/ClosingCTA";
import Reveal from "@/components/site/Reveal";
import SemesterGrid from "@/components/site/SemesterGrid";
import { DISCORD_URL } from "@/components/site/links";
import { buildSemester } from "@/lib/semester";
import { createClient } from "@/lib/supabase/server";
import { symposiumHref } from "@/lib/symposia";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "UF DSI",
  description: "University of Florida Data Science and Informatics Club",
};

const steps = [
  {
    title: "Learn",
    body: "Hands-on workshops, from a first pandas DataFrame to neural networks and GPU computing on HiPerGator. Open to every major and every year.",
    href: "/workshops-list",
    link: "Workshops",
  },
  {
    title: "Build",
    body: "Student-driven research projects in data science and AI. Browse what members are working on this year and find a team.",
    href: "/projects",
    link: "Projects",
  },
  {
    title: "Present",
    body: "The annual DSI Research Symposium puts student research in front of faculty and industry, with keynotes, talks and workshops.",
    href: symposiumHref(),
    link: "Symposium",
  },
];

const companies = [
  "microsoft",
  "lockheed-martin",
  "deloitte",
  "amazon",
  "fifth-third-bank",
  "bank-of-america",
  "pepsico",
  "jpmorgan-chase",
  "ups",
  "nvidia",
  "capital-one",
  "meta",
  "ibm",
  "american-express",
  "citi",
  "tiktok",
];

// Wordmarks with a lot of built-in padding need more room to read at the same size.
const wideLogos = ["lockheed-martin", "jpmorgan-chase", "tiktok", "fifth-third-bank", "nvidia"];

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  // A failed query still renders the page; the grid shows its empty state.
  const { data: workshops } = await supabase.from("workshops").select("*");
  const semester = buildSemester(workshops ?? []);

  return (
    <main>
      <ScrollUp />

      <section className="site-hero" aria-labelledby="hero-title">
        <div className="site-wrap site-hero__grid">
          <div className="site-hero__copy">
            <h1 id="hero-title" className="site-h1">
              <span>A community for data science.</span>
              <span className="site-dim">Open to every major.</span>
            </h1>
            <p className="site-lede">
              DSI is the University of Florida&rsquo;s student organization for data science,
              machine learning and AI. We run workshops, student projects and an annual research
              symposium, because knowledge should be accessible to all.
            </p>
            <div className="site-hero__actions">
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="site-btn site-btn--primary"
              >
                Join the Discord <span className="site-arrow" aria-hidden="true">→</span>
              </a>
              <Link href="/workshops-list" className="site-btn site-btn--ghost">
                See workshops
              </Link>
            </div>
          </div>
          <figure className="site-plate">
            <div className="site-plate__frame">
              <Image
                src="/images/hero/group-photo.png"
                alt="About thirty DSI members in white shirts standing under the yellow steel sculpture outside Marston Science Library, Century Tower behind them"
                fill
                sizes="(min-width: 992px) 48vw, 100vw"
                priority
              />
            </div>
            <figcaption>DSI members outside Marston Science Library.</figcaption>
          </figure>
        </div>
      </section>

      <div className="site-wrap">
        <div className="site-support">
          <p className="site-label">Supported by</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/sponsors/aiiri-logo.webp" alt="UF Artificial Intelligence and Informatics Research Institute" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/sponsors/UFIT.png" alt="UF Information Technology" />
        </div>
      </div>

      <section className="site-section" aria-labelledby="steps-title" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="site-wrap">
          <Reveal className="site-head">
            <h2 id="steps-title" className="site-h2">
              Learn it, build it, present it.
            </h2>
          </Reveal>
          <Reveal>
            <ol className="site-steps">
              {steps.map((step, i) => (
                <li key={step.title} className="site-step">
                  <span className="site-step__num" aria-hidden="true">{i + 1}.</span>
                  <h3 className="site-step__title">{step.title}</h3>
                  <p>{step.body}</p>
                  <Link href={step.href}>
                    {step.link} <span className="site-arrow" aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="site-section" aria-labelledby="semester-title">
        <div className="site-wrap">
          <Reveal className="site-head site-head--split">
            <h2 id="semester-title" className="site-h2">
              {semester.name}, week by week.
            </h2>
            <p className="site-lede">
              {semester.isCurrent
                ? "Every highlighted week has a workshop. Pick one to see what is being taught, when and where."
                : "This term's schedule has not been posted yet, so here is the most recent one. Pick a highlighted week to see what was taught."}
            </p>
          </Reveal>
          <Reveal>
            <SemesterGrid semester={semester} />
          </Reveal>
        </div>
      </section>

      <section className="site-section" aria-labelledby="ledger-title">
        <div className="site-wrap site-split">
          <Reveal>
            <h2 id="ledger-title" className="site-h2">
              Since 2015.
            </h2>
          </Reveal>
          <Reveal>
            <dl className="site-ledger">
              <div>
                <dt>Discord members</dt>
                <dd>2,224</dd>
              </div>
              <div>
                <dt>Instagram followers</dt>
                <dd>2,281</dd>
              </div>
              <div>
                <dt>Research symposiums hosted</dt>
                <dd>2024, 2025</dd>
              </div>
              <div>
                <dt>Recognition</dt>
                <dd className="is-text">
                  UF Student Organization of the Year
                  <br />
                  UF Career Influencer Award
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="site-section" aria-labelledby="companies-title">
        <div className="site-wrap">
          <Reveal className="site-head">
            <h2 id="companies-title" className="site-h2">
              Where our members go to work.
            </h2>
          </Reveal>
          <Reveal>
            <ul className="site-logos">
              {companies.map((company) => (
                <li key={company}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/images/companies-worked/${company}.png`}
                    alt={company.replace(/-/g, " ")}
                    className={wideLogos.includes(company) ? "is-wide" : undefined}
                    loading="lazy"
                  />
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <ClosingCTA />
    </main>
  );
}
