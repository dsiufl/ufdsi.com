"use client";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";

export type PasswordInputs = { password: string; confirm: string };

export const usePasswordForm = () => useForm<PasswordInputs>({ defaultValues: { password: "", confirm: "" }, mode: "onTouched" });

/** New password + confirm, with a show toggle. Works inside any form whose values include these two fields. */
export function PasswordFields({ form, email }: { form: UseFormReturn<any>; email?: string | null }) {
  const [show, setShow] = useState(false);
  const { errors } = form.formState;
  const type = show ? "text" : "password";

  return (
    <>
      {/* lets password managers save the new password against the right account */}
      {email && <input type="email" name="username" autoComplete="username" value={email} readOnly hidden />}
      <Field data-invalid={!!errors.password}>
        <FieldLabel htmlFor="new-password">New password</FieldLabel>
        <div className="relative">
          <Input
            id="new-password"
            type={type}
            autoComplete="new-password"
            autoFocus
            className="h-10 pr-10"
            aria-invalid={!!errors.password}
            {...form.register("password", {
              required: "Choose a password",
              minLength: { value: 8, message: "Use at least 8 characters" },
            })}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.password ? <FieldError errors={[errors.password as { message?: string }]} /> : <FieldDescription>At least 8 characters.</FieldDescription>}
      </Field>
      <Field data-invalid={!!errors.confirm}>
        <FieldLabel htmlFor="confirm-password">Type it again</FieldLabel>
        <Input
          id="confirm-password"
          type={type}
          autoComplete="new-password"
          className="h-10"
          aria-invalid={!!errors.confirm}
          {...form.register("confirm", {
            required: "Type the password again",
            validate: (v: string) => v === form.getValues("password") || "Passwords don't match",
          })}
        />
        {errors.confirm && <FieldError errors={[errors.confirm as { message?: string }]} />}
      </Field>
    </>
  );
}
