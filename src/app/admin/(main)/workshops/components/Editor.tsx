'use client';
import { Workshop } from "@/types/db";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EllipsisIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Overlay from "@/components/Overlay/Overlay";
import EditWorkshop from "./EditWorkshop";
import { createUserClient } from "@/lib/supabase/client";

export default function Editor({workshops}: {workshops: Workshop[]}) {
    const [workshopList, setWorkshopList] = useState<Workshop[]>(workshops);
    const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
    const [newWorkshop, setNewWorkshop] = useState<boolean>(false);
    const [editWorkshop, setEditWorkshop] = useState<Workshop | undefined>(undefined);
    const supabase = createUserClient();
    const NewWorkshopOverlay = () => {
        return (
            <Overlay close={() => setNewWorkshop(false)} title="Add New Workshop">
                <div>
                    <EditWorkshop submit={async (data: Workshop) => {
                        if (data.cover && data.cover.includes("blob")) {
                            const blob = await fetch(data.cover).then(r => r.blob());
                            const { data: result, error } = await supabase.storage.from('images')
                            .upload(`workshops/${data.title.replace(/\s+/g, '_').toLowerCase()}.jpg`, blob, {
                                upsert: true,
                                contentType: blob.type
                            });
                            if (error) {
                                console.error("Error uploading image:", error);
                                return;
                            } else {
                                const { data: urlData } = supabase.storage.from('images')
                                .getPublicUrl(`workshops/${data.title.replace(/\s+/g, '_').toLowerCase()}.jpg`);
                                data.cover = urlData.publicUrl;
                            }
                        }
                        await supabase.from('workshops').insert(data).then(async (res) => {
                            if (res.error) {
                                console.error("Error adding workshop:", res.error);
                            } else {
                                console.log("Workshop added:", data);
                                setWorkshopList([...workshopList, data]);
                                setNewWorkshop(false);
                            }
                        });
                    }} />
                </div>
            </Overlay>
        );
    }
    const EditWorkshopOverlay = () => {
        return (
            <>
            
            <Overlay close={() => setEditWorkshop(undefined)} title="Edit Workshop">
                <div>
                    
                    <EditWorkshop workshop={editWorkshop!} submit={async (data: Workshop) => {
                        if (data.cover && data.cover.includes("blob")) {
                            const blob = await fetch(data.cover).then(r => r.blob());
                            const { data: result, error } = await supabase.storage.from('images')
                            .upload(`workshops/${data.title.replace(/\s+/g, '_').toLowerCase()}.jpg`, blob, {
                                upsert: true,
                                contentType: blob.type
                            });
                            if (error) {
                                console.error("Error uploading image:", error);
                                return;
                            } else {
                                const { data: urlData } = supabase.storage.from('images')
                                .getPublicUrl(`workshops/${data.title.replace(/\s+/g, '_').toLowerCase()}.jpg`);
                                data.cover = urlData.publicUrl;
                            }
                        }
                        await supabase.from('workshops').update(data).eq('id', data.id).then(async (res) => {
                            if (res.error) {
                                console.error("Error updating workshop:", res.error);
                            } else {
                                console.log("Workshop updated:", data);
                                setWorkshopList(workshopList.map(w => w.id === data.id ? data : w));
                                setEditWorkshop(undefined);
                            }
                        });
                    }} />
                </div>
            </Overlay>
            </>
        )
    }

    return (
        <div className="w-full flex flex-col items-center">
            <Button onClick={() => {
                setNewWorkshop(true)
            }}><PlusIcon /> Add workshop</Button>
            {newWorkshop && <NewWorkshopOverlay />}
            {editWorkshop && <EditWorkshopOverlay />}
            <Table className="w-full bg-sky-50 dark:bg-gray-700 max-h-[40rem]">
                    <TableHeader className="!sticky top-0 bg-sky-100 dark:bg-black">
                        <TableRow className="text-left max-w-fit">
                            <TableCell className="w-fit">Title</TableCell>
                            <TableCell>Speaker</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-left">
                        {workshopList.filter(s => s).map(workshop => (
                            <TableRow className="text-left" key={workshop.id}>
                                <TableCell className="w-fit">{workshop.title}</TableCell>
                                <TableCell>{workshop.speaker}</TableCell>
                                <TableCell>{new Date(workshop.datetime).toLocaleString()}</TableCell>
                                <TableCell>{workshop.location}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <EllipsisIcon className="cursor-pointer" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => {
                                                setEditWorkshop(workshop)
                                            }}>
                                                Edit
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
        </div>
    )
}