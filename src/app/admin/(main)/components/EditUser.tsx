'use client';

import { Profile } from "@/types/db";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { Info } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { useState } from "react";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { InputGroup } from "@/components/ui/input-group";
export default function EditUser({data, onSubmit, admin}: {data: Profile, onSubmit: (data: Profile) => void, admin?: boolean}) {
    const form = useForm<Profile>();
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ dropdown, setDropdown ] = useState<boolean>(false);
    const submit = async (sub: Profile) => {
        setLoading(true);
        await onSubmit(sub);
        setLoading(false);
    }
    return (
        <form className="flex flex-col w-full" onSubmit={form.handleSubmit(submit)}>
            {data && <p className="dark:text-gray-400 text-sm">Verify and correct the information below before continuing.</p>}
            <FieldGroup>
                <Controller
                    name="pictureURL"
                    defaultValue={data.pictureURL ?? ""}
                    control={form.control}
                    rules={{required: admin ? false : true}}
                    render={({field, fieldState}) => {
                        return (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-md">
                                Headshot
                            </FieldLabel>
                            <div className="w-full flex justify-center">
                                <div className="h-[15rem] rounded-xl overflow-clip">
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
                            { field.value !== data.pictureURL && <Button onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                field.onChange(data.pictureURL)
                            }}>Revert</Button>}
                            </div>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}} 
                />
                <Field>
                    <Label className="m-0">First Name</Label>
                    <Controller
                        name="first_name"
                        rules={{required: true}}
                        control={form.control}
                        defaultValue={data.first_name}
                        render={({field}) => (
                            <Input {...field} placeholder="First Name" />
                        )}
                    />
                </Field>
                <Field>
                    <Label className="m-0">Last Name</Label>
                    <Controller
                        name="last_name"
                        control={form.control}
                        defaultValue={data.last_name}
                        render={({field}) => (
                            <Input {...field} placeholder="Last Name" />
                        )}
                    />
                </Field>
                <Field>
                    <Label className="m-0">Email</Label>
                    <Controller
                        name="email"
                        rules={{required: true}}
                        control={form.control}
                        disabled={admin ? false : true}
                        defaultValue={data.email}
                        render={({field}) => (
                            <Input {...field} placeholder="Email" />
                        )}
                    />
                </Field>
                
                <Field>
                    <Label className="m-0">Assigned role</Label>
                    <Controller
                        name="role"
                        control={form.control}
                        rules={{required: true}}
                        defaultValue={data.role}
                        disabled={admin ? false : true}
                        render={({field}) => (
                            <Input {...field} placeholder="Assigned role" />
                        )}
                    />
                </Field>
                <Field>
                    <Controller
                        name="publish"
                        defaultValue={true}
                        control={form.control}
                        render={({field}) => (
                            <div className="flex items-center" onClick={() => {
                                field.onChange(!field.value)
                            }}>
                                <Input checked={field.value} type="checkbox" className="size-4" onChange={field.onChange} onBlur={field.onBlur} name={field.name} ref={field.ref} placeholder="Assigned role" />
                                <Label className="ml-2">Allow profile to be visible on DSI website</Label>
                            </div>
                        )}
                    />
                </Field>
                
                { !admin && <p className="italics text-gray-400 text-xs flex gap-2 items-center "><Info /> If your assigned role or email is incorrect, contact a Technology Coordinator.</p>} 
                <Field>
                    { loading ? <Button disabled className="w-full justify-center"><Spinner /></Button> : <Button type="submit" className="w-full">Submit</Button>}
                </Field>
            </FieldGroup>
        </form>
    )

}