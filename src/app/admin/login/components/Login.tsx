"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { createUserClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthCard, Notice, authLink } from "./AuthCard";

type Inputs = { email: string; password: string };

export default function Login() {
  const router = useRouter();
  const form = useForm<Inputs>({ defaultValues: { email: "", password: "" } });
  const [error, setError] = useState<string | null>(null);
  const [linking, setLinking] = useState(false);
  const { errors, isSubmitting } = form.formState;

  // Older invite emails land here with the session in the URL hash.
  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    if (![...hash.keys()].length) return;
    window.history.replaceState(null, "", "/admin/login");
    if (hash.get("error_description")) {
      setError(
        hash.get("error_code") === "otp_expired"
          ? "That link has expired or was already used. Ask for a new invite, or reset your password below."
          : hash.get("error_description"),
      );
      return;
    }
    const access_token = hash.get("access_token");
    const refresh_token = hash.get("refresh_token");
    if (!access_token || !refresh_token) return;
    setLinking(true);
    createUserClient()
      .auth.setSession({ access_token, refresh_token })
      .then(({ error }) => {
        if (error) {
          setLinking(false);
          setError("That link has expired or was already used. Ask for a new invite, or reset your password below.");
        } else {
          router.replace(hash.get("type") === "recovery" ? "/admin/login/reset-password" : "/admin/welcome");
        }
      });
  }, [router]);

  const signIn = form.handleSubmit(async ({ email, password }) => {
    setError(null);
    const { error } = await createUserClient().auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      if (error.code === "invalid_credentials") return setError("That email and password don't match. Check for typos, or reset your password.");
      if (error.status === 429) return setError("Too many attempts. Wait a minute and try again.");
      return setError(error.message);
    }
    router.replace("/admin/dashboard");
    router.refresh();
  });

  if (linking) {
    return (
      <AuthCard step="Signing in" title="Checking your link…">
        <Spinner className="size-6 text-muted-foreground" />
      </AuthCard>
    );
  }

  return (
    <AuthCard
      step="DSI admin"
      title="Sign in"
      description="For board members running workshops, news, projects and the symposium."
      footer={<>New to the board? Your account is created by the President or a Technology Coordinator, and you&apos;ll get an email invite to set it up.</>}
    >
      {error && <div className="mb-6"><Notice tone="error">{error}</Notice></div>}
      <form className="flex flex-col gap-5" onSubmit={signIn} noValidate>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="login-email">Email</FieldLabel>
          <Input
            id="login-email"
            type="email"
            autoComplete="username"
            autoFocus
            placeholder="name@ufl.edu"
            className="h-10"
            aria-invalid={!!errors.email}
            {...form.register("email", {
              required: "Enter your email",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "That doesn't look like an email address" },
            })}
          />
          {errors.email && <FieldError errors={[errors.email]} />}
        </Field>
        <Field data-invalid={!!errors.password}>
          <div className="flex items-baseline justify-between">
            <FieldLabel htmlFor="login-password">Password</FieldLabel>
            <Link href="/admin/login/forgot-password" className={`text-sm ${authLink}`}>
              Forgot password?
            </Link>
          </div>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            className="h-10"
            aria-invalid={!!errors.password}
            {...form.register("password", { required: "Enter your password" })}
          />
          {errors.password && <FieldError errors={[errors.password]} />}
        </Field>
        <Button type="submit" className="h-10 w-full" disabled={isSubmitting}>
          {isSubmitting ? <><Spinner /> Signing in…</> : "Sign in"}
        </Button>
      </form>
    </AuthCard>
  );
}
