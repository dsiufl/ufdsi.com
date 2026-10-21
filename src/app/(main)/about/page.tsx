import ClosingCTA from "@/components/site/ClosingCTA";
import Reveal from "@/components/site/Reveal";
import { createClient } from "@/lib/supabase/server";
import { symposiumHref } from "@/lib/symposia";
import { Article } from "@/types/db";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | UF DSI",
  description: "UF Data Science and Informatics: a student organization promoting data science education, research and collaboration for every major.",
};

const supporters = [
  {
    name: "Artificial Intelligence and Informatics Research Institute (AIIRI)",
    href: "https://ai.research.ufl.edu/",
    logo: "/images/sponsors/aiiri-logo.webp",
    role: "Official sponsor",
    body: "Provides resources and strategic support for our initiatives.",
  },
  {
    name: "UF Information Technology (UFIT)",
    href: "https://it.ufl.edu/",
    logo: "/images/sponsors/UFIT.png",
    role: "Partner",
    body: "Supports our members with access to the HiPerGator supercomputing infrastructure and technical workshops.",
  },
];

const pastSupporters = [
  { name: "Statistics Department", href: "https://stat.ufl.edu/" },
  { name: "UF Smathers Libraries", href: "https://uflib.ufl.edu/" },
  { name: "Department of Computer & Information Science & Engineering (CISE)", href: "https://www.cise.ufl.edu/" },
  { name: "UF AI2 Center", href: "https://ai.ufl.edu/about/the-ai-center/" },
];

const AboutPage = async () => {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  // Recognition is optional: if the query fails the section is left out.
  const { data } = await supabase
    .from('news')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false });
  const featuredArticles: Article[] = data ?? [];

  return (
    <main>
      <section className="site-hero" aria-labelledby="about-title">
        <div className="site-wrap site-hero__copy">
          <p className="site-label">About DSI</p>
          <h1 id="about-title" className="site-h1" style={{ maxWidth: "18ch" }}>
            Knowledge should be accessible to all.
          </h1>
          <p className="site-lede">
            UF Data Science and Informatics is a student organization at the University of Florida,
            founded in 2015. We promote data science education, research and collaboration for
            students of all majors and grade levels.
          </p>
        </div>
      </section>

      <section className="site-section" aria-labelledby="what-title">
        <div className="site-wrap site-split">
          <Reveal>
            <h2 id="what-title" className="site-label">What we do</h2>
          </Reveal>
          <Reveal>
            <p className="site-lede" style={{ color: "var(--ink)" }}>
              We offer workshops, networking events, research opportunities and a supportive
              community for anyone interested in data science, machine learning, artificial
              intelligence and related fields.
            </p>
            <p className="site-body" style={{ marginTop: "1.4em" }}>
              Most importantly, we believe knowledge should be accessible to all. You do not need
              to be in a particular major or year to take part.
            </p>
            <p className="site-body">
              <Link href="/workshops-list">Workshops</Link>, <Link href="/projects">projects</Link>{" "}
              and the <Link href={symposiumHref()}>symposium</Link> are all open to join.
            </p>
          </Reveal>
        </div>
      </section>

      {featuredArticles.length > 0 && (
        <section className="site-section" aria-labelledby="recognition-title">
          <div className="site-wrap">
            <Reveal className="site-head">
              <h2 id="recognition-title" className="site-h2">Recognition.</h2>
            </Reveal>
            <Reveal>
              <ul className="site-rows">
                {featuredArticles.map((article) => (
                  <li key={article.id} className="site-row">
                    <Link href={`/newsletter/${article.id}`} className="site-row__inner">
                      <span className="site-row__meta">
                        {new Date(article.created_at).getFullYear()} · {article.category}
                      </span>
                      <span>
                        <h3 className="site-h3">{article.title}</h3>
                        {article.summary && <p>{article.summary}</p>}
                      </span>
                      {article.cover && (
                        <span className="site-row__thumb">
                          <Image src={article.cover} alt="" fill sizes="200px" />
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      )}

      <section className="site-section" aria-labelledby="support-title">
        <div className="site-wrap">
          <Reveal className="site-head">
            <h2 id="support-title" className="site-h2">Supported by.</h2>
          </Reveal>
          <Reveal>
            <ul className="site-rows">
              {supporters.map((supporter) => (
                <li key={supporter.name} className="site-row">
                  <a
                    href={supporter.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="site-row__inner site-row__inner--logo"
                  >
                    <span className="site-row__logo">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={supporter.logo} alt="" />
                    </span>
                    <span>
                      <h3 className="site-h3">{supporter.name}</h3>
                      <p>{supporter.body}</p>
                    </span>
                    <span className="site-row__meta">{supporter.role}</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="site-body" style={{ marginTop: 28 }}>
              With thanks for past support to the{" "}
              {pastSupporters.map((supporter, i) => (
                <span key={supporter.name}>
                  {i > 0 && (i === pastSupporters.length - 1 ? " and the " : ", ")}
                  <a href={supporter.href} target="_blank" rel="noopener noreferrer">{supporter.name}</a>
                </span>
              ))}
              . <Link href="/sponsors">See all sponsors</Link>.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="site-section" aria-labelledby="team-title">
        <div className="site-wrap site-split">
          <Reveal>
            <h2 id="team-title" className="site-label">People</h2>
          </Reveal>
          <Reveal>
            <p className="site-lede" style={{ color: "var(--ink)" }}>
              DSI is run by students, for students. Meet the executive board and the members who
              keep workshops, projects and the symposium moving.
            </p>
            <p style={{ marginTop: 24 }}>
              <Link href="/team" className="site-btn site-btn--ghost">
                Meet the team <span className="site-arrow" aria-hidden="true">→</span>
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      <ClosingCTA />
    </main>
  );
};

export default AboutPage;
