'use client';
import { useContext, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EllipsisIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Overlay from "@/components/Overlay/Overlay";
import { createUserClient } from "@/lib/supabase/client";
import { Spinner } from "@/components/ui/spinner";
import { Project } from "@/types/db";
import EditProject from "./EditProject";
import { AlertContext } from "@/app/AlertProvider";
import { error } from "console";

export default function Editor({projects}: {projects: Project[]}) {
    const [projectList, setprojectList] = useState<Project[]>(projects);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [newProject, setNewProject] = useState<boolean>(false);
    const [editProject, setEditProject] = useState<Project | undefined>(undefined);
    const [deleteProject, setDeleteProject] = useState<Project | undefined>(undefined);
    const supabase = createUserClient();
    const alertCtx = useContext(AlertContext)
    const NewProjectOverlay = () => {
        return (
            <Overlay close={() => setNewProject(false)} title="Add New Project">
                <div>
                    <EditProject submit={async (data: Project) => {
                        if (data.cover && data.cover.includes("blob")) {
                            const blob = await fetch(data.cover).then(r => r.blob());
                            const { data: result, error } = await supabase.storage.from('images')
                            .upload(`projects/${data.title.replace(/\s+/g, '_').toLowerCase()}.jpg`, blob, {
                                upsert: true,
                                contentType: blob.type
                            });
                            if (error) {
                                console.error("Error uploading image:", error);
                                alertCtx.setAlert("error", "Error uploading image" + error.message)
                                return;
                            } else {
                                const { data: urlData } = supabase.storage.from('images')
                                .getPublicUrl(`projects/${data.title.replace(/\s+/g, '_').toLowerCase()}.jpg`);
                                data.cover = urlData.publicUrl;
                            }
                        }
                        await supabase.from('projects').insert(data).then(async (res) => {
                            if (res.error) {
                                console.error("Error adding project:", res.error);
                                alertCtx.setAlert("error","Error adding project: " + res.error)
                            } else {
                                console.log("Project added:", data);
                                setprojectList([...projectList, data]);
                                setNewProject(false);
                            }
                        });
                    }} />
                </div>
            </Overlay>
        );
    }
    const EditProjectOverlay = () => {
        return (
            <>
            
            <Overlay close={() => setEditProject(undefined)} title="Edit Project">
                <div>
                    
                    <EditProject project={editProject!} submit={async (data: Project) => {
                        if (data.cover && data.cover.includes("blob")) {
                            const blob = await fetch(data.cover).then(r => r.blob());
                            const { data: result, error } = await supabase.storage.from('images')
                            .upload(`projects/${data.title.replace(/\s+/g, '_').toLowerCase()}.jpg`, blob, {
                                upsert: true,
                                contentType: blob.type
                            });
                            if (error) {
                                console.error("Error uploading image:", error);
                                alertCtx.setAlert("error", "Error uploading image" + error.message)
                                return;
                            } else {
                                const { data: urlData } = supabase.storage.from('images')
                                .getPublicUrl(`projects/${data.title.replace(/\s+/g, '_').toLowerCase()}.jpg`);
                                data.cover = urlData.publicUrl;
                            }
                        }
                        await supabase.from('projects').update(data).eq('id', data.id).then(async (res) => {
                            if (res.error) {
                                console.error("Error updating project:", res.error);
                                alertCtx.setAlert("error", "Error updating project" + res.error)
                            } else {
                                console.log("Project updated:", data);
                                setprojectList(projectList.map(w => w.id === data.id ? data : w));
                                setEditProject(undefined);
                            }
                        });
                    }} />
                </div>
            </Overlay>
            </>
        )
    }
    const DeleteProjectOverlay = () => {
        const [ loading, setLoading ] = useState(false);
        return (
            <Overlay close={() => setDeleteProject(undefined)} title="Delete Project">
                <div className="flex flex-col items-center gap-4">
                    <p>Are you sure you want to delete the project {deleteProject?.title}?</p>
                    <div className="flex gap-4">
                        <Button variant="destructive" onClick={async () => {
                            setLoading(true);
                            await supabase.from('projects').delete().eq('id', deleteProject?.id).then(res => {
                                if (res.error) {
                                    console.error("Error deleting project:", res.error);
                                    alertCtx.setAlert("error", "Error deleting project:" + res.error)
                                } else {
                                    console.log("Project deleted:", deleteProject);
                                    setprojectList(projectList.filter(w => w.id !== deleteProject?.id));
                                    setDeleteProject(undefined);
                                }
                            });
                            setLoading(false);
                        }}>{loading ? <Spinner /> : "Delete"}</Button>
                        <Button onClick={() => setDeleteProject(undefined)}>Cancel</Button>
                    </div>
                </div>  
            </Overlay>
        )
    }
    return (
        <div className="w-full flex flex-col items-center">
            <Button onClick={() => {
                setNewProject(true)
            }}><PlusIcon /> Add project</Button>
            {newProject && <NewProjectOverlay />}
            {editProject && <EditProjectOverlay />}
            <Table className="w-full bg-sky-50 dark:bg-gray-700 max-h-[40rem]">
                    <TableHeader className="!sticky top-0 bg-sky-100 dark:bg-black">
                        <TableRow className="text-left max-w-fit">
                            <TableCell className="w-fit">Title</TableCell>
                            <TableCell>Lead</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-left">
                        {projectList.filter(s => s).map(project => (
                            <TableRow className="text-left" key={project.id}>
                                <TableCell className="w-fit">{project.title}</TableCell>
                                <TableCell>{project.lead}</TableCell>
                               
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <EllipsisIcon className="cursor-pointer" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => {
                                                setEditProject(project)
                                            }}>
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => {
                                                setEditProject(project)
                                            }}>
                                                Delete
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