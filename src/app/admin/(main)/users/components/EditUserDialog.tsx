'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { RoleCombobox } from "@/components/RoleCombobox";
import { useSupabaseClient } from "@/lib/supabase/client";
import { Profile } from "@/types/db";

export function EditUserDialog({ user, onOpenChange, onUpdated }: {
    user: Profile;
    onOpenChange: (open: boolean) => void;
    onUpdated: (user: Profile) => void;
}) {
    const form = useForm<Profile>({ defaultValues: user });
    const supabase = useSupabaseClient();
    const [error, setError] = useState<string | null>(null);
    const [picture, setPicture] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const submitting = form.formState.isSubmitting;

    useEffect(() => {
        if (!picture) {
            setPreview(null);
            return;
        }
        const url = URL.createObjectURL(picture);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [picture]);

    const close = (open: boolean) => {
        if (!submitting) onOpenChange(open);
    };

    const submit = async (values: Profile) => {
        setError(null);
        try {
            let pictureURL = user.pictureURL;
            if (picture) {
                const path = `team/${user.id}.jpg`;
                const { error: uploadError } = await supabase.storage.from('images').upload(path, picture, {
                    upsert: true,
                    contentType: picture.type,
                });
                if (uploadError) {
                    setError("Error uploading image: " + uploadError.message);
                    return;
                }
                pictureURL = supabase.storage.from('images').getPublicUrl(path).data.publicUrl;
            }
            const res = await fetch('/api/users/edit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: { ...values, id: user.id, pictureURL } }),
            });
            if (!res.ok) {
                setError(res.status === 403
                    ? "You don't have permission to edit users."
                    : (await res.text()).trim() || "Could not save changes. Please try again.");
                return;
            }
            const updated: Profile = await res.json();
            onUpdated(updated);
            onOpenChange(false);
        } catch {
            setError("Could not save changes. Please check your connection and try again.");
        }
    };

    return (
        <Dialog open onOpenChange={close}>
            <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                        Update {user.first_name}&apos;s profile, assigned role, and website visibility.
                    </DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
                    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
                    <fieldset className="space-y-4" disabled={submitting}>
                        <Field>
                            <FieldLabel htmlFor="edit-user-picture">Headshot</FieldLabel>
                            <div className="flex items-center gap-3">
                                <Image
                                    src={preview || user.pictureURL || "/images/logo/logo.svg"}
                                    alt="Headshot preview"
                                    width={56}
                                    height={56}
                                    unoptimized
                                    className="h-14 w-14 shrink-0 rounded-full object-cover"
                                />
                                <Input
                                    id="edit-user-picture"
                                    type="file"
                                    accept="image/*"
                                    className="min-w-0"
                                    onChange={(event) => {
                                        const file = event.target.files?.[0];
                                        if (file) setPicture(file);
                                        event.target.value = "";
                                    }}
                                />
                            </div>
                            {picture && <Button type="button" variant="ghost" size="sm" onClick={() => setPicture(null)}>Revert headshot</Button>}
                        </Field>
                        <div className="grid grid-cols-2 gap-4">
                            <Controller
                                name="first_name"
                                control={form.control}
                                rules={{ required: "Required" }}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="edit-user-first-name">First name</FieldLabel>
                                        <Input {...field} id="edit-user-first-name" placeholder="Jane" aria-invalid={fieldState.invalid} />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="last_name"
                                control={form.control}
                                rules={{ required: "Required" }}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="edit-user-last-name">Last name</FieldLabel>
                                        <Input {...field} id="edit-user-last-name" placeholder="Doe" aria-invalid={fieldState.invalid} />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </div>
                        <Controller
                            name="email"
                            control={form.control}
                            rules={{ required: "Required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" } }}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="edit-user-email">Email</FieldLabel>
                                    <Input {...field} id="edit-user-email" type="email" placeholder="jane@ufl.edu" aria-invalid={fieldState.invalid} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="role"
                            control={form.control}
                            rules={{ required: "Required" }}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="edit-user-role">Role</FieldLabel>
                                    <RoleCombobox id="edit-user-role" value={field.value} onChange={field.onChange} disabled={submitting} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="publish"
                            control={form.control}
                            render={({ field }) => (
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="edit-user-publish"
                                        type="checkbox"
                                        className="h-4 w-4"
                                        checked={field.value}
                                        onChange={(event) => field.onChange(event.target.checked)}
                                        onBlur={field.onBlur}
                                        name={field.name}
                                        ref={field.ref}
                                    />
                                    <FieldLabel htmlFor="edit-user-publish">Show profile on the DSI website</FieldLabel>
                                </div>
                            )}
                        />
                    </fieldset>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => close(false)} disabled={submitting}>Cancel</Button>
                        <Button type="submit" className="bg-[#FF5722] hover:bg-[#F4511E] text-white" disabled={submitting}>
                            {submitting ? <><Spinner className="mr-2" />Saving changes…</> : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
