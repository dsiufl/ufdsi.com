'use client';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Image from "next/image";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createUserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Inputs = {
    email: string,
    password: string,
}

export default function Page() {
    const router = useRouter()
    const supabase = createUserClient();
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        supabase.auth.signInWithPassword(data).then((result) => {
            if (result.error) {
                // idk
            } else {
                console.log("redirecting..")
                router.push('/admin/dashboard')
            }
        })
    }
    const form = useForm<Inputs>()
    return (
        <div className="absolute flex h-screen w-screen items-center justify-start z-0 bg-[url(/images/hero/landing-page.jpg)]">
            <div className=" w-full lg:w-[50%] p-10 h-full  bg-white dark:bg-black border rounded-xl border-white/10 flex flex-col items-center justify-center">
                <div className="sticky top-0 left-0 flex flex-col items-center">
                    <Image
                        src="/images/logo/hd-transparent-dsi-logo.png"
                        alt="DSI logo"
                        width={100}
                        height={40}
                        className="block"
                    />
                    
                </div>
                <div className="w-[75%] h-0.5 m-2 bg-gray-700 dark:bg-amber-50/30"></div>
                <h2 className="">Sign in</h2>
                
                <form className="w-[75%]" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        
                        <Controller
                            name="email"
                            control={form.control}
                            rules={{
                                required: true,
                                pattern: /[a-zA-z.0-9]+@ufl.edu/
                            }}
                            render={({ field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className="text-md">
                                        Email
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-rhf-demo-title"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="name@ufl.edu"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="password"
                            control={form.control}
                            rules={{
                                required: true
                            }}
                            render={({ field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className="text-md">
                                        Password
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-rhf-demo-title"
                                        type="password"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Your password"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Field>
                            <Button type="submit">Sign in</Button>
                        </Field>
                        
                    </FieldGroup>
                    <p style={{color: 'gray'}}>Need an account? Contact one of the Technology Coordinators.</p>

                </form>

                
            </div>
        </div>
    )
    
}