import ClosingCTA from "@/components/site/ClosingCTA";
import { createPublicClient } from "@/lib/supabase/public";
import { Article } from "@/types/db";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";

export const revalidate = 300;

type Params = { params: Promise<{ id: string }> };

// Invalid ids (PGRST116 no row, 22P02 not a uuid) are a 404, anything else is an error.
async function getArticle(id: string) {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("news").select("*").eq("id", id).maybeSingle();
  if (error && error.code !== "22P02") throw new Error(`News ${id}: ${error.message}`);
  return data as Article | null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const article = await getArticle((await params).id);
  if (!article) return { title: "News | UF DSI" };
  return {
    title: `${article.title} | UF DSI`,
    description: article.summary?.replace(/\\n/g, " ").slice(0, 160) || undefined,
    openGraph: article.cover ? { images: [article.cover] } : undefined,
  };
}

function ArticleLink({ href, children }: { href?: string; children?: React.ReactNode }) {
  if (!href) return <>{children}</>;
  return href.startsWith("http") ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    <Link href={href}>{children}</Link>
  );
}

export default async function ArticlePage({ params }: Params) {
  const article = await getArticle((await params).id);
  if (!article) notFound();

  // Some stories were saved with literal "\n" sequences instead of line breaks.
  const body = (article.content || "").replace(/\\n/g, "\n");

  return (
    <main>
      <article className="site-article">
        <div className="site-wrap">
          <div className="site-article__inner">
            <Link href="/newsletter" className="site-crumb">
              <span aria-hidden="true">←</span> All news
            </Link>
            <p className="site-label">
              {new Date(article.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/New_York" })}
              {article.category && ` · ${article.category}`}
            </p>
            <h1 className="site-h1">{article.title}</h1>
            {article.cover && (
              <figure className="site-plate">
                <div className="site-plate__frame">
                  <Image src={article.cover} alt="" fill sizes="(min-width: 800px) 720px, 100vw" priority />
                </div>
              </figure>
            )}
            {body.trim() && (
              <div className="site-prose">
                <Markdown components={{ a: ArticleLink }}>{body}</Markdown>
              </div>
            )}
          </div>
        </div>
      </article>
      <ClosingCTA />
    </main>
  );
}
