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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { createUserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const DSI_BLUE = "#0021A5";
const DSI_NAVY = "#0a1628";

type Inputs = {
  email: string;
  password: string;
  remember: boolean;
};

export default function Login() {
  const router = useRouter();
  const supabase = createUserClient();
  const form = useForm<Inputs>({
    defaultValues: { remember: true },
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkSent, setLinkSent] = useState(false);
  const [passwordResetOk, setPasswordResetOk] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setSubmitted(true);
    const { remember, ...creds } = data;
    void remember;
    supabase.auth.signInWithPassword(creds).then((result) => {
      if (result.error) {
        form.setError("password", {
          type: "manual",
          message: "Invalid email or password",
        });
        setSubmitted(false);
      } else {
        router.push("/admin/dashboard");
      }
    });
  };

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (!hash) return;
    const params = new URLSearchParams(hash);
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");
    setLinkSent(true);
    fetch("/api/auth/confirm", {
      method: "POST",
      body: JSON.stringify({ access_token }),
      headers: { "Content-Type": "application/json" },
    }).then(async (res) => {
      if (res.status === 200) {
        supabase.auth
          .setSession({ access_token, refresh_token })
          .then(() => {
            router.push("/admin/dashboard");
          });
      } else if (res.status === 202) {
        supabase.auth
          .setSession({ access_token, refresh_token })
          .then(() => {
            router.push("/admin/setup/password");
          });
      } else {
        setLinkSent(false);
        setError(
          "Your login link is invalid or has expired. Please request a new one.",
        );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount for OAuth-style hash
  }, []);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("reset") === "success") {
      setPasswordResetOk(true);
      window.history.replaceState(null, "", "/admin/login");
    }
  }, []);

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
        {passwordResetOk ? (
          <Alert className="mb-4 border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950/40 dark:text-green-100">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription>
              Your password was updated. Sign in with your new password.
            </AlertDescription>
          </Alert>
        ) : null}
        <h1
          className="mb-0 text-3xl font-bold tracking-tight sm:text-[2rem]"
          style={{ color: DSI_NAVY }}
        >
          Welcome back
        </h1>
        <p className="mb-0 text-base text-muted-foreground">
          Enter your email and password to access the UF DSI admin dashboard.
        </p>
      </div>

      {error ? (
        <div className="mt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      ) : null}

      <div className="mt-8">
        {!linkSent ? (
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-5">
              <Controller
                name="email"
                defaultValue=""
                control={form.control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /[a-zA-Z0-9._%+-]+@ufl\.edu/,
                    message: "Enter a valid @ufl.edu email address",
                  },
                }}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="login-email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="name@ufl.edu"
                      autoComplete="email"
                      className="h-11 border-border/80 bg-background"
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
                rules={{ required: "Password is required" }}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-password">Password</FieldLabel>
                    <Input
                      {...field}
                      id="login-password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="h-11 border-border/80 bg-background"
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Controller
                  name="remember"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="login-remember"
                        checked={field.value}
                        onCheckedChange={(v) =>
                          field.onChange(v === true)
                        }
                        className="border-[#0021A5]/40 data-[state=checked]:border-[#0021A5] data-[state=checked]:bg-[#0021A5]"
                      />
                      <Label
                        htmlFor="login-remember"
                        className="cursor-pointer text-sm font-normal text-muted-foreground"
                      >
                        Remember me
                      </Label>
                    </div>
                  )}
                />
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:justify-end">
                  <Link
                    href="/admin/login/forgot-password"
                    className="text-sm font-medium hover:underline"
                    style={{ color: DSI_BLUE }}
                  >
                    Forgot password?
                  </Link>
                  <a
                    href="mailto:dsi@ufl.edu?subject=Admin%20account%20access"
                    className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
                  >
                    Need access?
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="h-11 w-full border-0 font-semibold text-white shadow-md transition hover:bg-[#001a8c]"
                style={{ backgroundColor: DSI_BLUE }}
                disabled={submitted}
              >
                {submitted ? (
                  <>
                    <Spinner className="text-white" />
                    Signing in…
                  </>
                ) : (
                  "Log in"
                )}
              </Button>
            </FieldGroup>

            <div className="space-y-6">
              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  DSI admin
                </span>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                University of Florida accounts only.{" "}
                <span className="text-foreground/80">
                  Need an account? Contact a Technology Coordinator.
                </span>
              </p>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-14">
            <Spinner
              className="size-8"
              style={{ color: DSI_BLUE }}
            />
            <p className="text-center text-sm text-muted-foreground">
              Verifying your sign-in link…
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
