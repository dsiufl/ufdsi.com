"use client";

import { Article } from "@/types/db";
import MDEditor from "./MDEditor";
import { useContext, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SupabaseContext } from "@/app/SupabaseProvider";
import { AlertContext } from "@/app/AlertProvider";
import { Spinner } from "@/components/ui/spinner";
import { ImageUp, Link2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader, Panel } from "../../../../components/PageHeader";

const CATEGORIES = [
  { value: "Articles", label: "Article" },
  { value: "Competition", label: "Competition" },
  { value: "Workshop", label: "Workshop article" },
];

const toDateInput = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export default function Editor({ article, canPublish }: { article: Article; canPublish: boolean }) {
  const initial = useMemo(
    () => ({
      title: article.title || "",
      summary: article.summary || "",
      content: article.content || "",
      category: article.category || "Articles",
      cover: article.cover || "",
      date: article.created_at ? toDateInput(new Date(article.created_at)) : toDateInput(new Date()),
      status: (article.status ?? (canPublish ? "published" : "draft")) as "draft" | "published",
    }),
    [article, canPublish],
  );
  const [saved, setSaved] = useState(initial);
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = useContext(SupabaseContext);
  const alert = useContext(AlertContext);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((f) => ({ ...f, [key]: value }));
  const changed = JSON.stringify(form) !== JSON.stringify(saved);
  const isNew = !article.id;

  const save = async () => {
    if (!supabase) return;
    if (!form.title.trim()) return alert?.setAlert("error", "Give the article a title first.");
    setSaving(true);
    let cover = form.cover;
    if (cover.startsWith("blob:")) {
      const blob = await fetch(cover).then((r) => r.blob());
      const path = `news/cover-${Date.now()}.${blob.type.split("/")[1] || "png"}`;
      const { error } = await supabase.storage.from("images").upload(path, blob, { contentType: blob.type });
      if (error) {
        setSaving(false);
        return alert?.setAlert("error", `Couldn't upload the cover: ${error.message}`);
      }
      cover = supabase.storage.from("images").getPublicUrl(path).data.publicUrl;
    }
    const row = {
      title: form.title.trim(),
      content: form.content,
      category: form.category,
      created_at: new Date(`${form.date}T12:00:00`).toISOString(),
      summary: form.summary,
      cover,
      status: canPublish ? form.status : "draft",
    };
    const { data, error } = isNew
      ? await supabase.from("news").insert(row).select().single()
      : await supabase.from("news").update(row).eq("id", article.id);
    setSaving(false);
    if (error) return alert?.setAlert("error", `Couldn't save: ${error.message}`);
    if (isNew && data?.id) {
      router.push(`/admin/news/article/${data.id}`);
      return;
    }
    const next = { ...form, cover };
    setForm(next);
    setSaved(next);
    alert?.setAlert("info", "Saved.");
  };

  return (
    <div className="admin-page">
      <PageHeader
        label={isNew ? "New article" : form.status === "draft" ? "Draft" : "Published"}
        title={form.title || "Untitled article"}
        actions={
          <>
            {changed && !isNew && (
              <Button variant="outline" onClick={() => setForm(saved)} disabled={saving}>
                Discard changes
              </Button>
            )}
            <Button onClick={save} disabled={saving || (!changed && !isNew)}>
              {saving ? <Spinner /> : isNew ? "Create article" : changed ? "Save changes" : "Saved"}
            </Button>
          </>
        }
      />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex min-w-0 flex-col gap-6">
          <Panel>
            <div className="flex flex-col gap-5 p-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="news-title">Title</Label>
                <Input id="news-title" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="DSI wins best overall at SwampHacks" className="h-11 text-base" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="news-summary">Summary</Label>
                <Textarea id="news-summary" rows={2} value={form.summary} onChange={(e) => set("summary", e.target.value)} placeholder="One or two sentences for the news list and link previews." />
              </div>
            </div>
          </Panel>
          <Panel title="Body" meta="Markdown">
            <div className="px-5 pb-5">
              <MDEditor
                value={form.content}
                onChange={(value) => {
                  if (value?.target) set("content", value.target.value);
                }}
              />
            </div>
          </Panel>
        </div>

        <div className="flex flex-col gap-6 lg:sticky lg:top-20">
          <Panel title="Publishing">
            <div className="flex flex-col gap-5 px-5 pb-5">
              {canPublish ? (
                <label className="flex items-center justify-between gap-3">
                  <span>
                    <span className="block text-sm font-medium">Published</span>
                    <span className="block text-xs text-muted-foreground">Off keeps it as a draft.</span>
                  </span>
                  <Switch checked={form.status === "published"} onCheckedChange={(v) => set("status", v ? "published" : "draft")} />
                </label>
              ) : (
                <p className="text-sm text-muted-foreground">Saved as a draft until a President, Technology or Marketing Coordinator publishes it.</p>
              )}
              <div className="flex flex-col gap-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => set("category", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...CATEGORIES, ...(CATEGORIES.some((c) => c.value === form.category) ? [] : [{ value: form.category, label: form.category }])].map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="news-date">Date</Label>
                <Input id="news-date" type="date" value={form.date} onChange={(e) => e.target.value && set("date", e.target.value)} />
              </div>
            </div>
          </Panel>

          <Panel title="Cover">
            <div className="flex flex-col gap-3 px-5 pb-5">
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg border bg-muted">
                {form.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.cover} alt="" className="size-full object-cover" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">No cover</span>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) set("cover", URL.createObjectURL(f));
                }}
              />
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => fileRef.current?.click()}>
                  <ImageUp /> Upload
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setUrlMode((m) => !m)}>
                  <Link2 /> Use a URL
                </Button>
              </div>
              {urlMode && (
                <Input
                  autoFocus
                  placeholder="https://"
                  defaultValue={form.cover.startsWith("blob:") ? "" : form.cover}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      set("cover", e.currentTarget.value.trim());
                      setUrlMode(false);
                    }
                  }}
                  onBlur={(e) => {
                    if (e.currentTarget.value.trim()) set("cover", e.currentTarget.value.trim());
                    setUrlMode(false);
                  }}
                />
              )}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
