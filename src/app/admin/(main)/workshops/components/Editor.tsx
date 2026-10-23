"use client";

import { Workshop } from "@/types/db";
import { useCallback, useContext, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExternalLink, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Overlay from "@/components/Overlay/Overlay";
import EditWorkshop from "./EditWorkshop";
import { createUserClient } from "@/lib/supabase/client";
import { AlertContext } from "@/app/AlertProvider";
import { Empty, PageHeader, Panel } from "../../components/PageHeader";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { CreateButton } from "../../components/CreateButton";

const TZ = "America/New_York";
const part = (d: Date | string, o: Intl.DateTimeFormatOptions) =>
  new Date(d).toLocaleString("en-US", { timeZone: TZ, ...o });

export default function Editor({
  workshops,
  canPublish,
  userId,
  names,
}: {
  workshops: Workshop[];
  canPublish: boolean;
  userId?: string;
  names: Record<string, string>;
}) {
  const [list, setList] = useState<Workshop[]>(workshops);
  const params = useSearchParams();
  const [adding, setAdding] = useState(params.get("new") === "1");
  const [editing, setEditing] = useState<Workshop | undefined>();
  const [deleting, setDeleting] = useState<Workshop | undefined>();
  const supabase = createUserClient();
  const alert = useContext(AlertContext);

  const { upcoming, past } = useMemo(() => {
    const now = Date.now();
    const sorted = [...list].filter(Boolean).sort((a, b) => +new Date(a.datetime) - +new Date(b.datetime));
    return {
      upcoming: sorted.filter((w) => +new Date(w.datetime) >= now),
      past: sorted.filter((w) => +new Date(w.datetime) < now).reverse(),
    };
  }, [list]);

  const openAdd = useCallback(() => setAdding(true), []);
  const isDraft = (w: Workshop) => w.status === "draft";
  const editable = (w: Workshop) => canPublish || (isDraft(w) && w.author === userId);
  // form submissions have no author, just the email they came from
  const byline = (w: Workshop) =>
    w.author && names[w.author] ? `By ${names[w.author]}` : w.submitted_by_email ? `From the form · ${w.submitted_by_email}` : undefined;
  const withStatus = (data: Workshop): Workshop => ({ ...data, status: canPublish ? data.status ?? "published" : "draft" });

  const uploadCover = async (data: Workshop) => {
    if (!data.cover?.includes("blob")) return true;
    const path = `workshops/${data.title.replace(/\s+/g, "_").toLowerCase()}.jpg`;
    const blob = await fetch(data.cover).then((r) => r.blob());
    const { error } = await supabase.storage.from("images").upload(path, blob, { upsert: true, contentType: blob.type });
    if (error) {
      alert?.setAlert("error", `Couldn't upload the cover: ${error.message}`);
      return false;
    }
    data.cover = supabase.storage.from("images").getPublicUrl(path).data.publicUrl;
    return true;
  };

  const create = async (data: Workshop) => {
    if (!(await uploadCover(data))) return;
    const { data: row, error } = await supabase.from("workshops").insert(withStatus(data)).select().single();
    if (error) return alert?.setAlert("error", `Couldn't add the workshop: ${error.message}`);
    setList((l) => [...l, row ?? withStatus(data)]);
    setAdding(false);
  };

  const update = async (data: Workshop) => {
    if (!(await uploadCover(data))) return;
    const row = withStatus(data);
    const { error } = await supabase.from("workshops").update(row).eq("id", row.id);
    if (error) return alert?.setAlert("error", `Couldn't save the workshop: ${error.message}`);
    setList((l) => l.map((w) => (w.id === row.id ? row : w)));
    setEditing(undefined);
  };

  const remove = async () => {
    if (!deleting) return;
    const { error } = await supabase.from("workshops").delete().eq("id", deleting.id);
    if (error) return alert?.setAlert("error", `Couldn't delete the workshop: ${error.message}`);
    setList((l) => l.filter((w) => w.id !== deleting.id));
    setDeleting(undefined);
  };

  const Menu = ({ w }: { w: Workshop }) => !editable(w) ? null : (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="admin-row-actions h-8 w-8 text-muted-foreground" aria-label={`Options for ${w.title}`}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setEditing(w)}>
          <Pencil className="mr-2 size-4" /> Edit
        </DropdownMenuItem>
        {w.link && (
          <DropdownMenuItem onClick={() => window.open(w.link, "_blank", "noopener,noreferrer")}>
            <ExternalLink className="mr-2 size-4" /> Open link
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleting(w)}>
          <Trash2 className="mr-2 size-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="admin-page">
      <PageHeader
        label="Content"
        title="Workshops"
        description={
          canPublish
            ? "Published workshops show on the public workshops page and the dashboard. Drafts from members and the Google Form wait here until you publish them."
            : "Your workshops are saved as drafts until a President, Technology or Workshop Coordinator publishes them."
        }
        actions={
          <CreateButton label="Add workshop" onClick={openAdd} />
        }
      />

      {adding && (
        <Overlay close={() => setAdding(false)} title="Add workshop">
          <EditWorkshop submit={create} canPublish={canPublish} />
        </Overlay>
      )}
      {editing && (
        <Overlay close={() => setEditing(undefined)} title="Edit workshop">
          <EditWorkshop workshop={editing} submit={update} canPublish={canPublish} />
        </Overlay>
      )}
      <ConfirmDialog
        open={!!deleting}
        title={`Delete "${deleting?.title ?? ""}"?`}
        onConfirm={remove}
        onClose={() => setDeleting(undefined)}
      >
        It disappears from the public workshops page right away.
      </ConfirmDialog>

      <Panel title="Coming up" meta={upcoming.length}>
        {upcoming.length === 0 ? (
          <Empty title="Nothing scheduled">Add the next workshop so it shows on the site.</Empty>
        ) : (
          <ul className="px-2 pb-2">
            {upcoming.map((w, i) => (
              <li key={w.id} className="flex items-center gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-muted/50">
                <span className={`admin-date${i === 0 ? " is-next" : ""}`}>
                  <span>{part(w.datetime, { month: "short" })}</span>
                  <strong>{part(w.datetime, { day: "numeric" })}</strong>
                </span>
                <button className="min-w-0 flex-1 text-left" onClick={() => editable(w) && setEditing(w)}>
                  {i === 0 && <span className="mb-0.5 block text-xs font-medium text-[var(--a-signal)]">Next up</span>}
                  <span className="block truncate font-medium text-foreground">{w.title}</span>
                  <span className="mt-0.5 block truncate text-sm text-muted-foreground">
                    {part(w.datetime, { weekday: "long", hour: "numeric", minute: "2-digit" })} · {w.location || "Location TBA"} · {w.speaker}
                  </span>
                  {byline(w) && <span className="mt-0.5 block truncate text-xs text-muted-foreground">{byline(w)}</span>}
                </button>
                <span className="hidden sm:block">
                  {isDraft(w) ? <span className="admin-pill admin-pill--warn">Draft</span> : w.link ? <span className="admin-pill admin-pill--ok">Link posted</span> : <span className="admin-pill">No link yet</span>}
                </span>
                <Menu w={w} />
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Past" meta={past.length}>
        {past.length === 0 ? (
          <Empty title="No past workshops" />
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Workshop</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Link</th>
                  <th>Status</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {past.map((w) => (
                  <tr key={w.id}>
                    <td className="max-w-[26rem]">
                      {editable(w) ? (
                        <button className="admin-table__title text-left hover:underline" onClick={() => setEditing(w)}>
                          {w.title}
                        </button>
                      ) : (
                        <span className="admin-table__title">{w.title}</span>
                      )}
                      <p className="admin-table__sub">
                        {w.speaker}
                        {byline(w) && ` · ${byline(w)}`}
                      </p>
                    </td>
                    <td className="is-num whitespace-nowrap text-muted-foreground">
                      {part(w.datetime, { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="text-muted-foreground">{w.location || "—"}</td>
                    <td>
                      {w.link ? (
                        <a href={w.link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[var(--a-blue)] hover:underline">
                          Open
                        </a>
                      ) : (
                        <span className="text-sm text-muted-foreground">Missing</span>
                      )}
                    </td>
                    <td>
                      {isDraft(w) ? (
                        <span className="admin-pill admin-pill--warn">Draft</span>
                      ) : (
                        <span className="admin-pill admin-pill--ok">Published</span>
                      )}
                    </td>
                    <td className="w-12 text-right">
                      <Menu w={w} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
