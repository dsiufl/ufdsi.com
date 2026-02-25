'use client';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Article } from "@/types/db";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import MDEditor from "@uiw/react-md-editor";
import { useContext, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SupabaseContext } from "@/app/SupabaseProvider";
import { Spinner } from "@/components/ui/spinner";
import { ArrowDownIcon, Calendar as CalendarIcon} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useRouter } from "next/navigation";
import Overlay from "@/components/Overlay/Overlay";
export default function Editor({article}: {article: Article}) {
    const [content, setContent] = useState<string>(article.content || "## Article content");
    const [title, setTitle] = useState<string>(article.title || "New article");
    const [pendingTitle, setPendingTitle] = useState<string>(article.title || "New article");
    const [newDate, setNewDate] = useState<Date>(article.created_at ? new Date(article.created_at) : new Date());
    const [titleClicked, setTitleClicked] = useState<boolean>(false);
    const [category, setCategory] = useState<string>(article.category || "Articles");
    const [ descriptionClicked, setDescriptionClicked ] = useState<boolean>(false);
    const [ description, setDescription ] = useState<string>(article.summary);
    const [ pendingDescription, setPendingDescription ] = useState<string>(article.summary);
    const [ changed, setChanged ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ cover, setCover ] = useState<string>(article.cover || "");
    const [ tempURL, setTempURL ] = useState<string>(cover);
    const [ URLWindow, setURLWindow ] = useState<boolean>(false);

    const router = useRouter();
    const supabaseCtx = useContext(SupabaseContext);
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (
            content !== article.content 
            || title !== article.title 
            || (!article.created_at || newDate.toISOString() !== new Date(article.created_at).toISOString())
            || category !== article.category
            || description !== article.summary
        ) {
            setChanged(true);
        } else {
            setChanged(false);
        }
    }, [content, article.content, title, article.title, newDate, article.created_at, category, article.category, description, article.summary]);
    return (
        <>
        {
            URLWindow &&
                <Overlay title="Set Image URL" close={() => {setURLWindow(false)}}>
                <div className="flex flex-col gap-4">
                    <Input value={cover} onChange={(e) => setTempURL(e.currentTarget.value)} onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key == "Enter") {
                            setCover(tempURL);
                            setURLWindow(false);
                        }
                    }} />
                    <Button onClick={() => {
                        setCover(tempURL)
                        setURLWindow(false);
                    }}>Set URL</Button>
                </div>
            </Overlay>
        }
        <div className="px-10 flex items-center flex-col mb-2">
            <div className="flex justify-center items-center mb-2">
                <p className="!mb-0">{article.id ? "Editing" : "Creating new"}</p>
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-4">
                            {category === "Articles" ? "Article" : category } <ArrowDownIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem className="hover:cursor-pointer hover:bg-amber-50 hover:dark:bg-gray-700/30" onClick={() => setCategory("Articles")}>Article</DropdownMenuItem>
                        <DropdownMenuItem className="hover:cursor-pointer hover:bg-amber-50 hover:dark:bg-gray-700/30" onClick={() => setCategory("Competition")}>Competition</DropdownMenuItem>
                        <DropdownMenuItem className="hover:cursor-pointer hover:bg-amber-50 hover:dark:bg-gray-700/30" onClick={() => setCategory("Workshop")}>Workshop Article</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            
            {
                !titleClicked ?
                <h1 onClick={() => setTitleClicked(true)} className="text-4xl font-bold cursor-pointer hover:underline">{title}</h1>
                :
                <Input value={pendingTitle} onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        setTitleClicked(false);
                        setTitle((e.target as HTMLInputElement).value);
                    } else if (e.key === "Escape") {
                        setTitleClicked(false);
                        setPendingTitle(title);
                    }
                }} onChange={(e) => setPendingTitle((e.target as HTMLInputElement).value)} className="text-4xl font-bold" autoFocus onBlur={() => setTitleClicked(false)} />
            }
            
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Image
                        src={cover|| "/images/logo/hd-transparent-dsi-logo.png"}
                        alt={article.title}
                        width={600}
                        height={400}
                        className="rounded-xl"
                        unoptimized
                    />
                    <Input ref={ref} type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (!file || !supabaseCtx) return;
                        setCover(URL.createObjectURL(file));
                    }} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => ref.current?.click()} className="hover:cursor-pointer hover:bg-amber-50 hover:dark:bg-gray-700/30" >Upload image</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                        setURLWindow(true)
                        console.log("help?")
                    }} className="hover:cursor-pointer hover:bg-amber-50 hover:dark:bg-gray-700/30" >Set image URL</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

                <DropdownMenu modal={true}>
                    <DropdownMenuTrigger asChild>
                        <div className="hover:cursor-pointer hover:underline flex gap-1">
                            <CalendarIcon />
                            <p>
                                {newDate.toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: '2-digit',
                                })}
                            </p>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <Calendar
                            mode="single"
                            defaultMonth={newDate}
                            className="!text-black"
                            selected={newDate}
                            
                            onSelect={(e) => e ? setNewDate(e) : null}
                        />
                        
                    </DropdownMenuContent>
                </DropdownMenu>
            {!descriptionClicked ?
                <p onClick={() => setDescriptionClicked(true)} className="text-gray-600 dark:text-gray-400 mt-2 cursor-pointer hover:underline">{description || "Article description"}</p>
                :
                <Input value={pendingDescription} onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        setDescriptionClicked(false);
                        setDescription((e.target as HTMLInputElement).value);
                    } else if (e.key === "Escape") {
                        setDescriptionClicked(false);
                        setPendingDescription(article.summary);
                        setDescription(article.summary || "Article description");
                    }
                }} onChange={(e) => setPendingDescription((e.target as HTMLInputElement).value)} className="text-gray-600 dark:text-gray-400 mt-2" autoFocus onBlur={() => setDescriptionClicked(false)} />
            }
            
        </div>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-md p-4 w-[100%] min-h-[50vh]">
            <MDEditor
                value={content}
                onChange={(value) => setContent(value)}
                className="size-full h-[100%]"
            />
        </div>
        {
            changed && 
            <div className="fade-in flex w-full fixed bottom-0 gap-4 items-center justify-center py-4">
                <Button onClick={async () => {
                    setLoading(true);
                    const data = {
                        title,
                        content,
                        category,
                        created_at: newDate.toISOString(),
                        summary: description,
                        cover,
                    }
                    if (cover && cover.startsWith("blob:")) {
                        const blob = await fetch(cover).then((res) => res.blob());
                        const { data: uploadData, error: uploadError } = await supabaseCtx?.storage.from("images").upload(`news/cover-${Date.now()}.png`, blob);
                        if (uploadError) {
                            console.error("Error uploading image:", uploadError);
                            return;
                        }
                    }
                    const { data: newRow, error }: { data?: Article, error: any} = article.id ? await supabaseCtx?.from('news').update(data).eq('id', article.id) : await supabaseCtx?.from('news').insert(data).select().single();
                    if (error) {
                        console.error("Error updating article:", error);
                    }
                    if (newRow && newRow.id && !article.id) {
                        console.log("New article created with ID:", newRow.id);
                        router.push("/admin/news/article/" + newRow.id);
                        return;
                    }

                    setLoading(false);
                    article.title = title;
                    article.content = content;
                    article.category = category;
                }} disabled={loading}>
                    {loading ? <Spinner /> : "Save"}
                </Button>
                {
                    article.id && <Button onClick={() => {
                    setCover(article.cover);
                    setTitle(article.title);
                    setContent(article.content);
                    setNewDate(new Date(article.created_at));
                    setCategory(article.category);
                    setDescription(article.summary);
                    setPendingDescription(article.summary);
                }}>Revert</Button>
                }
            </div>
        }
        </>
    )
}