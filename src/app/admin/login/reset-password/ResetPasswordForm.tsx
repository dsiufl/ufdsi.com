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
import { useSignIn } from "@clerk/nextjs/legacy";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

const DSI_BLUE = "#0021A5";
const DSI_NAVY = "#0a1628";

type Inputs = {
  email: string;
  code: string;
  password: string;
  confirm: string;
};

export function ResetPasswordForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const form = useForm<Inputs>();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<Inputs> = async ({ email, code, password }) => {
    if (!isLoaded) return;
    setSubmitting(true);
    setFormError(null);
    try {
      // Resume the in-progress reset attempt if one exists on this signIn
      // resource (started from the forgot-password step); otherwise start one
      // now so this page also works as a standalone entry point.
      if (signIn.status !== "needs_first_factor") {
        await signIn.create({
          strategy: "reset_password_email_code",
          identifier: email.trim(),
        });
        setFormError(
          "We just sent you a new code — enter it below along with your new password.",
        );
        setSubmitting(false);
        return;
      }

      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: code.trim(),
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/admin/login?reset=success");
        return;
      }

      setFormError("That code didn't work. Please check it and try again.");
    } catch (e: unknown) {
      setFormError(
        e instanceof Error
          ? e.message
          : "Could not reset your password. Try requesting a new code.",
      );
    } finally {
      setSubmitting(false);
    }
  };

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
          Enter the code we emailed you along with a new password. Didn&apos;t
          request a code yet? Enter your email below and we&apos;ll send one.
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
            name="email"
            control={form.control}
            defaultValue=""
            rules={{ required: "Email is required" }}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="reset-email">Email</FieldLabel>
                <Input
                  {...field}
                  id="reset-email"
                  type="email"
                  autoComplete="email"
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
            name="code"
            control={form.control}
            defaultValue=""
            rules={{ required: "Enter the code from your email" }}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="reset-code">Reset code</FieldLabel>
                <Input
                  {...field}
                  id="reset-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
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
                <FieldLabel htmlFor="reset-confirm">
                  Confirm password
                </FieldLabel>
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
            disabled={submitting || !isLoaded}
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
