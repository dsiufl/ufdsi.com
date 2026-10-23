"use client";

import { useCallback, useContext, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Overlay from "@/components/Overlay/Overlay";
import { createUserClient } from "@/lib/supabase/client";
import { Project } from "@/types/db";
import EditProject from "./EditProject";
import { AlertContext } from "@/app/AlertProvider";
import Image from "next/image";
import { Empty, PageHeader } from "../../components/PageHeader";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { CreateButton } from "../../components/CreateButton";

export default function Editor({ projects }: { projects: Project[] }) {
  const [list, setList] = useState<Project[]>(projects);
  const params = useSearchParams();
  const [adding, setAdding] = useState(params.get("new") === "1");
  const openAdd = useCallback(() => setAdding(true), []);
  const [editing, setEditing] = useState<Project | undefined>();
  const [deleting, setDeleting] = useState<Project | undefined>();
  const supabase = createUserClient();
  const alert = useContext(AlertContext);

  const uploadCover = async (data: Project) => {
    if (!data.cover?.includes("blob")) return true;
    const path = `projects/${data.title.replace(/\s+/g, "_").toLowerCase()}.jpg`;
    const blob = await fetch(data.cover).then((r) => r.blob());
    const { error } = await supabase.storage.from("images").upload(path, blob, { upsert: true, contentType: blob.type });
    if (error) {
      alert?.setAlert("error", `Couldn't upload the cover: ${error.message}`);
      return false;
    }
    data.cover = supabase.storage.from("images").getPublicUrl(path).data.publicUrl;
    return true;
  };

  const create = async (data: Project) => {
    if (!(await uploadCover(data))) return;
    const { data: row, error } = await supabase.from("projects").insert(data).select().single();
    if (error) return alert?.setAlert("error", `Couldn't add the project: ${error.message}`);
    setList((l) => [...l, row ?? data]);
    setAdding(false);
  };

  const update = async (data: Project) => {
    if (!(await uploadCover(data))) return;
    const { error } = await supabase.from("projects").update(data).eq("id", data.id);
    if (error) return alert?.setAlert("error", `Couldn't save the project: ${error.message}`);
    setList((l) => l.map((p) => (p.id === data.id ? data : p)));
    setEditing(undefined);
  };

  const remove = async () => {
    if (!deleting) return;
    const { error } = await supabase.from("projects").delete().eq("id", deleting.id);
    if (error) return alert?.setAlert("error", `Couldn't delete the project: ${error.message}`);
    setList((l) => l.filter((p) => p.id !== deleting.id));
    setDeleting(undefined);
  };

  return (
    <div className="admin-page">
      <PageHeader
        label="Content"
        title="Projects"
        description="Member projects shown on the public projects page."
        actions={
          <CreateButton label="Add project" onClick={openAdd} />
        }
      />

      {adding && (
        <Overlay close={() => setAdding(false)} title="Add project">
          <EditProject submit={create} />
        </Overlay>
      )}
      {editing && (
        <Overlay close={() => setEditing(undefined)} title="Edit project">
          <EditProject project={editing} submit={update} />
        </Overlay>
      )}
      <ConfirmDialog
        open={!!deleting}
        title={`Delete "${deleting?.title ?? ""}"?`}
        onConfirm={remove}
        onClose={() => setDeleting(undefined)}
      >
        It disappears from the public projects page right away.
      </ConfirmDialog>

      {list.length === 0 ? (
        <div className="admin-panel">
          <Empty title="No projects yet">Add one to show it on the site.</Empty>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.filter(Boolean).map((p) => (
            <li key={p.id} className="admin-panel group flex flex-col">
              <button onClick={() => setEditing(p)} className="relative block aspect-[16/10] w-full bg-muted text-left">
                {p.cover ? (
                  <Image src={p.cover} alt="" fill sizes="(max-width: 768px) 100vw, 380px" className="object-cover" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">No cover</span>
                )}
              </button>
              <div className="flex items-start gap-2 p-4">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold">{p.title}</h3>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">Led by {p.lead || "—"}</p>
                </div>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="admin-row-actions -mr-1 h-8 w-8 text-muted-foreground" aria-label={`Options for ${p.title}`}>
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditing(p)}>
                      <Pencil className="mr-2 size-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleting(p)}>
                      <Trash2 className="mr-2 size-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
