'use client';
import Loading from "@/components/Loading/Loading";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Speaker } from "@/types/db";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function EditSpeaker({speaker, save}: {speaker?: Speaker, save: (data: Speaker) => void}) {
    const speakerRef = useRef<Speaker>({...speaker})
    const [picture, setPicture] = useState<Blob | undefined>(undefined);
    useEffect(() =>{
        console.log(speaker);
        if (!speaker || !speaker.cover) return;
        console.log("Continuing")
        fetch(speaker.cover).then((res) => {
            if (!res.ok) {
                console.log(res)
            } else {
                return res.blob()
            }
        }).then((data) => {
            console.log("The picture has arrived!")
            setPicture(data)
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    const form = useForm()

    return picture || !speakerRef.current.cover ? (
        <form onSubmit={form.handleSubmit((data) => {
            data.id = speakerRef.current.id;
            save(data as Speaker);
        })}>
            <FieldGroup>
                <Controller
                    name="cover"
                    defaultValue={speakerRef.current.cover ?? ""}
                    control={form.control}
                    rules={{required: true}}
                    render={({field, fieldState}) => {
                        return (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-md">
                                Headshot
                            </FieldLabel>
                            <div className="w-full flex justify-center">
                                <div className="h-[30rem] rounded-xl overflow-clip">
                                    <Image
                                        fill
                                        src={field.value.length > 0 ? field.value : "/images/logo/logo.svg"}
                                        unoptimized
                                        alt="Headshot"
                                        className="!relative"
                                    />
                                </div>
                            </div>
                            <Input 
                                {...field}
                                className="hidden"
                            />
                            <div className="flex justify-between w-full gap-4 ">
                            <Input
                                type="file"
                                accept="image/*"
                                value={""}
                                aria-invalid={fieldState.invalid}
                                onChange={(e) => {
                                    field.onChange(URL.createObjectURL(e.target.files[0]))
                                }}
                                placeholder="Johnny Appleseed"
                                autoComplete="off"
                            />
                            { field.value !== speakerRef.current.cover && <Button onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                field.onChange(speakerRef.current.cover)
                            }}>Revert</Button>}
                            </div>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}} 
                />
                <Controller
                    name="name"
                    control={form.control}
                    defaultValue={speakerRef.current.name ?? ""}
                    rules={{required: true}}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-md">
                                Name
                            </FieldLabel>
                            <Input
                                {...field}
                                aria-invalid={fieldState.invalid}
                                placeholder="Johnny Appleseed"
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )} 
                />
                <Controller
                    name="affiliation"
                    control={form.control}
                    defaultValue={speakerRef.current.affiliation ?? ""}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-md">
                                Affiliation
                            </FieldLabel>
                            <Input
                                {...field}
                                aria-invalid={fieldState.invalid}
                                placeholder="Apple"
                               
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )} 
                />
                <Controller
                    name="affiliated_logo"
                    defaultValue={speakerRef.current.affiliated_logo ?? ""}
                    control={form.control}
                    render={({field, fieldState}) => {
                        return (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-md">
                                Logo of Affiliated Organization
                            </FieldLabel>
                            <div className="w-full flex justify-center">
                                <div className="h-[10rem] rounded-xl overflow-clip">
                                    <Image
                                        fill
                                        src={field.value ? field.value : "/images/logo/logo.svg"}
                                        unoptimized
                                        alt="Headshot"
                                        className="!relative"
                                    />
                                </div>
                            </div>
                            <Input 
                                {...field}
                                className="hidden"
                            />
                            <div className="flex justify-between w-full gap-4 ">
                            <Input
                                type="file"
                                accept="image/*"
                                value={undefined}
                                aria-invalid={fieldState.invalid}
                                onChange={(e) => {
                                    field.onChange(URL.createObjectURL(e.target.files[0]))
                                }}
                                placeholder="Johnny Appleseed"
                                autoComplete="off"
                            />
                            { field.value !== speakerRef.current.affiliated_logo && <Button onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                field.onChange(speakerRef.current.affiliated_logo)
                            }}>Revert</Button>}
                            </div>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}} 
                />
                <Controller
                    name="title"
                    control={form.control}
                    defaultValue={speakerRef.current.title ?? ""}
                    rules={{required: true}}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-md">
                                Title of Talk
                            </FieldLabel>
                            <Input
                                {...field}
                                aria-invalid={fieldState.invalid}
                                placeholder="RISC-V"
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )} 
                />
                <Controller
                    name="description"
                    control={form.control}
                    defaultValue={speakerRef.current.description ?? ""}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-md">
                                Description
                            </FieldLabel>
                            <Textarea
                                {...field}
                                aria-invalid={fieldState.invalid}
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )} 
                />
                <Controller
                    name="time"
                    control={form.control}
                    defaultValue={speakerRef.current.time ?? ""}
                    rules={{required: true}}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-md">
                                Time
                            </FieldLabel>
                            <Input
                                {...field}
                                aria-invalid={fieldState.invalid}
                                placeholder="e.g. 8:00AM - 9:00AM"
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )} 
                />
                <Controller
                    name="location"
                    control={form.control}
                    defaultValue={speakerRef.current.location ?? ""}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-md">
                                Location
                            </FieldLabel>
                            <Input
                                {...field}
                                aria-invalid={fieldState.invalid}

                                placeholder="e.g. Reitz Union Grand Ballroom"
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )} 
                />
                <Controller
                    name="youtube"
                    control={form.control}
                    defaultValue={speakerRef.current.youtube ?? ""}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-md">
                                YouTube Link
                            </FieldLabel>
                            <Input
                                {...field}
                                aria-invalid={fieldState.invalid}
                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )} 
                />
                <Controller
                    name="track"
                    control={form.control}
                    defaultValue={speakerRef.current.track ?? ""}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-md">
                                Symposium Track
                            </FieldLabel>
                            <Input
                                {...field}
                                aria-invalid={fieldState.invalid}

                                autoComplete="off"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )} 
                />
                <Field>
                    <Button type="submit">Submit</Button>
                </Field>

            </FieldGroup>
        </form>
    ) : <Loading message="Loading image..." />;
}