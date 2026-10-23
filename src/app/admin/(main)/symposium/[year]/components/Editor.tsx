'use client';

import { useContext, useEffect, useState } from "react";
import { AgendaItem, type Speaker, type Symposium } from "@/types/db";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Overlay from "@/components/Overlay/Overlay";
import EditSpeakerOverlay from "./EditSpeakerOverlay";
import { Calendar, DeleteIcon, EllipsisIcon, PlusIcon } from "lucide-react";
import { PageHeader, Panel } from "../../../components/PageHeader";
import { Calendar as CalendarElement } from "@/components/ui/calendar";
import { Spinner } from "@/components/ui/spinner";
import { createUserClient } from "@/lib/supabase/client";
import NewSpeakerOverlay from "./NewSpeakerOverlay";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { AlertContext } from "@/app/AlertProvider";
import TableCellCustom from "./TableCellCustom";


const KeynoteSpeaker = ({ speaker }: { speaker: Speaker }) => (
    <div className="flex w-full items-center gap-3">
        <div className="is-round relative size-14 shrink-0 overflow-hidden rounded-full bg-muted">
            {speaker.cover && <Image src={speaker.cover} alt="" fill sizes="56px" className="object-cover" />}
        </div>
        <div className="min-w-0">
            <p className="truncate font-medium">{speaker.name}</p>
            <p className="truncate text-sm text-muted-foreground">{speaker.affiliation}</p>
            <p className="line-clamp-2 text-sm text-muted-foreground">{speaker.title}</p>
        </div>
    </div>
);

export default function Editor({symposium, speakers}: {
    symposium: Symposium,
    speakers: Speaker[],
}) {
    const alertCtx = useContext(AlertContext);
    const [keynote, setKeynote] = useState<Speaker | undefined>(speakers.find(s => s.id === symposium.keynote))
    const [newSpeakers, setNewSpeakers] = useState<Speaker[]>(speakers);
    const [newDate, setNewDate] = useState<Date>(new Date(symposium.date));
    const [diffs, setDiffs] = useState<Speaker[]>([]);
    const [changed, setChanged] = useState<boolean>(false);
    const [editSpeakerOverlay, setEditSpeakerOverlay] = useState<Speaker | undefined>(undefined);
    const [newSpeakerOverlay, setNewSpeakerOverlay] = useState<boolean>(false);
    const [saveState, setSaveState] = useState<"unsaved" | "saving" | "saved">("unsaved");
    const [agenda, setAgenda] = useState<AgendaItem[]>(symposium.agenda ?? []);
    const supabase = createUserClient();
    useEffect(() => {
        if (!symposium.agenda) {
            symposium.agenda = [];
        }
    }, [])
    useEffect(() => {
        const ogKeynote = speakers.find(s => s.id === symposium.keynote)
        if (newSpeakers !== speakers || keynote !== ogKeynote || symposium.agenda !== agenda) {
            console.log("changed")
            setChanged(true);
            setSaveState("unsaved");
        } else {
            setChanged(false);
        }
    }, [newSpeakers, keynote, speakers, symposium.keynote, agenda])


    return (
        <>
        <TooltipProvider>
        <div className="admin-page">
        <PageHeader
            label="Symposium"
            title={`Spring Symposium ${symposium.year}`}
            description="Changes stay local until you press Save at the bottom of the screen."
        />
        {
            newSpeakerOverlay && (
                <NewSpeakerOverlay
                    symposium={symposium.year} 
                    close={() => setNewSpeakerOverlay(false)} 
                    save={(speaker: Speaker) => {
                            setDiffs(prev => {
                                const idx = prev.findIndex(s => s.id === speaker.id);
                                if (idx !== -1) {
                                    prev[idx] = speaker;
                                    return prev;
                                }
                                return [...prev, speaker];
                            })
                        }}  
                />)
        }
        {
            editSpeakerOverlay && (
                <EditSpeakerOverlay 
                    save={(speaker: Speaker) => {
                        const exists = newSpeakers.find(s => s.id === speaker.id);
                        if (exists) {
                            setNewSpeakers(prev => {
                                prev.splice(prev.findIndex(s => s.id === speaker.id), 1);
                                return prev;
                            });
                        }
                        setDiffs(prev => {
                            const idx = prev.findIndex(s => s.id === speaker.id);
                            if (idx !== -1) {
                                prev[idx] = speaker;
                                return prev;
                            }
                            return [...prev, speaker];
                        })
                    }} 
                    speaker={editSpeakerOverlay} 
                    symposium={symposium.year} 
                    close={() => {setEditSpeakerOverlay(undefined)}}
                />
            )
        }
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <Panel title="Date">
            <div className="px-5 pb-5">
                <DropdownMenu modal={true}>
                    <DropdownMenuTrigger asChild>
                        <button className="flex w-full items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-left text-sm hover:bg-accent">
                            <Calendar className="size-4 text-muted-foreground" />
                            <span>
                                {newDate.toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: '2-digit',
                                })}
                            </span>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <CalendarElement
                            mode="single"
                            defaultMonth={newDate}
                            selected={newDate}
                            
                            onSelect={(e) => {
                                if (e) {
                                    setNewDate(e);
                                    setChanged(true);
                                    setSaveState("unsaved");
                                }
                            }}
                        />
                        
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            </Panel>
            <Panel title="Keynote">
            <div className="px-5 pb-5">
            {keynote ? (
            <div className="flex flex-col items-start gap-3">
                <KeynoteSpeaker speaker={keynote} />
                <DropdownMenu modal={false} dir="ltr" >
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">Change</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => {
                            setEditSpeakerOverlay(keynote);
                        }}>
                            Edit speaker
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                            setKeynote(undefined)
                        }}>
                            Remove keynote
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            ) : 
            <p className="text-sm text-muted-foreground">No keynote yet. Use &ldquo;Set keynote&rdquo; on a speaker below.</p>
        }
            </div>
            </Panel>
        </div>
        <Panel
            title="Speakers"
            meta={[...diffs, ...newSpeakers].filter(s => !s.deleted).length}
            actions={<Button size="sm" onClick={() => setNewSpeakerOverlay(true)}><PlusIcon /> Add speaker</Button>}
        >
        {
            [...diffs, ...newSpeakers].length > 0 && 
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-5">Name</TableHead>
                            <TableHead>Affiliation</TableHead>
                            <TableHead>Title of Talk</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...diffs, ...newSpeakers].filter(s => !s.deleted).map(speaker => (
                            <TableRow className="w-full" key={speaker.id}>
                                <TableCell className="pl-5 font-medium">{speaker.name}{keynote?.id === speaker.id && <span className="admin-pill admin-pill--info admin-pill--plain ml-2">Keynote</span>}</TableCell>
                                <TableCell>{speaker.affiliation}</TableCell>
                                <TableCell>{speaker.title}</TableCell>
                                <TableCell>{speaker.time}</TableCell>
                                <TableCell>{speaker.location}</TableCell>
                                <TableCell>
                                    <DropdownMenu modal={false}>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="admin-row-actions h-8 w-8 text-muted-foreground" aria-label={`Options for ${speaker.name}`}><EllipsisIcon /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => {
                                                setEditSpeakerOverlay(speaker)
                                            }}>
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => {
                                                setNewSpeakers(prev =>  prev.filter(s => s.id !== speaker.id))
                                                setDiffs(prev => {
                                                    if (prev.findIndex(s => s.id === speaker.id) !== -1) return prev; 
                                                    console.log("marking speaker as deleted:", speaker)
                                                    prev.push({...speaker, deleted: true})
                                                    return prev;
                                                })
                                            }}>
                                                Delete
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => {
                                                if (keynote && keynote.id === speaker.id) {
                                                    alertCtx.setAlert('error', "This speaker is currently the keynote. Please select a different keynote before setting this speaker as a regular speaker.")
                                                    const ogKeynote = speakers.find(s => s.id === symposium.keynote)
                                                    setKeynote(ogKeynote);
                                                    return;
                                                }
                                                setKeynote(speaker);
                                            }}>
                                                Set keynote
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
        }
        </Panel>
        <Panel title="Agenda" meta="Click a cell to edit it">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="pl-5">Session</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Time range</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                    
                {agenda && agenda.filter(item => !item.deleted).map((item) => (
                    <TableRow key={item.id}>
                        <TableCellCustom initialActive={item.new ?? false} initialValue={item.session} onSave={(value) => {
                            setAgenda(prev => prev.map(i => i.id === item.id ? {...i, session: value} : i))
                        }} />
                        <TableCellCustom initialValue={item.duration} onSave={(value) => {
                            setAgenda(prev => prev.map(i => i.id === item.id ? {...i, duration: value} : i))
                        }} />
                        <TableCellCustom initialValue={item.time_range} onSave={(value) => {
                            setAgenda(prev => prev.map(i => i.id === item.id ? {...i, time_range: value} : i))
                        }} />
                        <TableCellCustom initialValue={item.description} onSave={(value) => {
                            setAgenda(prev => prev.map(i => i.id === item.id ? {...i, description: value} : i))
                        }} />
                        <TableCell>
                        
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <DeleteIcon className="cursor-pointer" onClick={() => {
                                        setAgenda(prev => prev.map(i => i.id === item.id ? {...i, deleted: true} : i))
                                    }} />
                                </TooltipTrigger>
                                <TooltipContent>
                                    Delete this agenda item
                                </TooltipContent>
                            </Tooltip>
                        </TableCell>
                    </TableRow>
                ))}
                <TableRow>
                    <TableCell colSpan={5} >
                            <div className="w-full flex justify-center items-center" onClick={() => {
                            setAgenda(prev => [...prev, {
                                    id: Math.random().toString(36).slice(2, 9),
                                    session: "New session",
                                    duration: "1h",
                                    time_range: "10:00 - 11:00",
                                    description: "Description of the session",
                                    new: true,
                                }])
                            }}>
                                <Button variant="ghost" size="sm" className="text-muted-foreground"><PlusIcon /> Add session</Button>
                            </div>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
        </Panel>
        {(diffs.length > 0 || changed) && saveState !== 'saved' && 
            <div className="fade-in sticky bottom-4 z-10 mx-auto flex w-fit items-center gap-3 rounded-full border bg-card px-4 py-2 shadow-lg">
                <span className="text-sm text-muted-foreground">Unsaved changes</span>
                {saveState === 'unsaved' ? 
                    <>
                    <Button onClick={() => {
                        setSaveState("saving")

                        const promises = [];
                        if (agenda !== symposium.agenda) {
                            const newAgenda = agenda.map(item => item.new ? {...item, new: undefined} : item).filter(item => !item.deleted);
                            const result = supabase.from('symposiums').update({agenda: newAgenda}).eq('id', symposium.id).then((data) => {
                                if (data.error) {
                                    setSaveState("unsaved");
                                    throw data.error.message;
                                } else symposium.agenda = agenda;
                            })
                            promises.push(result)              
                        }

                        if (diffs.length > 0) {
                            diffs.forEach((speaker) => {
                                if (speaker.deleted) {
                                    const result = supabase.from("speakers").delete().eq('id', speaker.id).single()
                                    promises.push(new Promise((resolve, reject) => {
                                        result.then((data) => {
                                            if (data.error) reject(data.error);
                                            else resolve(data)
                                        })
                                    }))
                                    return;
                                }
                                promises.push(new Promise(async (resolve, reject) => {
                                    if (speaker.cover.startsWith('blob:')) {
                                        const response = await fetch(speaker.cover);
                                        const blob = await response.blob();
                                        const { data,  error } = await supabase
                                            .storage
                                            .from('images')
                                            .upload(`speakers/${symposium.id}/cover_${Math.random().toString(36).slice(2, 9)}.jpg`, blob, {
                                                upsert: true,
                                                contentType: blob.type
                                            });
                                        if (error) {
                                            reject(error);
                                            return;
                                        }
                                        const { data: urlData } = supabase
                                            .storage
                                            .from('images')
                                            .getPublicUrl(data.path);
                                        speaker.cover = urlData.publicUrl;
                                    }
                                    if (speaker.affiliated_logo && speaker.affiliated_logo.startsWith('blob:')) {
                                        const response = await fetch(speaker.affiliated_logo);
                                        const blob = await response.blob();
                                        const { data, error } = await supabase
                                            .storage
                                            .from('images')
                                            .upload(`speakers/${symposium.id}/logo_${Math.random().toString(36).slice(2, 9)}.jpg`, blob, {
                                                upsert: true,
                                                contentType: blob.type
                                            });
                                        if (error) {
                                            reject(error);
                                            return;
                                        }
                                        const { data: urlData } = supabase
                                            .storage
                                            .from('images')
                                            .getPublicUrl(data.path);
                                        speaker.affiliated_logo = urlData.publicUrl;
                                    }
                                    if (speaker.id) {
                                        supabase
                                        .from('speakers')
                                        .update({
                                            name: speaker.name,
                                            affiliation: speaker.affiliation,
                                            title: speaker.title,
                                            description: speaker.description,
                                            cover: speaker.cover,
                                            time: speaker.time,
                                            location: speaker.location,
                                            symposium: symposium.year,
                                        })
                                        .eq('id', speaker.id).then((data) => {
                                            if (data.error) {
                                                reject(data.error);
                                            } else {
                                                resolve(data);
                                            }
                                        })
                                    } else {
                                        supabase
                                        .from('speakers')
                                        .insert({
                                            name: speaker.name,
                                            affiliation: speaker.affiliation,
                                            title: speaker.title,
                                            description: speaker.description,
                                            cover: speaker.cover,
                                            time: speaker.time,
                                            location: speaker.location,
                                            symposium: symposium.year,
                                        }).then((data) => {
                                            if (data.error) reject(data.error);
                                            else resolve(data)
                                        })
                                    }
                                }))
                            });
                            
                        }
                        Promise.all(promises).then(() => {
                            setSaveState("saved");
                        }).catch((error) => {
                            console.error("Error saving speakers:", error);
                            setSaveState("unsaved");
                        });

                        const ogKeynote = speakers.find(s => s.id === (symposium.keynote ?? ''));
                        if (keynote !== ogKeynote || newDate.getTime() !== new Date(symposium.date).getTime()) {
                            supabase
                                .from('symposiums')
                                .update({
                                    keynote: keynote ? keynote.id : null,
                                    date: newDate.toISOString(),
                                })
                                .eq('id', symposium.id)
                                .then((data) => {
                                    if (data.error) {
                                        console.error("Error saving keynote:", data.error);
                                        setSaveState("unsaved");
                                        return;
                                    }
                                    speakers = [...diffs,...newSpeakers];
                                    symposium.keynote = keynote ? keynote.id : null;
                                    symposium.date = newDate.toISOString() as unknown as Date;
                                    setSaveState("saved");
                                })
                        }
                        
                    }}>
                        Save
                    </Button>
                    <Button variant="outline" onClick={() => {
                        const ogKeynote = speakers.find(s => s.id === symposium.keynote)
                        if (keynote !== ogKeynote) setKeynote(ogKeynote);
                        if (newSpeakers !== speakers) setNewSpeakers(speakers);
                        if (newDate.getTime() !== new Date(symposium.date).getTime()) {
                            setNewDate(new Date(symposium.date));
                            setChanged(false);
                        }
                        if (agenda !== symposium.agenda) setAgenda(symposium.agenda ?? []);
                    }}>Revert</Button>
                    </>
                    :
                    <Spinner /> 
                }
            </div>
        }
        </div>
        </TooltipProvider>
        </>
    )
}