"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { createUserClient } from "@/lib/supabase/client";
import { AuthCard, Notice, authLink } from "../components/AuthCard";

// Email scanners (e.g. Microsoft Safe Links) open emailed URLs, which used to burn the
// single-use token before the person clicked. So we only verify on a real button press.
export default function VerifyButton({ token, type }: { token: string; type: "magiclink" | "recovery" }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "loading" | "expired">("idle");
  const reset = type === "recovery";

  const verify = async () => {
    setState("loading");
    const supabase = createUserClient();
    await supabase.auth.signOut({ scope: "local" });
    const { error } = await supabase.auth.verifyOtp({ token_hash: token, type: reset ? "recovery" : "email" });
    if (error) return setState("expired");
    router.replace(reset ? "/admin/login/reset-password" : "/admin/welcome");
  };

  if (state === "expired") {
    return (
      <AuthCard
        step={reset ? "Password reset" : "Invite"}
        title="This link has expired"
        description="Links work once and expire after an hour. Get a fresh one below."
        footer={<Link href="/admin/login" className={authLink}>Back to sign in</Link>}
      >
        {reset ? (
          <Button asChild className="h-10 w-full">
            <Link href="/admin/login/forgot-password">Send a new reset link</Link>
          </Button>
        ) : (
          <Notice>Ask the President or a Technology Coordinator to resend your invite from the Users page.</Notice>
        )}
      </AuthCard>
    );
  }

  return (
    <AuthCard
      step={reset ? "Password reset" : "Invite"}
      title={reset ? "Reset your password" : "Welcome to DSI admin"}
      description={
        reset
          ? "Continue to choose a new password for your account."
          : "You've been added to the UF DSI admin. Continue to set your name, photo and password. It takes about a minute."
      }
      footer={<>This link works once. If it doesn&apos;t, <Link href="/admin/login/forgot-password" className={authLink}>request a new one</Link>.</>}
    >
      <Button onClick={verify} disabled={state === "loading"} className="h-10 w-full">
        {state === "loading" ? <><Spinner /> Checking link…</> : reset ? "Choose a new password" : "Set up my account"}
      </Button>
    </AuthCard>
  );
}
