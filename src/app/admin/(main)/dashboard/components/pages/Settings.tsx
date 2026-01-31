'use client';
import Overlay from "@/components/Overlay/Overlay";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { createUserClient } from "@/lib/supabase/client";
import { AdminInfo, Profile } from "@/types/db";
import { InfoIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function Settings({data, className}: {data?: AdminInfo, className?: string}) {
    const form = useForm();
    const passwdForm = useForm();
    const supabase = createUserClient()
    const [ passwordOverlay, setPasswordOverlay ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ error, setError ] = useState<string | null>(null);

    const submitHandler = async (values: Profile) => {
        setLoading(true);
        if (values.pictureURL.includes('blob')) {
            const blob = await fetch(values.pictureURL).then(r => r.blob());
            const { data: uploadData, error: uploadError } = await supabase.storage.from('images').upload(`team/${data?.id}.jpg`, blob, {
                upsert: true
            });
            if (uploadError) {
                console.error("Error uploading image:", uploadError);
                setError("Error uploading image");
                setLoading(false);
                return;
            }
        }
        const { data: result, error } = await supabase.schema('admin').from('people').update(values).eq('id', data?.id);
        if (error) {
            console.error("Error updating profile:", error);
            setError("Error updating profile");
        } else {
            console.log("Profile updated successfully:", result);
        }
        setLoading(false);  
    }
    const passwordSubmitHandler = async (values: any) => {
        console.log(values);
        setLoading(true);
        const { data: check , error: checkError } = await supabase.auth.signInWithPassword({
            email: data?.email!,
            password: values.current_password
        });
        if (checkError || !check.user) {
            console.error("Current password is incorrect:", checkError);
            setError("Current password is incorrect");
            setLoading(false);
            return;
        }
        const { data: result, error } = await supabase.auth.updateUser({
            password: values.new_password
        });
        if (error) {
            console.error("Error updating password:", error);
            setError("Error updating password");
            console.log("Password updated successfully:", result);
            setPasswordOverlay(false);
        }
        setLoading(false);

    }
    return (
        <div className={` border-box relative pr-4 w-full flex flex-grow items-center justify-start gap-4 py-2 ${className}`}>
            { passwordOverlay && (
                <Overlay close={() => {
                    setPasswordOverlay(false);
                    passwdForm.reset();
                    setError(null);
                }} title="Change Password">
                    <form className="flex flex-col w-full p-4 gap-4" onSubmit={passwdForm.handleSubmit(passwordSubmitHandler)}>
                    <FieldGroup>
                        {error && <FieldError>{error}</FieldError>}
                        <Controller
                                name="current_password"
                                control={passwdForm.control}
                                defaultValue={ ''}
                                rules={{required: true}}
                                render={({ field, fieldState }) => (
                                    <Field aria-label="Password" aria-invalid={!!fieldState.error}>
                                        <FieldLabel>Current Password</FieldLabel>
                                        <Input {...field} type="password" placeholder="Current Password" />
                                        {fieldState.error && field.value.length > 0 && <FieldError>{fieldState.error?.message || "Current password is required"}</FieldError>}
                                    </Field>
                                )}
                        />
                        <div className="h-0.5 w-full my-1 dark:bg-amber-50/30 bg-gray-800"></div>
                        <Controller
                                name="new_password"
                                control={passwdForm.control}
                                defaultValue={ ''}
                                rules={{required: true}}
                                render={({ field, fieldState }) => (
                                    <Field aria-label="Password" aria-invalid={!!fieldState.error}>
                                        <FieldLabel>New Password</FieldLabel>
                                        <Input {...field} type="password" placeholder="Password" />
                                        {fieldState.error && field.value.length > 0 && <FieldError>{fieldState.error?.message || "New password is required"}</FieldError>}
                                    </Field>
                                )}
                        />
                        <Controller
                                name="confirm_password"
                                control={passwdForm.control}
                                defaultValue={ ''}
                                rules={{validate: (i) => {
                                    return passwdForm.control._formValues.new_password === i || "Passwords do not match";
                                }, required: true}}
                                render={({ field, fieldState }) => (
                                    <Field aria-label="Password" aria-invalid={!!fieldState.error}>
                                        <FieldLabel>Confirm New Password</FieldLabel>
                                        <Input {...field} type="password" placeholder="Password" />
                                        <FieldError>{fieldState.error?.message}</FieldError>
                                    </Field>
                                )}
                        />
                        
                        <div className="flex w-full justify-center">
                            <Button className="w-fit" type="submit">{ loading ? <Spinner /> : "Change password" }</Button>
                        </div>
                        
                    </FieldGroup>
                </form>
                </Overlay>
            ) }
            <div className="flex w-full h-full shadow-xl items-center justify-center dark:bg-[#000000]/30 rounded-xl">
                
                <form className="flex flex-row w-[80%] p-4 gap-4" onSubmit={form.handleSubmit(submitHandler)}>
                    <div className="flex flex-col text-center w-[50%] h-full items-start justify-center p-4">
                            <Controller
                                    name="pictureURL"
                                    control={form.control}
                                    defaultValue={data?.pictureURL || ''}
                                    render={({ field, fieldState }) => (
                                        <Field aria-label="Headshot" aria-invalid={!!fieldState.error}>
                                            <FieldLabel className="text-center">Headshot</FieldLabel>
                                            
                                            <Image
                                                src={field.value}
                                                alt={`${data?.first_name} ${data?.last_name}`}
                                                width={300}
                                                height={300}
                                                className="rounded-xl"
                                            />
                                            <Input type="file" onChange={(e) => {
                                                field.onChange(e.target.files[0])
                                            }} placeholder="Headshot" />
                                        </Field>
                                    )}
                                />
                        
                        
                    </div>
                    <FieldGroup>
                        
                        <div className="flex flex-row gap-2">
                                <Controller
                                    name="first_name"
                                    control={form.control}
                                    defaultValue={data?.first_name || ''}
                                    render={({ field, fieldState }) => (
                                        <Field aria-label="First Name" aria-invalid={!!fieldState.error}>
                                            <FieldLabel>First Name</FieldLabel>
                                            <Input {...field} placeholder="First Name" />
                                        </Field>
                                    )}
                                />
                                <Controller
                                name="last_name"
                                control={form.control}
                                defaultValue={data?.last_name || ''}
                                render={({ field, fieldState }) => (
                                    <Field aria-label="Last Name" aria-invalid={!!fieldState.error}>
                                        <FieldLabel>Last Name</FieldLabel>
                                        <Input {...field} placeholder="Last Name" />
                                    </Field>
                                )}
                            />
                        </div>
                        <Controller
                                name="email"
                                control={form.control}
                                defaultValue={data?.email || ''}
                                render={({ field, fieldState }) => (
                                    <Field aria-label="Email" aria-invalid={!!fieldState.error}>
                                        <FieldLabel>Email</FieldLabel>
                                        <Input {...field} placeholder="Email" />
                                    </Field>
                                )}
                        />
                        
                        <Controller
                                name="role"
                                control={form.control}
                                disabled={true}
                                defaultValue={data?.role || ''}
                                render={({ field, fieldState }) => (
                                    <Field aria-label="Role" className="flex flex-col items-start"aria-invalid={!!fieldState.error}>
                                        <FieldLabel>Role</FieldLabel>
                                        <Input {...field} placeholder="Role" />
                                        <div className="flex gap-2">
                                            <InfoIcon className="size-4 text-gray-400" />
                                            <p className="text-gray-400 text-xs">If your role is incorrect, contact a Technology Coordinator.</p>
                                        </div>
                                        
                                    </Field>
                                )}
                            />
                        <div className="flex flex-col items-center gap-4">
                            <Button type="submit" className="w-40">{loading ? <Spinner /> : "Save"}</Button>
                            <div className="h-0.5 w-full dark:bg-amber-50/30 bg-gray-800"></div>
                            <Button className="w-40" onClick={(e) => {
                                e.preventDefault();
                                setPasswordOverlay(true)
                            }}>Change password</Button>
                        </div>
                        
                    </FieldGroup>
                </form>
            </div>
        </div>
    )
}