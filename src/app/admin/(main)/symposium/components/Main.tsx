'use client';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { Symposium } from "@/types/db";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowDownWideNarrow } from "lucide-react";
import { useState } from "react";
import Overlay from "@/components/Overlay/Overlay";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function Main({symposiums, token}: {symposiums: Symposium[], token: string | null}) {
    const router = useRouter();
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ createOverlay, setCreateOverlay ] = useState<boolean>(false);
    const createForm = useForm();
    return (
        <div className="size-96 p-4 dark:bg-[#000000]/30 rounded-xl shadow-xl flex flex-col items-center justify-center">
            { createOverlay && (
                <Overlay title="Create Symposium" close={() => setCreateOverlay(false)}>
                    <form onSubmit={createForm.handleSubmit(async (data) => {
                        setLoading(true);
                        const res = await fetch('/api/symposium/create', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ token, year: data.year }),
                        });
                        const resData = await res.json();
                        if (res.ok) {
                            router.push(`/admin/symposium/${resData.symposium.id}`);
                        } else {
                            alert(`Error: ${resData.error}`);
                            setLoading(false);
                        }

                    })}>
                        <FieldGroup>
                            <Controller
                                name="year"
                                control={createForm.control}
                                defaultValue={new Date().getFullYear()}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Year</FieldLabel>
                                        <Input type="number" {...field} />
                                    </Field>
                                )}

                            />
                            <Field>
                                <Button type="submit" className="mt-4 w-fit" disabled={loading}>{ loading ? <Spinner /> : "Create" }</Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </Overlay>
                    
            )}
            <h3 className="mb-0">Choose a symposium</h3>
            <div className="h-0.5 w-full dark:bg-amber-50/30 my-4"></div>
            <div className="w-full flex flex-col justify-center items-center">
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button className="bg-transparent border border-[#FF5722] text-black dark:text-white hover:!translate-y-0 hover:bg-transparent"><ArrowDownWideNarrow />
                            {loading ? <Spinner /> : "Select Symposium"}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {symposiums.map((symp) => (
                            <DropdownMenuItem key={symp.id} onClick={() => {
                                router.push(`/admin/symposium/${symp.id}`)
                                setLoading(true);
                            }}>
                                Symposium {symp.id} - {new Date(symp.date).toLocaleDateString()}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                    
                </DropdownMenu>
            
            <Button onClick={() => setCreateOverlay(true)} className="m-4 bg-tran">Create Symposium</Button>
            </div>
        </div>
    );
}