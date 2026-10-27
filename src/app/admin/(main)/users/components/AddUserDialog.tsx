'use client';

import { useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { RoleCombobox } from "@/components/RoleCombobox";
import { Profile } from "@/types/db";

type Inputs = {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
};

export function AddUserDialog({ open, onOpenChange, onCreated }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated: (user: Profile) => void;
}) {
    const form = useForm<Inputs>();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const close = (next: boolean) => {
        if (submitting) return;
        if (!next) {
            form.reset();
            setError(null);
        }
        onOpenChange(next);
    };

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setSubmitting(true);
        setError(null);
        try {
            const res = await fetch('/api/users/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: { ...data, publish: true } }),
            });
            if (!res.ok) {
                if (res.status === 403) {
                    setError("You don't have permission to invite users.");
                } else {
                    const text = await res.text();
                    setError(text || "Could not send the invite. Please try again.");
                }
                return;
            }
            const created: Profile = await res.json();
            onCreated(created);
            form.reset();
            onOpenChange(false);
        } catch {
            setError("Could not send the invite. Please check your connection and try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={close}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add User</DialogTitle>
                    <DialogDescription>
                        Sends a Clerk invitation to this email. They&apos;ll set their own password and profile when they accept.
                    </DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    {error && (
                        <p role="alert" className="text-sm text-destructive">{error}</p>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <Controller
                            name="first_name"
                            control={form.control}
                            defaultValue=""
                            rules={{ required: "Required" }}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="add-user-first-name">First name</FieldLabel>
                                    <Input {...field} id="add-user-first-name" placeholder="Jane" />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="last_name"
                            control={form.control}
                            defaultValue=""
                            rules={{ required: "Required" }}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="add-user-last-name">Last name</FieldLabel>
                                    <Input {...field} id="add-user-last-name" placeholder="Doe" />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </div>
                    <Controller
                        name="email"
                        control={form.control}
                        defaultValue=""
                        rules={{
                            required: "Required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Enter a valid email address",
                            },
                        }}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="add-user-email">Email</FieldLabel>
                                <Input {...field} id="add-user-email" type="email" placeholder="jane@ufl.edu" />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <Controller
                        name="role"
                        control={form.control}
                        defaultValue=""
                        rules={{ required: "Required" }}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="add-user-role">Role</FieldLabel>
                                <RoleCombobox id="add-user-role" value={field.value} onChange={field.onChange} />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => close(false)} disabled={submitting}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#FF5722] hover:bg-[#F4511E] text-white"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <Spinner className="mr-2" />
                                    Sending invite…
                                </>
                            ) : (
                                "Send invite"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
