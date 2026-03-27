import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Workshop } from "@/types/db";
import { Input } from "@/components/ui/input";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
export default function EditWorkshop({workshop, submit}: {workshop?: Workshop, submit: (workshop: Workshop) => Promise<void>}) {
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
            <FieldGroup>
                <Controller
                    name="cover"
                    defaultValue={workshop.cover ?? ""}
                    control={form.control}
                    rules={{required: true}}
                    render={({field, fieldState}) => {
                        return (
                            <Field aria-invalid={fieldState.invalid} className="aria-[invalid=true]:text-red-500">
                                <FieldLabel className="text-md">
                                    Cover
                                </FieldLabel>
                                <div className="w-full flex justify-center">
                                    <div className="h-[15rem] rounded-xl overflow-clip">
                                        <Image
                                            fill
                                            src={field.value ? field.value : "/images/logo/hd-transparent-dsi-logo.png"}
                                            unoptimized
                                            alt="Cover"
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
                                        placeholder="Cover Image"
                                        autoComplete="off"
                                    />
                                    { field.value !== workshop.cover && field.value !== "" && <Button onClick={(e) => {
                                        console.log(field.value)
                                        e.preventDefault();
                                        e.stopPropagation();
                                        field.onChange(workshop.cover)
                                    }}>Revert</Button>}
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
                            <FieldLabel className="text-md">Title</FieldLabel>
                            <Input {...field} placeholder="Title of Workshop"/>
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
                            <FieldLabel className="text-md">Speaker</FieldLabel>
                            <Input {...field} placeholder="Workshop Speaker"/>
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
                            <FieldLabel className="text-md">Description</FieldLabel>
                            <Textarea {...field} placeholder="Description"/>
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
                            <FieldLabel className="text-md">Date/Time</FieldLabel>
                            <DropdownMenu modal={true}>
                                <DropdownMenuTrigger asChild>
                                    <Input className="w-full" {...field} value={new Date(field.value).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true
                                    })} placeholder="Date and Time"/>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <Calendar
                                        mode="single"
                                        selected={new Date(field.value)}
                                        onSelect={field.onChange}
                                    />
                                    <Input
                                        type="time"
                                        className="text-center w-full"
                                        value={new Date(field.value).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false
                                        })}
                                        onChange={(e) => {
                                            const date = new Date(field.value);
                                            const [hours, minutes] = e.target.value.split(':').map(Number);
                                            date.setHours(hours);
                                            date.setMinutes(minutes);
                                            field.onChange(date);
                                        }}
                                    />
                                </DropdownMenuContent>
                            </DropdownMenu>
                            
                        </Field>
                    )}
                />
                <Controller
                    name="location"
                    control={form.control}
                    defaultValue={workshop.location ?? ""}
                    
                    render={({field, fieldState}) => (
                        <Field aria-invalid={fieldState.invalid} className="aria-[invalid=true]:text-red-500">
                            <FieldLabel className="text-md">Location</FieldLabel>
                            <Input {...field} placeholder="AIIRI"/>
                        </Field>
                    )}
                />
                <Controller
                    name="link"
                    control={form.control}
                    defaultValue={workshop.link ?? ""}
                    render={({field, fieldState}) => (
                        <Field aria-invalid={fieldState.invalid} className="aria-[invalid=true]:text-red-500">
                            <FieldLabel className="text-md">GitHub / Youtube / Slides Link</FieldLabel>
                            <Input {...field} placeholder="Description"/>
                        </Field>
                    )}
                />
                <Field aria-invalid={form.formState.isSubmitting} className="aria-[invalid=true]:text-red-500">
                    <Button type="submit">{loading ? <Spinner /> : "Submit"}</Button>
                </Field>
                

            </FieldGroup>
        </form>
    )
}