'use client';

import { useEffect, useState } from "react";
import type { Speaker, Symposium } from "@/types/db";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Overlay from "@/components/Overlay/Overlay";
import EditSpeakerOverlay from "./EditSpeakerOverlay";
import { EllipsisIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { createUserClient } from "@/lib/supabase/client";
import NewSpeakerOverlay from "./NewSpeakerOverlay";


const KeynoteSpeaker = ({ speaker, onClick }: { speaker: Speaker; onClick?: () => void }) => (
    <article 
      className="group cursor-pointer transition-all duration-300 mb-4 w-full"
      onClick={onClick}
    >
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl shadow-lg transition-shadow duration-300 overflow-hidden border border-purple-200 dark:border-purple-800">
        <div className="md:flex">
          <div className="md:w-1/3 relative">
            <Image
              src={speaker.cover}
              alt={speaker.name}
              fill
              className="object-cover transition-transform duration-300"
              priority
              sizes="100%, 33vh"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>
          
          <div className="md:w-2/3 p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-purple-600 transition-colors duration-200">
              {speaker.name}
            </h2>
            
            <p className="text-lg text-purple-600 dark:text-purple-400 mb-4 font-medium">
              {speaker.affiliation}
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {speaker.title}
            </h3>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              📅 {speaker.time} • 📍 {speaker.location}
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 line-clamp-4">
              {speaker.description}
            </p>
          </div>
        </div>
      </div>
    </article>
);
export default function Editor({symposium, speakers}: {
    symposium: Symposium,
    speakers: Speaker[]
}) {
    const [keynote, setKeynote] = useState<Speaker | undefined>(speakers.find(s => s.id === symposium.keynote))
    const [newSpeakers, setNewSpeakers] = useState<Speaker[]>(speakers);
    const [diffs, setDiffs] = useState<Speaker[]>([]);
    const [changed, setChanged] = useState<boolean>(false);
    const [editSpeakerOverlay, setEditSpeakerOverlay] = useState<Speaker | undefined>(undefined);
    const [newSpeakerOverlay, setNewSpeakerOverlay] = useState<boolean>(false);
    const [saveState, setSaveState] = useState<"unsaved" | "saving" | "saved">("unsaved");
    const supabase = createUserClient();
    useEffect(() => {
        const ogKeynote = speakers.find(s => s.id === symposium.keynote)
        if (newSpeakers !== speakers || keynote !== ogKeynote ) {
            console.log("changed")
            setChanged(true);
            setSaveState("unsaved");
        } else {
            setChanged(false);
        }
    }, [newSpeakers, keynote, speakers, symposium.keynote])
    return (
        <>
        <div className="w-full flex justify-center">
            <h2>Editing: DSI Spring Symposium {symposium.id}</h2>
        </div>
        {
            newSpeakerOverlay && (
                <NewSpeakerOverlay
                    symposium={symposium.id} 
                    close={() => setNewSpeakerOverlay(false)} 
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
                    symposium={symposium.id} 
                    close={() => {setEditSpeakerOverlay(undefined)}}
                />
            )
        }
        <div className="relative w-full h-fit min-h-screen lg:h-[80%] rounded-xl px-[10%] py-10 bg-gray-200 dark:bg-[#000000]/70">
           <h2>Keynote</h2>
           {keynote ? (
            <div className="flex flex-col items-center justify-center">
                <KeynoteSpeaker speaker={keynote} />
                <DropdownMenu modal={false} dir="ltr" >
                    <DropdownMenuTrigger asChild>
                        <Button>Edit</Button>
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
            <div className="w-full flex flex-col place-items-center">
                <p>No keynote speaker selected.</p>
                { newSpeakers.length > 0 && <Button>Select a keynote speaker</Button>}
            </div>
        }
        <h2>Speakers</h2>
        <Button onClick={() => {
            setNewSpeakerOverlay(true);
        }}>Add a new speaker</Button>
        {
            newSpeakers.length > 0 && 
                <Table className="w-full bg-sky-50 dark:bg-gray-700 max-h-[40rem]">
                    <TableHeader className="!sticky top-0 bg-sky-100 dark:bg-black">
                        <TableRow>
                            <TableHead>Name</TableHead>
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
                                <TableCell>{speaker.name}</TableCell>
                                <TableCell>{speaker.affiliation}</TableCell>
                                <TableCell>{speaker.title}</TableCell>
                                <TableCell>{speaker.time}</TableCell>
                                <TableCell>{speaker.location}</TableCell>
                                <TableCell>
                                    <DropdownMenu modal={false}>
                                        <DropdownMenuTrigger asChild>
                                            <EllipsisIcon className="cursor-pointer" />
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
                                                    prev.push({...speaker, deleted: true})
                                                    return prev;
                                                })
                                            }}>
                                                Delete
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => {
                                                if (keynote.id === speaker.id) {
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
        {(diffs.length > 0 || changed) && saveState !== 'saved' && 
            <div className="fixed bottom-0 w-full left-0 p-4 fade-in flex gap-2 justify-center">
                {saveState === 'unsaved' ? 
                    <>
                    <Button onClick={() => {
                        setSaveState("saving")
                        if (diffs.length > 0) {
                            const promises = [];
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
                                        const { data, error } = await supabase
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
                                        console.log(urlData);
                                        speaker.cover = urlData.publicUrl;
                                    }
                                    if (speaker.affiliated_logo.startsWith('blob:')) {
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
                                        console.log(urlData);
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
                                            location: speaker.location
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
                                            location: speaker.location
                                        }).then((data) => {
                                            if (data.error) reject(data.error);
                                            else resolve(data)
                                        })
                                    }
                                }))
                            });
                            Promise.all(promises).then(() => {
                                setSaveState("saved");
                            }).catch((error) => {
                                console.error("Error saving speakers:", error);
                                setSaveState("unsaved");
                            });
                        }
                        const ogKeynote = speakers.find(s => s.id === symposium.keynote)
                        if (keynote !== ogKeynote) {
                            console.log("Keynote", keynote)
                            supabase
                                .from('symposiums')
                                .update({
                                    keynote: keynote ? keynote.id : null
                                })
                                .eq('id', symposium.id)
                                .then((data) => {
                                    if (data.error) {
                                        console.error("Error saving keynote:", data.error);
                                        setSaveState("unsaved");
                                        return;
                                    }
                                    speakers = [...diffs,...newSpeakers];
                                    symposium.keynote = keynote.id
                                    setSaveState("saved");
                                })
                        }
                        
                    }}>
                        Save
                    </Button>
                    <Button onClick={() => {
                        const ogKeynote = speakers.find(s => s.id === symposium.keynote)
                        if (keynote !== ogKeynote) setKeynote(ogKeynote);
                        if (newSpeakers !== speakers) setNewSpeakers(speakers);
                    }}>Revert</Button>
                    </>
                    :
                    <Spinner /> 
                }
            </div>
        }
        </div>
        </>
    )
}