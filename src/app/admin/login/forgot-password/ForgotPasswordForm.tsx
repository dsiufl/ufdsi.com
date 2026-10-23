"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { AuthCard, Notice, authLink } from "../components/AuthCard";

type Inputs = { email: string };
const WAIT = 60;

export function ForgotPasswordForm() {
  const form = useForm<Inputs>({ defaultValues: { email: "" } });
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!cooldown) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const send: SubmitHandler<Inputs> = async ({ email }) => {
    setError(null);
    setBusy(true);
    const res = await fetch("/api/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    }).catch(() => null);
    setBusy(false);
    if (!res?.ok) {
      return setError(res?.status === 429 ? "Too many requests. Wait a minute and try again." : "We couldn't send the email right now. Try again in a minute.");
    }
    setSentTo(email.trim());
    setCooldown(WAIT);
  };

  if (sentTo) {
    return (
      <AuthCard
        step="Password reset"
        title="Check your email"
        description={<>If <span className="font-medium text-foreground">{sentTo}</span> has an admin account, a reset link is on its way. It expires in an hour.</>}
        footer={<Link href="/admin/login" className={authLink}>Back to sign in</Link>}
      >
        <ul className="mb-6 list-none space-y-2 p-0 text-sm text-muted-foreground">
          <li>Not there after a few minutes? Check spam or junk.</li>
          <li>Use the newest email if you asked more than once. Older links stop working.</li>
        </ul>
        {error && <div className="mb-4"><Notice tone="error">{error}</Notice></div>}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" disabled={cooldown > 0 || busy} onClick={() => send({ email: sentTo })}>
            {busy ? <Spinner /> : null}
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend email"}
          </Button>
          <Button variant="ghost" onClick={() => { setSentTo(null); setError(null); }}>
            Use a different email
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      step="Password reset"
      title="Forgot your password?"
      description="Enter the email you use for the admin and we'll send you a link to choose a new one."
      footer={<>Remembered it? <Link href="/admin/login" className={authLink}>Sign in</Link></>}
    >
      {error && <div className="mb-6"><Notice tone="error">{error}</Notice></div>}
      <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(send)} noValidate>
        <Field data-invalid={!!form.formState.errors.email}>
          <FieldLabel htmlFor="forgot-email">Email</FieldLabel>
          <Input
            id="forgot-email"
            type="email"
            autoComplete="email"
            autoFocus
            placeholder="name@ufl.edu"
            className="h-10"
            aria-invalid={!!form.formState.errors.email}
            {...form.register("email", {
              required: "Enter your email",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "That doesn't look like an email address" },
            })}
          />
          {form.formState.errors.email && <FieldError errors={[form.formState.errors.email]} />}
        </Field>
        <Button type="submit" className="h-10 w-full" disabled={busy}>
          {busy ? <><Spinner /> Sending…</> : "Send reset link"}
        </Button>
      </form>
    </AuthCard>
  );
}
