"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import Image from "next/image";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { createUserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

const DSI_BLUE = "#0021A5";
const DSI_NAVY = "#0a1628";

type Inputs = {
  password: string;
  confirm: string;
};

export function ResetPasswordForm() {
  const supabase = createUserClient();
  const router = useRouter();
  const form = useForm<Inputs>();
  const [phase, setPhase] = useState<"loading" | "ready" | "error">("loading");
  const [initError, setInitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        if (code) {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
          window.history.replaceState(null, "", "/admin/login/reset-password");
          setPhase("ready");
          return;
        }

        const hash = window.location.hash.substring(1);
        if (!hash) {
          setInitError(
            "This link is missing or has expired. Please request a new password reset.",
          );
          setPhase("error");
          return;
        }

        const params = new URLSearchParams(hash);
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");
        const type = params.get("type");

        if (
          type !== "recovery" ||
          !access_token ||
          !refresh_token
        ) {
          setInitError(
            "This reset link is invalid or has expired. Please request a new one.",
          );
          setPhase("error");
          return;
        }

        const { error: sessionError } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
        if (sessionError) throw sessionError;

        window.history.replaceState(null, "", "/admin/login/reset-password");
        setPhase("ready");
      } catch (e: unknown) {
        setInitError(
          e instanceof Error
            ? e.message
            : "Could not verify your reset link. Try again.",
        );
        setPhase("error");
      }
    };

    void init();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount for URL tokens
  }, []);

  const onSubmit: SubmitHandler<Inputs> = async ({ password }) => {
    setSubmitting(true);
    setFormError(null);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) {
      setFormError(error.message);
      return;
    }
    router.push("/admin/login?reset=success");
  };

  if (phase === "loading") {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 py-16">
        <Image
          src="/images/logo/hd-transparent-dsi-logo.png"
          alt=""
          width={140}
          height={56}
          className="h-auto w-[140px] object-contain opacity-90"
          priority
        />
        <Spinner className="size-8" style={{ color: DSI_BLUE }} />
        <p className="text-center text-sm text-muted-foreground">
          Verifying your reset link…
        </p>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="mx-auto w-full max-w-md">
        <div className="mb-10">
          <Image
            src="/images/logo/hd-transparent-dsi-logo.png"
            alt="UF Data Science Initiative"
            width={140}
            height={56}
            className="h-auto w-[140px] object-contain"
            priority
          />
        </div>
        <Alert variant="destructive">
          <AlertDescription>{initError}</AlertDescription>
        </Alert>
        <Button className="mt-8 w-full" variant="outline" asChild>
          <Link href="/admin/login/forgot-password">Request a new link</Link>
        </Button>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link
            href="/admin/login"
            className="font-medium hover:underline"
            style={{ color: DSI_BLUE }}
          >
            Back to sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-10">
        <Image
          src="/images/logo/hd-transparent-dsi-logo.png"
          alt="UF Data Science Initiative"
          width={140}
          height={56}
          className="h-auto w-[140px] object-contain"
          priority
        />
      </div>

      <div className="space-y-2">
        <h1
          className="mb-0 text-3xl font-bold tracking-tight sm:text-[2rem]"
          style={{ color: DSI_NAVY }}
        >
          Choose a new password
        </h1>
        <p className="mb-0 text-base text-muted-foreground">
          Use at least 8 characters. After saving, sign in with your new password.
        </p>
      </div>

      {formError ? (
        <div className="mt-6">
          <Alert variant="destructive">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        </div>
      ) : null}

      <form
        className="mt-8 space-y-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldGroup className="gap-5">
          <Controller
            name="password"
            control={form.control}
            defaultValue=""
            rules={{
              required: "Password is required",
              minLength: { value: 8, message: "Use at least 8 characters" },
            }}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="reset-password">New password</FieldLabel>
                <Input
                  {...field}
                  id="reset-password"
                  type="password"
                  autoComplete="new-password"
                  className="h-11 border-border/80 bg-background"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />
          <Controller
            name="confirm"
            control={form.control}
            defaultValue=""
            rules={{
              required: "Confirm your password",
              validate: (value) =>
                value === form.getValues("password") ||
                "Passwords do not match",
            }}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="reset-confirm">Confirm password</FieldLabel>
                <Input
                  {...field}
                  id="reset-confirm"
                  type="password"
                  autoComplete="new-password"
                  className="h-11 border-border/80 bg-background"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />
          <Button
            type="submit"
            size="lg"
            className="h-11 w-full border-0 font-semibold text-white shadow-md hover:bg-[#001a8c]"
            style={{ backgroundColor: DSI_BLUE }}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Spinner className="text-white" />
                Updating password…
              </>
            ) : (
              "Save new password"
            )}
          </Button>
        </FieldGroup>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        <Link
          href="/admin/login"
          className="font-medium hover:underline"
          style={{ color: DSI_BLUE }}
        >
          Cancel and return to sign in
        </Link>
      </p>
    </div>
  );
}
