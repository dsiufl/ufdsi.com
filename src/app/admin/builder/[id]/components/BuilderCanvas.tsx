'use client';

import { useState, useCallback, useRef } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
    Check,
    Type,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FormField, FieldType } from '@/types/db';
import { fieldCategories, createField } from '@/lib/form-fields';
import DraggableField from './DraggableField';
import CanvasField from './CanvasField';
import FieldProperties from './FieldProperties';

interface BuilderCanvasProps {
    initialFields: FormField[];
    initialTitle: string;
    onSave: (fields: FormField[], title: string) => Promise<boolean>;
    topBar: React.ReactNode;
    autoSaveStatus: 'saved' | 'saving' | 'idle' | 'error';
    onAutoSaveStatusChange: (status: 'saved' | 'saving' | 'idle' | 'error') => void;
}

function BuilderCanvasContent({
    initialFields,
    initialTitle,
    onSave,
    topBar,
    autoSaveStatus,
    onAutoSaveStatusChange,
}: BuilderCanvasProps) {
    const [formTitle, setFormTitle] = useState(initialTitle);
    const [fields, setFields] = useState<FormField[]>(initialFields);
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
    const saveTimeout = useRef<NodeJS.Timeout | null>(null);

    const selectedField = fields.find((f) => f.id === selectedFieldId);

    const save = useCallback(async (newFields: FormField[], newTitle?: string) => {
        onAutoSaveStatusChange('saving');
        if (saveTimeout.current) clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(async () => {
            const ok = await onSave(newFields, newTitle ?? formTitle);
            onAutoSaveStatusChange(ok ? 'saved' : 'error');
        }, 800);
    }, [onSave, formTitle, onAutoSaveStatusChange]);

    const [, drop] = useDrop(() => ({
        accept: 'field',
        drop: (item: { type: FieldType; label: string }) => {
            const newField = createField(item.type, item.label);
            const next = [...fields, newField];
            setFields(next);
            setSelectedFieldId(newField.id);
            save(next);
        },
    }), [fields, save]);

    const moveField = useCallback((dragIndex: number, hoverIndex: number) => {
        setFields(prev => {
            const next = [...prev];
            const [dragged] = next.splice(dragIndex, 1);
            next.splice(hoverIndex, 0, dragged);
            save(next);
            return next;
        });
    }, [save]);

    const deleteField = useCallback((id: string) => {
        setFields(prev => {
            const next = prev.filter(f => f.id !== id);
            save(next);
            return next;
        });
        if (selectedFieldId === id) setSelectedFieldId(null);
    }, [selectedFieldId, save]);

    const updateField = useCallback((id: string, updates: Partial<FormField>) => {
        setFields(prev => {
            const next = prev.map(f => f.id === id ? { ...f, ...updates } : f);
            save(next);
            return next;
        });
    }, [save]);

    const handleTitleChange = (value: string) => {
        setFormTitle(value);
        save(fields, value);
    };

    return (
        <div className="flex h-screen flex-col bg-background">
            {/* Top Bar — provided by parent */}
            <div className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
                <div className="flex items-center gap-4">
                    {topBar}
                    <Input
                        value={formTitle}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        className="h-9 w-80 border-0 bg-transparent px-2 text-lg font-semibold focus-visible:ring-1"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {autoSaveStatus === 'saved' && (
                            <>
                                <Check className="h-4 w-4 text-green-600" />
                                Saved
                            </>
                        )}
                        {autoSaveStatus === 'saving' && <>Saving...</>}
                        {autoSaveStatus === 'error' && (
                            <span className="text-red-500">Save failed</span>
                        )}
                    </div>
                </div>
            </div>

            {/* 3-Panel Layout */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Panel - Component Library */}
                <div className="w-72 border-r border-border bg-card">
                    <ScrollArea className="h-full">
                        <div className="p-4">
                            <h3 className="mb-4 text-sm font-semibold text-foreground">Components</h3>
                            <div className="space-y-6">
                                {fieldCategories.map((category) => (
                                    <div key={category.name}>
                                        <h4 className="mb-2 text-xs font-medium text-muted-foreground">
                                            {category.name}
                                        </h4>
                                        <div className="space-y-1.5">
                                            {category.fields.map((field) => (
                                                <DraggableField key={field.type} type={field.type} label={field.label} disabled={'disabled' in field && !!field.disabled} />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ScrollArea>
                </div>

                {/* Center Panel - Canvas */}
                <div className="flex-1 overflow-auto bg-accent/30">
                    <div className="mx-auto max-w-4xl p-8">
                        <div
                            ref={drop}
                            className="min-h-[600px] rounded-lg border-2 border-dashed border-border bg-card p-8"
                        >
                            {fields.length === 0 ? (
                                <div className="flex h-[600px] flex-col items-center justify-center text-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                        <Type className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-medium text-foreground">Start building</h3>
                                    <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                                        Drag fields from the left panel to add them
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    {fields.map((field, index) => (
                                        <CanvasField
                                            key={field.id}
                                            field={field}
                                            index={index}
                                            isSelected={selectedFieldId === field.id}
                                            onSelect={() => setSelectedFieldId(field.id)}
                                            onMove={moveField}
                                            onDelete={() => deleteField(field.id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel - Properties */}
                <div className="w-80 border-l border-border bg-card">
                    <ScrollArea className="h-full">
                        <div className="p-4">
                            {selectedField ? (
                                <FieldProperties
                                    field={selectedField}
                                    onUpdate={(updates) => updateField(selectedField.id, updates)}
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center pt-40">
                                    <p className="text-center text-sm text-muted-foreground">
                                        Select a field to edit its properties
                                    </p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}

export default function BuilderCanvas(props: BuilderCanvasProps) {
    return (
        <DndProvider backend={HTML5Backend}>
            <BuilderCanvasContent {...props} />
        </DndProvider>
    );
}
