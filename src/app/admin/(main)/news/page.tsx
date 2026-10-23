import { createClient } from "@/lib/supabase/server";
import { Article } from "@/types/db";
import { cookies } from "next/headers";
import NewsOptions from "./components/NewsOptions";
import Link from "next/link";
import { canPublishNews } from "@/lib/news";
import { Empty, PageHeader, Panel } from "../components/PageHeader";
import { CreateButton } from "../components/CreateButton";

type Status = "all" | "draft" | "published";

const fmt = (d: Date | string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/New_York" });

export default async function page({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const params = await searchParams;
  const status: Status = params.status === "draft" || params.status === "published" ? params.status : "all";
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.schema("admin").from("people").select("role").eq("id", user?.id).single();
  const canPublish = canPublishNews(profile?.role);

  const [{ data: news }, { data: people }] = await Promise.all([
    supabase.from("news").select("*").order("created_at", { ascending: false }),
    supabase.schema("admin").from("people").select("id, first_name, last_name"),
  ]);
  const all = (news ?? []) as Article[];
  const names = new Map((people ?? []).map((p) => [p.id, `${p.first_name} ${p.last_name}`]));
  const isDraft = (a: Article) => a.status === "draft";
  const shown = all.filter((a) => status === "all" || (status === "draft" ? isDraft(a) : !isDraft(a)));
  const drafts = all.filter(isDraft).length;

  const tabs: { id: Status; label: string; count: number }[] = [
    { id: "all", label: "All", count: all.length },
    { id: "draft", label: "Drafts", count: drafts },
    { id: "published", label: "Published", count: all.length - drafts },
  ];

  return (
    <div className="admin-page">
      <PageHeader
        label="Content"
        title="News"
        description={
          canPublish
            ? "Articles on the public news page. Drafts from members wait here until you publish them."
            : "Your posts are saved as drafts until a President, Technology or Marketing Coordinator publishes them."
        }
        actions={
          <CreateButton label="New article" href="/admin/news/article/new" />
        }
      />

      <Panel
        title={
          <nav className="admin-tabs" aria-label="Filter by status">
            {tabs.map((t) => (
              <Link
                key={t.id}
                href={t.id === "all" ? "/admin/news" : `/admin/news?status=${t.id}`}
                aria-current={t.id === status ? "page" : undefined}
              >
                {t.label} <span className="admin-count">{t.count}</span>
              </Link>
            ))}
          </nav>
        }
      >
        {shown.length === 0 ? (
          <Empty title={status === "draft" ? "No drafts waiting" : "No articles yet"}>
            {status === "draft" ? "Everything submitted has been published." : "Write the first one with New article."}
          </Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Article</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {shown.map((item) => {
                  const editable = canPublish || (isDraft(item) && item.author === user?.id);
                  const author = item.author ? names.get(item.author) : undefined;
                  // form submissions have no author, just the email they came from
                  const byline = author ? `By ${author}` : item.submitted_by_email ? `From the form · ${item.submitted_by_email}` : undefined;
                  return (
                    <tr key={item.id}>
                      <td className="max-w-[28rem]">
                        {editable ? (
                          <Link href={`/admin/news/article/${item.id}`} className="admin-table__title hover:underline">
                            {item.title}
                          </Link>
                        ) : (
                          <span className="admin-table__title">{item.title}</span>
                        )}
                        {(byline || item.featured) && (
                          <p className="admin-table__sub">
                            {byline}
                            {byline && item.featured && " · "}
                            {item.featured && "Featured"}
                          </p>
                        )}
                      </td>
                      <td className="text-muted-foreground">{item.category || "—"}</td>
                      <td>
                        {isDraft(item) ? (
                          <span className="admin-pill admin-pill--warn">Draft</span>
                        ) : (
                          <span className="admin-pill admin-pill--ok">Published</span>
                        )}
                      </td>
                      <td className="is-num whitespace-nowrap text-muted-foreground">{fmt(item.created_at)}</td>
                      <td className="w-12 text-right">{editable && <NewsOptions article={item} />}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
