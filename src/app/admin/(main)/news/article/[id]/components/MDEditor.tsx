import React, { useContext, useState } from "react";
import { 
  handleKeyDown, 
  shortcuts, 
  TextAreaCommandOrchestrator,
  getCommands,
} from '@uiw/react-md-editor';
import { useRef  } from "react";
import { Textarea } from "@/components/ui/textarea";
import Markdown from "react-markdown";
import { BoldIcon, Heading1, Heading1Icon, Heading2Icon, Heading3Icon, ImageUpIcon, ListIcon, ListOrderedIcon } from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import MarkdownWrapper from "@/components/MarkdownWrapper";
import { SupabaseContext } from "@/app/SupabaseProvider";
import TurndownService from "turndown";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { AlertContext } from "@/app/AlertProvider";


export default function MDEditor({ value, onChange }) {
  const textareaRef = React.useRef(null);
  const orchestratorRef = React.useRef<TextAreaCommandOrchestrator | null>(null);
  const supabaseCtx = useContext(SupabaseContext)
  const turndownRef = useRef(new TurndownService());
  const alertCtx = useContext(AlertContext);
  const ref = useRef<HTMLInputElement>(null);
  const [ URLWindow, setURLWindow ] = useState<boolean>(false);
  
  React.useEffect(() => {
    if (textareaRef.current) {
      orchestratorRef.current = new TextAreaCommandOrchestrator(textareaRef.current);
    }
  }, []);

  const onKeyDown = (e) => {
    handleKeyDown(e, 2, false);
    if (orchestratorRef.current) {
      shortcuts(e, getCommands(), orchestratorRef.current);
    }
  };

  const iconFuncs = [
    {
        icon: (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div>
                    <ImageUpIcon />
                    <Input type="file" accept="image/*" className="hidden" ref={ref} onChange={(e) => {
                        const file = e.target.files[0];
                        console.log(e.target.files);
                        if (!file) return;
                        alertCtx.setAlert("info", "Uploading image...");
                        supabaseCtx.upload(`images/${crypto.randomUUID()}`, file).then((res) => {
                            if (typeof res !== 'string' && res.error && !res.error.includes("already exists")) {
                                console.error("Error uploading image:", res.error);
                                alertCtx.setAlert("error", "Error uploading image: " + res.error);
                                return;
                            }   
                            const markdownImage = `![${file.name}](${res})`;
                            onChange({target: {value: `${value}\n${markdownImage}`}});
                            alertCtx.clearAlert();
                        });
                    }}/>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => ref.current?.click()} className="hover:cursor-pointer hover:bg-amber-50 hover:dark:bg-gray-700/30" >Upload image</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                        setURLWindow(true)
                    }} className="hover:cursor-pointer hover:bg-amber-50 hover:dark:bg-gray-700/30" >Set image URL</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
        name: "Upload Image",
        func: () => {
            
        }
    },
    {
        icon: <BoldIcon />,
        name: "Bold",
        func: () => {
            if (orchestratorRef.current) {
                orchestratorRef.current.executeCommand(getCommands()[0]);
            }
        }
    },
    {
        icon: <Heading1Icon />,
        name: "Heading 1",
        func: () => {
            if (orchestratorRef.current) {                
                orchestratorRef.current.executeCommand(getCommands()[4].children[1]);
            }
        }
    },
    {
        icon: <Heading2Icon />,
        name: "Heading 2",
        func: () => {
            if (orchestratorRef.current) {
                orchestratorRef.current.executeCommand(getCommands()[4].children[2]);
            }
        }
    },
    {
        icon: <Heading3Icon />,
        name: "Heading 3",
        func: () => {
            if (orchestratorRef.current) {
                orchestratorRef.current.executeCommand(getCommands()[4].children[3]);
            }
        }
    },
    {
        icon: <ListIcon />,
        name: "Bullet List",
        func: () => {
            console.log(getCommands())
            if (orchestratorRef.current) {
                orchestratorRef.current.executeCommand(getCommands()[14]);
            }
        }
    },
    {
        name: "Numbered List",
        icon: <ListOrderedIcon />,
        func: () => {
            if (orchestratorRef.current) {
                orchestratorRef.current.executeCommand(getCommands()[15]);
            }
        }   
    }
  ];

  return (
    <div className="w-full h-full flex flex-col border border-black rounded-xl shadow-xl overflow-clip">
        <div className="flex h-fit p-2 w-full bg-gray-700/20 gap-2">
            {
                iconFuncs.map((item, index) => (
                    <Tooltip key={index}>
                        <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" className="text-black dark:text-white !p-1" onClick={item.func}>
                                {item.icon}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-200 dark:bg-gray-700 dark:text-white">
                            {item.name}
                        </TooltipContent>
                    </Tooltip>
                ))
            }
        </div>
        <div className="h-full w-full flex justify-between gap-4">
            <Textarea
                ref={textareaRef}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                className="w-1/2 shadow-xl"
                onPaste={async (e) => {
                    console.log("Pasted content:", e.clipboardData);
                    const items = e.clipboardData.items;
                    for (const item of items) {
                        if (item.type.startsWith('image/')) {
                            const file = item.getAsFile();
                            const res = await supabaseCtx.upload(`public/${crypto.randomUUID()}`, file);
                            if (typeof res !== 'string' && res.error && !res.error.includes("already exists")) {
                                console.error("Error uploading image:");
                                return;
                            }   
                            const markdownImage = `![${file.name}](${res})`;
                            onChange({target: {value: `${value}\n${markdownImage}`}}); // Append the markdown image syntax to the existing content
                         }
                         if (item.type === "text/html") {
                            e.preventDefault();
                            item.getAsString((data) => {
                                const md = turndownRef.current.turndown(data)
                                onChange({target: {value: `${value}\n${md}`}});
                            });
                         }
                    }
                            
                }}
            />
        <div className="w-[50%] h-full">
            <p>Preview</p>
            <MarkdownWrapper>
                {value}
            </MarkdownWrapper>
        </div>
        </div>
        
    

    </div>
  );
}