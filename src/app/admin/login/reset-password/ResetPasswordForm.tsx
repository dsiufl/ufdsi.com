"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { createUserClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthCard, Notice, authLink } from "../components/AuthCard";
import { PasswordFields, usePasswordForm } from "../components/PasswordFields";

/**
 * Gets a session from whatever the reset email gave us (a session from /admin/login/link,
 * ?token_hash=, ?code=, or the old #access_token hash), then asks for a new password.
 */
async function startSession() {
  const supabase = createUserClient();
  const url = new URL(window.location.href);
  const hash = new URLSearchParams(url.hash.slice(1));
  const clean = () => window.history.replaceState(null, "", "/admin/login/reset-password");

  if (hash.get("error_description")) {
    clean();
    throw new Error(hash.get("error_code") === "otp_expired" ? "expired" : hash.get("error_description")!);
  }
  const tokenHash = url.searchParams.get("token_hash");
  const code = url.searchParams.get("code");
  const access_token = hash.get("access_token");
  const refresh_token = hash.get("refresh_token");

  if (tokenHash) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "recovery" });
    clean();
    if (error) throw new Error("expired");
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    clean();
    // PKCE codes only work in the browser that asked for the email
    if (error) throw new Error("other-device");
  } else if (access_token && refresh_token) {
    const { error } = await supabase.auth.setSession({ access_token, refresh_token });
    clean();
    if (error) throw new Error("expired");
  }
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("missing");
  return data.user.email ?? null;
}

const PROBLEMS: Record<string, string> = {
  expired: "This reset link has expired or was already used. Links work once and last an hour.",
  "other-device": "This link was opened in a different browser than the one that asked for it. Request a new link and open it here.",
  missing: "Open the link from your reset email to choose a new password.",
};

export function ResetPasswordForm() {
  const router = useRouter();
  const form = usePasswordForm();
  const [phase, setPhase] = useState<"loading" | "ready" | "error" | "done">("loading");
  const [email, setEmail] = useState<string | null>(null);
  const [problem, setProblem] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    startSession()
      .then((e) => {
        setEmail(e);
        setPhase("ready");
      })
      .catch((e: Error) => {
        setProblem(PROBLEMS[e.message] ?? e.message);
        setPhase("error");
      });
  }, []);

  const save = form.handleSubmit(async ({ password }) => {
    setFormError(null);
    const { error } = await createUserClient().auth.updateUser({ password });
    if (error) {
      return setFormError(error.code === "same_password" ? "That's your current password. Pick a new one." : error.message);
    }
    setPhase("done");
  });

  if (phase === "loading") {
    return (
      <AuthCard step="Password reset" title="Checking your link…">
        <Spinner className="size-6 text-muted-foreground" />
      </AuthCard>
    );
  }

  if (phase === "error") {
    return (
      <AuthCard step="Password reset" title="This link didn't work" footer={<Link href="/admin/login" className={authLink}>Back to sign in</Link>}>
        <div className="flex flex-col gap-6">
          <Notice tone="error">{problem}</Notice>
          <Button asChild className="h-10 w-full">
            <Link href="/admin/login/forgot-password">Send a new reset link</Link>
          </Button>
        </div>
      </AuthCard>
    );
  }

  if (phase === "done") {
    return (
      <AuthCard step="Password reset" title="Password updated" description="You're signed in. Use the new password next time.">
        <Button className="h-10 w-full" onClick={() => router.replace("/admin/dashboard")}>
          Go to the dashboard
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      step="Password reset"
      title="Choose a new password"
      description={email ? <>For <span className="font-medium text-foreground">{email}</span>.</> : undefined}
      footer={<Link href="/admin/login" className={authLink}>Cancel</Link>}
    >
      {formError && <div className="mb-6"><Notice tone="error">{formError}</Notice></div>}
      <form className="flex flex-col gap-5" onSubmit={save} noValidate>
        <PasswordFields form={form} email={email} />
        <Button type="submit" className="h-10 w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <><Spinner /> Saving…</> : "Save password"}
        </Button>
      </form>
    </AuthCard>
  );
}
