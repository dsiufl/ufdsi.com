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
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle2 } from "lucide-react";

const DSI_BLUE = "#0021A5";
const DSI_NAVY = "#0a1628";

type Inputs = { email: string };

export function ForgotPasswordForm() {
  const supabase = createUserClient();
  const form = useForm<Inputs>();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = async ({ email }) => {
    setSubmitted(true);
    setError(null);
    const redirectTo = `${window.location.origin}/admin/login/reset-password`;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo },
    );
    setSubmitted(false);
    // Always show the same success UI — do not reveal whether the email is registered
    // (Supabase typically returns success for unknown emails too; avoid surfacing raw errors that could leak info)
    if (resetError) {
      setError(
        "We couldn’t send an email right now. Please try again in a few minutes.",
      );
      return;
    }
    setDone(true);
  };

  if (done) {
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
        <Alert className="border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950/40 dark:text-green-100">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-sm leading-relaxed">
            Check your email for a link to reset your password. It can take a few
            minutes; check your spam folder if you don’t see it.
          </AlertDescription>
        </Alert>
        <Button
          className="mt-8 w-full"
          variant="outline"
          asChild
        >
          <Link href="/admin/login">Back to sign in</Link>
        </Button>
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
          Reset your password
        </h1>
        <p className="mb-0 text-base text-muted-foreground">
          Enter the email address for your account. We&apos;ll email you a link to
          set a new password.
        </p>
      </div>

      {error ? (
        <div className="mt-6">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      ) : null}

      <form
        className="mt-8 space-y-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldGroup className="gap-5">
          <Controller
            name="email"
            control={form.control}
            defaultValue=""
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            }}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="forgot-email">Email</FieldLabel>
                <Input
                  {...field}
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
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
            disabled={submitted}
          >
            {submitted ? (
              <>
                <Spinner className="text-white" />
                Sending link…
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
        </FieldGroup>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link
          href="/admin/login"
          className="font-medium hover:underline"
          style={{ color: DSI_BLUE }}
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
