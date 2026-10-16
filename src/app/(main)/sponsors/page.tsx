import ClosingCTA from "@/components/site/ClosingCTA";
import LogoTiles from "@/components/site/LogoTiles";
import Reveal from "@/components/site/Reveal";
import TierTable from "@/components/site/TierTable";
import { SPONSOR_EMAIL } from "@/lib/sponsorship";
import { CURRENT_SYMPOSIUM_YEAR, symposiumHref } from "@/lib/symposia";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sponsors | UF DSI",
  description: "Sponsor UF Data Science and Informatics and reach University of Florida students working in data science and AI.",
};

const collaborators = [
  { name: "UF Information Technology", href: "https://it.ufl.edu", logo: "/images/sponsors/UFIT.png" },
  { name: "Statistics Department", href: "https://stat.ufl.edu/", logo: "/images/sponsors/Statistics.png" },
  { name: "UF Smathers Libraries", href: "https://uflib.ufl.edu/", logo: "/images/symposium-25/sponsors/smathers.png" },
  { name: "CISE Department", href: "https://cise.ufl.edu/", logo: "/images/symposium-25/sponsors/CISE.png" },
  { name: "UF AI2 Center", href: "https://ai.ufl.edu/about/the-ai-center/", logo: "/images/sponsors/UF-AI-Center-logo.png" },
];

export default function SponsorsPage() {
  return (
    <main>
      <section className="site-hero" aria-labelledby="sponsors-title">
        <div className="site-wrap site-hero__grid">
          <div className="site-hero__copy">
            <p className="site-label">Sponsors</p>
            <h1 id="sponsors-title" className="site-h1">
              <span>Partner with DSI.</span>
              <span className="site-dim">Meet the students building with data.</span>
            </h1>
            <p className="site-lede">
              Our partnerships connect members and the wider UF community with companies at the
              forefront of data science and AI, through workshops, talks, the symposium and our
              newsletter.
            </p>
            <div className="site-hero__actions">
              <a href={`mailto:${SPONSOR_EMAIL}?subject=Sponsoring%20DSI`} className="site-btn site-btn--primary">
                Email us about sponsoring <span className="site-arrow" aria-hidden="true">→</span>
              </a>
              <Link href={`${symposiumHref()}#sponsor`} className="site-btn site-btn--ghost">
                Sponsor Symposium {CURRENT_SYMPOSIUM_YEAR}
              </Link>
            </div>
          </div>
          <figure className="site-plate">
            <div className="site-plate__frame">
              <Image
                src="/images/newsletter/shellhacks25/1.jpg"
                alt="DSI members smiling from their seats on a charter bus"
                fill
                sizes="(min-width: 992px) 48vw, 100vw"
                priority
              />
            </div>
            <figcaption>On the bus to ShellHacks, Florida&rsquo;s largest hackathon.</figcaption>
          </figure>
        </div>
      </section>

      <section className="site-section" aria-labelledby="main-title" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="site-wrap">
          <Reveal className="site-head">
            <h2 id="main-title" className="site-h2">
              Main sponsor.
            </h2>
          </Reveal>
          <Reveal>
            <ul className="site-rows">
              <li className="site-row">
                <a href="https://ai.research.ufl.edu/" target="_blank" rel="noopener noreferrer" className="site-row__inner site-row__inner--logo">
                  <span className="site-row__logo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/sponsors/aiiri-logo.webp" alt="" />
                  </span>
                  <span>
                    <h3 className="site-h3">Artificial Intelligence and Informatics Research Institute (AIIRI)</h3>
                    <p>Driving innovation in AI and data science research at UF.</p>
                  </span>
                  <span className="site-row__action">
                    Visit <span className="site-arrow" aria-hidden="true">→</span>
                  </span>
                </a>
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="site-section" aria-labelledby="collab-title">
        <div className="site-wrap">
          <Reveal className="site-head site-head--split">
            <h2 id="collab-title" className="site-h2">
              Collaborators.
            </h2>
            <p className="site-lede">
              With thanks for ongoing support from departments and organizations across UF.
            </p>
          </Reveal>
          <Reveal>
            <LogoTiles logos={collaborators} />
          </Reveal>
        </div>
      </section>

      <section className="site-section" aria-labelledby="tiers-title">
        <div className="site-wrap">
          <Reveal className="site-head site-head--split">
            <h2 id="tiers-title" className="site-h2">
              Sponsorship tiers.
            </h2>
            <p className="site-lede">
              Logos are more prominent at higher tiers. If none of these fit, email{" "}
              <a className="site-link" href={`mailto:${SPONSOR_EMAIL}`}>
                {SPONSOR_EMAIL}
              </a>{" "}
              and we will build a package that works for you.
            </p>
          </Reveal>
          <Reveal>
            <TierTable />
          </Reveal>
        </div>
      </section>

      <ClosingCTA />
    </main>
  );
}
