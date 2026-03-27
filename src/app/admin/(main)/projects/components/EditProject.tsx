import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Project } from "@/types/db";
import { Input } from "@/components/ui/input";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { useContext, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { AlertContext } from "@/app/AlertProvider";
export default function EditProject({project, submit}: {project?: Project, submit: (project: Project) => Promise<void>}) {
    const form = useForm<Project>({
        defaultValues: project
    });
    if (!project) project = {} as Project;
    const [ loading, setLoading ] = useState<boolean>(false);
    const onSubmit = async (data: Project) => {
        setLoading(true);
        await submit(data);
        setLoading(false);
    }
   
    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                
                <Controller
                    name="title"
                    control={form.control}
                    rules={{required: true}}
                    defaultValue={project.title ?? ""}
                    render={({field, fieldState}) => (
                        <Field aria-invalid={fieldState.invalid} className="aria-[invalid=true]:text-red-500">
                            <FieldLabel className="text-md">Title</FieldLabel>
                            <Input {...field} placeholder="Title of Project"/>
                            {fieldState.invalid && (
                                <FieldError>
                                    {fieldState.error?.type ?? "This field is required"}
                                </FieldError>
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="lead"
                    control={form.control}
                    rules={{required: true}}
                    defaultValue={project.lead ?? ""}
                    render={({field, fieldState}) => (
                        <Field aria-invalid={fieldState.invalid} className="aria-[invalid=true]:text-red-500">
                            <FieldLabel className="text-md">Project Lead</FieldLabel>
                            <Input {...field} placeholder="Project Lead"/>
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
                    defaultValue={project.description ?? " "}
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
                    name="link"
                    control={form.control}
                    defaultValue={project.link ?? ""}
                    render={({field, fieldState}) => (
                        <Field aria-invalid={fieldState.invalid} className="aria-[invalid=true]:text-red-500">
                            <FieldLabel className="text-md">Project Link</FieldLabel>
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