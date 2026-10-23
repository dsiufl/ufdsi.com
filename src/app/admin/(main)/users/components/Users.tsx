"use client";

import Overlay from "@/components/Overlay/Overlay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createUserClient } from "@/lib/supabase/client";
import { Profile } from "@/types/db";
import { User } from "@supabase/supabase-js";
import { Mail, MoreHorizontal, Pencil, Search, Trash2 } from "lucide-react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EditUser from "../../components/EditUser";
import { AlertContext } from "@/app/AlertProvider";
import { Empty, PageHeader, Panel } from "../../components/PageHeader";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { CreateButton } from "../../components/CreateButton";

const post = (url: string, body: unknown) =>
  fetch(url, { method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } });

export default function Users({ data }: { data: Profile[] }) {
  const [list, setList] = useState<Profile[]>(data);
  const [editing, setEditing] = useState<Profile | undefined>();
  const [deleting, setDeleting] = useState<Profile | undefined>();
  const params = useSearchParams();
  const [adding, setAdding] = useState(params.get("new") === "1");
  const openAdd = useCallback(() => setAdding(true), []);
  const [token, setToken] = useState<string>();
  const [me, setMe] = useState<User>();
  const [query, setQuery] = useState("");
  const supabase = createUserClient();
  const router = useRouter();
  const alert = useContext(AlertContext);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setToken(data.session.access_token);
        setMe(data.session.user);
      }
    });
  }, []);

  useEffect(() => setList(data), [data]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...list].sort((a, b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`));
    if (!q) return sorted;
    return sorted.filter((u) => [u.first_name, u.last_name, u.email, u.role].join(" ").toLowerCase().includes(q));
  }, [list, query]);

  const pending = list.filter((u) => !u.account_setup).length;

  // set-up accounts get a password reset link, everyone else a fresh invite
  const invite = async (user: Profile) => {
    const reset = !!user.account_setup;
    const res = await post("/api/users/email", { access_token: token, user, type: reset ? "reset" : "invite" });
    const what = reset ? "Password reset link" : "Invite";
    alert?.setAlert(res.ok ? "info" : "error", res.ok ? `${what} sent to ${user.email}.` : `Couldn't send the ${what.toLowerCase()}.`);
  };

  const remove = async () => {
    if (!deleting) return;
    const res = await post("/api/users/delete", { access_token: token, user_id: deleting.id });
    if (!res.ok) return alert?.setAlert("error", "Couldn't delete the user.");
    setList((l) => l.filter((u) => u.id !== deleting.id));
    setDeleting(undefined);
  };

  return (
    <div className="admin-page">
      <PageHeader
        label="Team"
        title="Users"
        description="Board members who can sign in to the admin. Their role decides which sections they see."
        actions={
          <CreateButton label="Add user" onClick={openAdd} />
        }
      />

      {adding && (
        <Overlay close={() => setAdding(false)} title="Add user">
          <EditUser
            admin
            data={{} as Profile}
            onSubmit={async (d: Profile) => {
              const res = await post("/api/users/create", { access_token: token, user: d });
              if (res.status === 502) alert?.setAlert("error", `Added ${d.email}, but the invite email didn't send. Try "Send invite email" from their row.`);
              else if (!res.ok) return alert?.setAlert("error", "Couldn't create the user.");
              else alert?.setAlert("info", `Invite sent to ${d.email}.`);
              setAdding(false);
              router.refresh();
            }}
          />
        </Overlay>
      )}
      {editing && (
        <Overlay close={() => setEditing(undefined)} title={`Edit ${editing.first_name} ${editing.last_name}`}>
          <EditUser
            admin
            data={editing}
            onSubmit={async (d: Profile) => {
              const res = await post("/api/users/edit", { access_token: token, user: { ...d, id: editing.id } });
              if (!res.ok) return alert?.setAlert("error", "Couldn't save the user.");
              setList((l) => l.map((u) => (u.id === editing.id ? { ...u, ...d } : u)));
              setEditing(undefined);
            }}
          />
        </Overlay>
      )}
      <ConfirmDialog
        open={!!deleting}
        title={`Delete ${deleting?.first_name ?? ""} ${deleting?.last_name ?? ""}?`}
        onConfirm={remove}
        onClose={() => setDeleting(undefined)}
      >
        They lose access to the admin right away. This can&apos;t be undone.
      </ConfirmDialog>

      <Panel
        title="Everyone"
        meta={pending ? `${list.length} · ${pending} not set up yet` : list.length}
        actions={
          <div className="relative w-full sm:w-60">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by name or role" value={query} onChange={(e) => setQuery(e.target.value)} className="h-9 bg-background pl-9" />
          </div>
        }
      >
        {shown.length === 0 ? (
          <Empty title="No one matches">Try a different search.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Account</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {shown.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="is-round flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                          {`${u.first_name?.[0] ?? ""}${u.last_name?.[0] ?? ""}`.toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="admin-table__title truncate">
                            {u.first_name} {u.last_name}
                            {u.id === me?.id && <span className="ml-2 text-xs font-normal text-muted-foreground">You</span>}
                          </p>
                          <p className="admin-table__sub truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap text-muted-foreground">{u.role}</td>
                    <td>
                      {u.account_setup ? (
                        <span className="admin-pill admin-pill--ok">Active</span>
                      ) : (
                        <span className="admin-pill admin-pill--warn">Invite pending</span>
                      )}
                    </td>
                    <td className="w-12 text-right">
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="admin-row-actions h-8 w-8 text-muted-foreground" aria-label={`Options for ${u.first_name}`}>
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditing(u)}>
                            <Pencil className="mr-2 size-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => invite(u)}>
                            <Mail className="mr-2 size-4" /> {u.account_setup ? "Send password reset" : "Send invite email"}
                          </DropdownMenuItem>
                          {u.id !== me?.id && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleting(u)}>
                                <Trash2 className="mr-2 size-4" /> Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
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
