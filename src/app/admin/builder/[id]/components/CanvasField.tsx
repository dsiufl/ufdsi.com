'use client';

import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormField } from '@/types/db';
import { fieldTypeIcons } from '@/lib/form-fields';
import { cn } from '@/lib/utils';

const LAYOUT_TYPES = ['section-header', 'info-banner', 'waiver', 'page-break'];

export default function CanvasField({
    field,
    index,
    isSelected,
    onSelect,
    onMove,
    onDelete,
}: {
    field: FormField;
    index: number;
    isSelected: boolean;
    onSelect: () => void;
    onMove: (dragIndex: number, hoverIndex: number) => void;
    onDelete: () => void;
}) {
    const Icon = fieldTypeIcons[field.type];
    const ref = useRef<HTMLDivElement>(null);

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'canvas-field',
        item: () => ({ index }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }), [index]);

    const [, drop] = useDrop(() => ({
        accept: 'canvas-field',
        hover: (item: { index: number }) => {
            if (item.index !== index) {
                onMove(item.index, index);
                item.index = index;
            }
        },
    }), [index, onMove]);

    drag(drop(ref));

    return (
        <div
            ref={ref}
            onClick={onSelect}
            className={cn(
                'group relative cursor-pointer rounded-lg border-2 p-4 transition-all',
                isSelected ? 'border-[#FF5722] bg-[#FF5722]/5' : 'border-border bg-card hover:border-[#FF5722]/50',
                isDragging && 'opacity-50',
                field.width === 'half' ? 'col-span-1' : 'col-span-2'
            )}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{field.label || 'Untitled Field'}</span>
                    {field.required && <span className="text-destructive">*</span>}
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            </div>
            {!LAYOUT_TYPES.includes(field.type) && (
                <div className="mt-2 text-sm text-muted-foreground">
                    {field.placeholder || 'No placeholder'}
                </div>
            )}
            {field.helpText && (
                <div className="mt-1 text-xs text-muted-foreground">{field.helpText}</div>
            )}
        </div>
    );
}
