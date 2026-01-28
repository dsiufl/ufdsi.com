'use client';
import Loading from "@/components/Loading/Loading";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { createUserClient } from "@/lib/supabase/client";
import { Button } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function Form() {
    const form = useForm();
    const supabase = createUserClient();
    const router = useRouter();
    const [ loading, setLoading ] = useState<boolean>(false);
    const submit = (data) => {
        console.log("sent", data);
        supabase.auth.updateUser({ password: data.password }).then((result) => {
            if (result.error) {
                console.error("Error updating password:", result.error);
            } else {
                console.log("Password updated successfully");
                // Redirect to dashboard
                router.push('/admin/dashboard');
            }
        });
    }
    return loading ? <Loading message="Setting password.." /> : (
        <form className="flex flex-col w-full max-w-sm" onSubmit={form.handleSubmit(submit)}>
            <FieldGroup>
                <Field>
                    <Controller
                        name="password"
                        control={form.control}
                        rules={{
                            required: true,
                            minLength: 8
                        }}
                        render={({ field, fieldState}) => (
                            <>
                                <label className="text-md mb-2" htmlFor="password">Password</label>
                                <Input
                                    id="password"
                                    type="password"
                                    {...field}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                                {
                                    fieldState.error && fieldState.error.type === "minLength" ? (
                                        <FieldError errors={[ {message: "Password must be at least 8 characters"} ]} />
                                    ) : <></>
                                }
                            </>
                        )}
                    />
                    <Controller
                        name="confirm"
                        control={form.control}
                        rules={{
                            required: true,
                            validate: (value) => {
                                const password = form.getValues("password");
                                console.log(value === password)
                                return value === password ? true : "Passwords do not match";
                            }
                        }}
                        render={({ field, fieldState}) => (
                            <>
                                <label className="text-md mb-2" htmlFor="confirm">Confirm Password</label>
                                <Input
                                    type="password"
                                    {...field}
                                />
                                {fieldState.invalid && (
                                    <>
                                    <FieldError errors={[fieldState.error]} />
                                    </>
                                )}
                            </>
                        )}
                    />
                    <Field>
                        <Button className="bg-primary" type="submit">Create Password</Button>
                    </Field>
                </Field>
            </FieldGroup>
        </form>
    );
}