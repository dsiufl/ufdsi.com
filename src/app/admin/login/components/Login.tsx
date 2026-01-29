'use client';

import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import { useForm, SubmitHandler, Controller } from "react-hook-form";

import { createUserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

type Inputs = {
    email: string,
    password: string,
}

export default function Login() {
    const router = useRouter()
    const supabase = createUserClient();
    const [ submitted, setSubmitted ] = useState<boolean>(false);
    const [ error, setError ] = useState<string | null>(null);
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        setSubmitted(true);
        supabase.auth.signInWithPassword(data).then((result) => {
            if (result.error) {
                // idk
                setSubmitted(false);
            } else {
                console.log("redirecting..")
                router.push('/admin/dashboard')
            }
        })
    }
    useEffect(() => {
        const hash = window.location.hash.substring(1);
        if (!hash) return;
        console.log("hash found:", hash);
        const params = new URLSearchParams(hash);
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');
        fetch('/api/auth/confirm', {
            method: 'POST',
            body: JSON.stringify({
                access_token: access_token,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async (res) => {
            if (res.status === 200) {
                // Authorized
                supabase.auth.setSession({ access_token, refresh_token }).then(() => {
                    router.push('/admin/dashboard');
                });
            } else if (res.status === 202) {
                // Need to setup password
                console.log('need to setup password');
                supabase.auth.setSession({ access_token, refresh_token }).then(() => {
                    router.push('/admin/setup/password');
                });
                
            } else {
                // Unauthorized
                setError('Your login link is invalid or has expired. Please request a new one.');
            }
        })
    }, []);
    const form = useForm<Inputs>();
    return (
        <div className=" w-full lg:w-[50%] p-10 h-full  bg-white dark:bg-black border rounded-xl border-white/10 flex flex-col items-center justify-center">
                {error && <p className="text-red-500">{error}</p>}
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
                            defaultValue=""
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
                            defaultValue=""
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
                        <Field className="w-full flex justify-center items-center">
                            <Button type="submit" className="!w-fit !px-10">{submitted ? <Spinner /> : "Sign in"}</Button>
                        </Field>
                        
                    </FieldGroup>
                    <p style={{color: 'gray'}}>Need an account? Contact one of the Technology Coordinators. </p>

                </form>

                
            </div>
    )
}