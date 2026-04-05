'use client';

import { useDrag } from 'react-dnd';
import { FieldType } from '@/types/db';
import { fieldTypeIcons } from '@/lib/form-fields';
import { cn } from '@/lib/utils';

export default function DraggableField({ type, label, disabled }: { type: FieldType; label: string; disabled?: boolean }) {
    const Icon = fieldTypeIcons[type];
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'field',
        item: { type, label },
        canDrag: !disabled,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={drag}
            className={cn(
                'flex items-center gap-2 rounded-md border border-border bg-card p-2.5 text-sm transition-all',
                disabled ? 'cursor-not-allowed opacity-50' : 'cursor-move hover:border-[#FF5722] hover:bg-accent',
                isDragging && 'opacity-50'
            )}
            title={disabled ? 'This field type is not yet available' : undefined}
        >
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">{label}</span>
        </div>
    );
}
