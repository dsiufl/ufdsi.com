"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { createUserClient } from "@/lib/supabase/client";
import { AdminInfo } from "@/types/db";
import { AlertContext } from "@/app/AlertProvider";
import { useContext, useState } from "react";
import { PageHeader, Panel } from "../components/PageHeader";

export default function Settings({ data }: { data: AdminInfo }) {
  const supabase = createUserClient();
  const alert = useContext(AlertContext);
  const [first, setFirst] = useState(data.first_name ?? "");
  const [last, setLast] = useState(data.last_name ?? "");
  const [picture, setPicture] = useState(data.pictureURL ?? "");
  const [file, setFile] = useState<File>();
  const [saving, setSaving] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const dirty = first !== (data.first_name ?? "") || last !== (data.last_name ?? "") || !!file;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    let pictureURL = data.pictureURL;
    if (file) {
      const path = `team/${data.id}.jpg`;
      const { error } = await supabase.storage.from("images").upload(path, file, { upsert: true, contentType: file.type });
      if (error) {
        alert?.setAlert("error", `Couldn't upload the photo: ${error.message}`);
        setSaving(false);
        return;
      }
      pictureURL = `${supabase.storage.from("images").getPublicUrl(path).data.publicUrl}?v=${Date.now()}`;
    }
    // Role, email and publish are blocked by the column grant on admin.people.
    const { error } = await supabase
      .schema("admin")
      .from("people")
      .update({ first_name: first, last_name: last, pictureURL })
      .eq("id", data.id);
    setSaving(false);
    if (error) return alert?.setAlert("error", `Couldn't save: ${error.message}`);
    setFile(undefined);
    setPicture(pictureURL);
    alert?.setAlert("info", "Profile saved.");
  };

  const initials = `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();

  return (
    <div className="admin-page max-w-3xl">
      <PageHeader label="Account" title="Settings" description="Your name and photo show on the team page." />

      <Panel title="Profile">
        <form onSubmit={save} className="flex flex-col gap-6 px-5 pb-5">
          <div className="flex items-center gap-5">
            <div className="is-round relative size-20 shrink-0 overflow-hidden rounded-full bg-muted">
              {picture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={picture} alt="" className="size-full object-cover" />
              ) : (
                <span className="flex size-full items-center justify-center text-xl font-semibold text-muted-foreground">{initials}</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="photo" className="w-fit cursor-pointer rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent">
                Upload new photo
              </Label>
              <input
                id="photo"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setFile(f);
                  setPicture(URL.createObjectURL(f));
                }}
              />
              <p className="text-xs text-muted-foreground">A square headshot works best.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="first">First name</Label>
              <Input id="first" value={first} onChange={(e) => setFirst(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="last">Last name</Label>
              <Input id="last" value={last} onChange={(e) => setLast(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={data.email ?? ""} disabled />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" value={data.role ?? ""} disabled />
            </div>
          </div>
          <p className="-mt-3 text-xs text-muted-foreground">Email or role wrong? Ask a Technology Coordinator to change it.</p>

          <div className="flex justify-end">
            <Button type="submit" disabled={!dirty || saving}>
              {saving ? <Spinner /> : "Save changes"}
            </Button>
          </div>
        </form>
      </Panel>

      <Panel
        title="Password"
        actions={
          <Button variant="outline" onClick={() => setPwOpen(true)}>
            Change password
          </Button>
        }
      >
        <p className="px-5 pb-5 text-sm text-muted-foreground">
          You&apos;ll need your current password. Forgot it? Sign out and use the reset link on the login page.
        </p>
      </Panel>

      <PasswordDialog open={pwOpen} email={data.email} onClose={() => setPwOpen(false)} />
    </div>
  );
}

function PasswordDialog({ open, email, onClose }: { open: boolean; email: string; onClose: () => void }) {
  const supabase = createUserClient();
  const alert = useContext(AlertContext);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  const close = () => {
    setCurrent("");
    setNext("");
    setConfirm("");
    setError(undefined);
    onClose();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirm) return setError("The new passwords don't match.");
    if (next.length < 8) return setError("Use at least 8 characters.");
    setBusy(true);
    setError(undefined);
    const check = await supabase.auth.signInWithPassword({ email, password: current });
    if (check.error) {
      setBusy(false);
      return setError("Your current password is wrong.");
    }
    const { error } = await supabase.auth.updateUser({ password: next });
    setBusy(false);
    if (error) return setError(error.message);
    alert?.setAlert("info", "Password changed.");
    close();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && !busy && close()}>
      <DialogContent className="max-w-sm">
        <form onSubmit={submit} className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
            <DialogDescription>At least 8 characters.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="pw-current">Current password</Label>
            <Input id="pw-current" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="pw-new">New password</Label>
            <Input id="pw-new" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="pw-confirm">Confirm new password</Label>
            <Input id="pw-confirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={busy}>
              {busy ? <Spinner /> : "Change password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
