'use client';

import { useEffect, useRef, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { ROLES } from "@/lib/roles";

// Deliberately not built on Radix Popover: PopoverContent renders through a
// Portal to document.body, making it a DOM *sibling* of an enclosing Dialog
// rather than a descendant. A Dialog's focus trap only allows focus to stay
// within its own content subtree, so it fights a portaled Popover for focus
// on every keystroke -- typing into the filter input never actually
// registered. Rendering the dropdown inline avoids that entirely, and opens
// downward for free since it's just normal document flow below the trigger.
export function RoleCombobox({
    value,
    onChange,
    disabled,
    id,
}: {
    value?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    id?: string;
}) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        function onPointerDown(e: PointerEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("pointerdown", onPointerDown);
        return () => document.removeEventListener("pointerdown", onPointerDown);
    }, [open]);

    return (
        <div ref={containerRef} className="relative">
            <Button
                id={id}
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                disabled={disabled}
                className="w-full justify-between font-normal"
                onClick={() => setOpen((o) => !o)}
            >
                {value || <span className="text-muted-foreground">Select a role</span>}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
            {open && (
                <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
                    <Command>
                        <CommandInput placeholder="Type to filter roles…" autoFocus />
                        <CommandList>
                            <CommandEmpty>No matching role.</CommandEmpty>
                            <CommandGroup>
                                {ROLES.map((role) => (
                                    <CommandItem
                                        key={role}
                                        value={role}
                                        onSelect={() => {
                                            onChange(value === role ? "" : role);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === role ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {role}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </div>
            )}
        </div>
    );
}
