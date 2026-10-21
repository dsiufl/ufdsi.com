import ClosingCTA from "@/components/site/ClosingCTA";
import Reveal from "@/components/site/Reveal";
import { createPublicClient } from "@/lib/supabase/public";
import { Article } from "@/types/db";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "News | UF DSI",
  description: "Awards, competition wins, talks and events from the UF Data Science and Informatics community.",
};

const SUBSCRIBE_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdCp0aDNGllhmKSC9HuCJ5qcTHSiEwG1ONPtqNiNDVPf6gZLw/viewform";

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("news").select("id, title, summary, category, cover, created_at").order("created_at", { ascending: false });
  if (error) throw new Error(`News: ${error.message}`);
  const articles = (data ?? []) as Article[];

  const categories = Array.from(new Set(articles.map((article) => article.category).filter(Boolean)));
  const shown = category ? articles.filter((article) => article.category === category) : articles;

  return (
    <main>
      <section className="site-intro" aria-labelledby="news-title">
        <div className="site-wrap">
          <p className="site-label">News</p>
          <h1 id="news-title" className="site-h1" style={{ maxWidth: "16ch" }}>
            What DSI members are up to.
          </h1>
          <p className="site-lede">
            Awards, hackathon wins, guest talks and events. The newsletter sends the highlights to your inbox.
          </p>
          <div className="site-hero__actions">
            <a href={SUBSCRIBE_URL} target="_blank" rel="noopener noreferrer" className="site-btn site-btn--primary">
              Subscribe to the newsletter <span className="site-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      <section className="site-section" aria-labelledby="stories-title">
        <div className="site-wrap">
          <h2 id="stories-title" className="sr-only">
            Stories
          </h2>
          <nav aria-label="Filter by category">
            <ul className="site-filter">
              <li>
                <Link href="/newsletter" aria-current={!category ? "page" : undefined} scroll={false}>
                  All
                </Link>
              </li>
              {categories.map((name) => (
                <li key={name}>
                  <Link
                    href={`/newsletter?category=${encodeURIComponent(name)}`}
                    aria-current={category === name ? "page" : undefined}
                    scroll={false}
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Reveal>
            {shown.length > 0 ? (
              <ul className="site-rows">
                {shown.map((article) => (
                  <li key={article.id} className="site-row">
                    <Link href={`/newsletter/${article.id}`} className="site-row__inner">
                      <span className="site-row__meta">
                        {new Date(article.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "America/New_York" })}
                        <br />
                        {article.category}
                      </span>
                      <span>
                        <h3 className="site-h3">{article.title}</h3>
                        {article.summary && <p>{article.summary.replace(/\\n/g, " ")}</p>}
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
            ) : (
              <p className="site-empty">No stories in this category yet.</p>
            )}
          </Reveal>
        </div>
      </section>

      <ClosingCTA />
    </main>
  );
}
