"use client";

import { Input } from "@/components/ui/input";
import { TableCell } from "@/components/ui/table";
import { useState } from "react";

export default function TableCellCustom({onSave, initialValue, initialActive}: {onSave: (value: string) => void, initialValue: string, initialActive?: boolean}) {
    const [value, setValue] = useState(initialValue);
    const [active, setActive] = useState(initialActive || false);

    const handleSave = () => {
        onSave(value);
        setActive(false);
    };

    return (
        <TableCell>
            {active ? (
                <div className="flex items-center space-x-2">
                    <Input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onSave(value);
                                setActive(false);
                            } else if (e.key === 'Escape') {
                                setActive(false);
                                setValue(initialValue);
                            }
                        }}
                        onBlur={handleSave}
                        autoFocus
                    />
                </div>
            ) : (
                <div onClick={() => setActive(true)}>
                    {value || "Click to edit"}
                </div>
            )}
        </TableCell>
    )
}