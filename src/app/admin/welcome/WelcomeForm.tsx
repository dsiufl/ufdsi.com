"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { createUserClient } from "@/lib/supabase/client";
import { ImageUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthCard, Notice } from "../login/components/AuthCard";
import { PasswordFields } from "../login/components/PasswordFields";

type Inputs = { first_name: string; last_name: string; password: string; confirm: string };

export function WelcomeForm({
  id,
  email,
  role,
  defaults,
}: {
  id: string;
  email: string;
  role?: string | null;
  defaults: { first_name: string; last_name: string; pictureURL: string };
}) {
  const router = useRouter();
  const form = useForm<Inputs>({ defaultValues: { ...defaults, password: "", confirm: "" }, mode: "onTouched" });
  const [photo, setPhoto] = useState<{ file?: File; url: string }>({ url: defaults.pictureURL });
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { errors, isSubmitting } = form.formState;

  const submit = form.handleSubmit(async ({ first_name, last_name, password }) => {
    setError(null);
    const supabase = createUserClient();

    const { error: pwError } = await supabase.auth.updateUser({ password });
    if (pwError && pwError.code !== "same_password") return setError(pwError.message);

    let pictureURL = defaults.pictureURL;
    if (photo.file) {
      const path = `team/${id}.jpg`;
      const { error: upError } = await supabase.storage.from("images").upload(path, photo.file, { upsert: true, contentType: photo.file.type });
      if (upError) return setError(`Your password is saved, but the photo didn't upload (${upError.message}). Try a smaller image, or skip it for now.`);
      pictureURL = `${supabase.storage.from("images").getPublicUrl(path).data.publicUrl}?v=${Date.now()}`;
    }

    const { data } = await supabase.auth.getSession();
    const res = await fetch("/api/auth/firsttimesetup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: data.session?.access_token, data: { first_name: first_name.trim(), last_name: last_name.trim(), pictureURL } }),
    }).catch(() => null);
    if (!res?.ok) return setError("Your password is saved, but we couldn't finish setting up your profile. Try again.");

    router.replace("/admin/dashboard");
    router.refresh();
  });

  return (
    <AuthCard
      step="Account setup"
      title={defaults.first_name ? `Welcome, ${defaults.first_name}` : "Welcome to DSI admin"}
      description={<>Signed in as <span className="font-medium text-foreground">{email}</span>{role ? <> · {role}</> : null}. Check your details and choose a password.</>}
    >
      {error && <div className="mb-6"><Notice tone="error">{error}</Notice></div>}
      <form className="flex flex-col gap-5" onSubmit={submit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors.first_name}>
            <FieldLabel htmlFor="first-name">First name</FieldLabel>
            <Input id="first-name" autoComplete="given-name" className="h-10" aria-invalid={!!errors.first_name} {...form.register("first_name", { required: "Required", validate: (v) => !!v.trim() || "Required" })} />
            {errors.first_name && <FieldError errors={[errors.first_name]} />}
          </Field>
          <Field data-invalid={!!errors.last_name}>
            <FieldLabel htmlFor="last-name">Last name</FieldLabel>
            <Input id="last-name" autoComplete="family-name" className="h-10" aria-invalid={!!errors.last_name} {...form.register("last_name", { required: "Required", validate: (v) => !!v.trim() || "Required" })} />
            {errors.last_name && <FieldError errors={[errors.last_name]} />}
          </Field>
        </div>

        <Field>
          <FieldLabel>Photo <span className="font-normal text-muted-foreground">(optional)</span></FieldLabel>
          <div className="flex items-center gap-4">
            <div className="admin-avatar size-14 shrink-0 overflow-hidden border bg-muted">
              {photo.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo.url} alt="" className="size-full object-cover" />
              ) : (
                <span className="flex size-full items-center justify-center text-sm font-medium text-muted-foreground">
                  {(form.watch("first_name")[0] ?? "") + (form.watch("last_name")[0] ?? "")}
                </span>
              )}
            </div>
            <div className="flex flex-col items-start gap-1">
              <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                <ImageUp /> {photo.url ? "Change photo" : "Upload photo"}
              </Button>
              <span className="text-xs text-muted-foreground">A square headshot works best. Used on the team page.</span>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setPhoto({ file, url: URL.createObjectURL(file) });
              }}
            />
          </div>
        </Field>

        <div className="border-t pt-5">
          <div className="flex flex-col gap-5">
            <PasswordFields form={form} email={email} />
          </div>
        </div>

        <Button type="submit" className="h-10 w-full" disabled={isSubmitting}>
          {isSubmitting ? <><Spinner /> Setting up…</> : "Finish setup"}
        </Button>
      </form>
    </AuthCard>
  );
}

export function SignOutButton() {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      className="h-10 w-full"
      onClick={async () => {
        await createUserClient().auth.signOut();
        router.replace("/admin/login");
      }}
    >
      Sign out
    </Button>
  );
}
