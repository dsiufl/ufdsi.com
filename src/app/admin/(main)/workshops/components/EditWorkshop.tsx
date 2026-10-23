import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Workshop } from "@/types/db";
import { Input } from "@/components/ui/input";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
const toLocalInput = (value: Date | string) => {
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function EditWorkshop({workshop, submit, canPublish}: {workshop?: Workshop, submit: (workshop: Workshop) => Promise<void>, canPublish: boolean}) {
    const form = useForm<Workshop>({
        defaultValues: workshop
    });
    if (!workshop) workshop = {} as Workshop;
    const [ loading, setLoading ] = useState<boolean>(false);
    const onSubmit = async (data: Workshop) => {
        setLoading(true);
        await submit(data);
        setLoading(false);
    }
    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-5">
                <Controller
                    name="cover"
                    defaultValue={workshop.cover ?? ""}
                    control={form.control}
                    rules={{required: true}}
                    render={({field, fieldState}) => {
                        return (
                            <Field aria-invalid={fieldState.invalid} className="aria-[invalid=true]:text-red-500">
                                <FieldLabel>
                                    Cover
                                </FieldLabel>
                                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border bg-muted">
                                    <Image
                                        fill
                                        src={field.value ? field.value : "/images/logo/hd-transparent-dsi-logo.png"}
                                        unoptimized
                                        alt="Cover preview"
                                        className="object-contain"
                                    />
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
                                        placeholder="Cover Image"
                                        autoComplete="off"
                                    />
                                    { field.value !== workshop.cover && field.value !== "" && <Button onClick={(e) => {
                                        console.log(field.value)
                                        e.preventDefault();
                                        e.stopPropagation();
                                        field.onChange(workshop.cover)
                                    }} variant="outline">Revert</Button>}
                                </div>
                                {fieldState.invalid && (
                                    <FieldError>
                                        {fieldState.error?.type ?? "This field is required"}
                                    </FieldError>
                                )}
                            </Field>
                    )}} 
                />
                <Controller
                    name="title"
                    control={form.control}
                    rules={{required: true}}
                    defaultValue={workshop.title ?? ""}
                    render={({field, fieldState}) => (
                        <Field aria-invalid={fieldState.invalid} className="aria-[invalid=true]:text-red-500">
                            <FieldLabel>Title</FieldLabel>
                            <Input {...field} placeholder="Intro to PyTorch"/>
                            {fieldState.invalid && (
                                <FieldError>
                                    {fieldState.error?.type ?? "This field is required"}
                                </FieldError>
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="speaker"
                    control={form.control}
                    rules={{required: true}}
                    defaultValue={workshop.speaker ?? ""}
                    render={({field, fieldState}) => (
                        <Field aria-invalid={fieldState.invalid} className="aria-[invalid=true]:text-red-500">
                            <FieldLabel>Speaker</FieldLabel>
                            <Input {...field} placeholder="Who is leading it"/>
                            {fieldState.invalid && (
                                <FieldError>
                                    {fieldState.error?.type ?? "This field is required"}
                                </FieldError>
                            )}
                        </Field>
                    )}
                />             
                
                <Controller
                    name="description"
                    control={form.control}
                    rules={{required: true}}
                    defaultValue={workshop.description ?? " "}
                    render={({field, fieldState}) => (
                        <Field aria-invalid={fieldState.invalid}>
                            <FieldLabel>Description</FieldLabel>
                            <Textarea {...field} placeholder="What people will build or learn"/>
                            {fieldState.invalid && (
                                <FieldError>
                                    {fieldState.error?.type ?? "This field is required"}
                                </FieldError>
                            )}
                        </Field>
                    )}
                />
                
                
                <Controller
                    name="datetime"
                    control={form.control}
                    rules={{required: true}}
                    defaultValue={workshop.datetime ? new Date(workshop.datetime) : new Date()}
                    render={({field, fieldState}) => (
                        <Field aria-invalid={fieldState.invalid} className="aria-[invalid=true]:text-red-500">
                            <FieldLabel>Date and time</FieldLabel>
                            <Input
                                type="datetime-local"
                                value={toLocalInput(field.value)}
                                onChange={(e) => e.target.value && field.onChange(new Date(e.target.value))}
                            />
                            
                        </Field>
                    )}
                />
                <Controller
                    name="location"
                    control={form.control}
                    defaultValue={workshop.location ?? ""}
                    
                    render={({field, fieldState}) => (
                        <Field aria-invalid={fieldState.invalid} className="aria-[invalid=true]:text-red-500">
                            <FieldLabel>Location</FieldLabel>
                            <Input {...field} placeholder="Marston L136"/>
                        </Field>
                    )}
                />
                <Controller
                    name="link"
                    control={form.control}
                    defaultValue={workshop.link ?? ""}
                    render={({field, fieldState}) => (
                        <Field aria-invalid={fieldState.invalid} className="aria-[invalid=true]:text-red-500">
                            <FieldLabel>Notebook, slides or recording link</FieldLabel>
                            <Input {...field} type="url" placeholder="https://"/>
                        </Field>
                    )}
                />
                {canPublish ? (
                    <Controller
                        name="status"
                        control={form.control}
                        defaultValue={workshop.status ?? "published"}
                        render={({field}) => (
                            <label className="flex items-center justify-between gap-3">
                                <span>
                                    <span className="block text-sm font-medium">Published</span>
                                    <span className="block text-xs text-muted-foreground">Off keeps it as a draft.</span>
                                </span>
                                <Switch checked={field.value === "published"} onCheckedChange={(v) => field.onChange(v ? "published" : "draft")} />
                            </label>
                        )}
                    />
                ) : (
                    <p className="text-sm text-muted-foreground">Saved as a draft until a President, Technology or Workshop Coordinator publishes it.</p>
                )}
                {workshop.submitted_by_email && (
                    <p className="text-xs text-muted-foreground">Sent in through the Google Form by {workshop.submitted_by_email}.</p>
                )}
                <Field aria-invalid={form.formState.isSubmitting} className="aria-[invalid=true]:text-red-500">
                    <Button type="submit" className="w-full" disabled={loading}>{loading ? <Spinner /> : "Save workshop"}</Button>
                </Field>
                

            </FieldGroup>
        </form>
    )
}