'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { FormField, FieldWidth } from '@/types/db';

const LAYOUT_TYPES = ['section-header', 'info-banner', 'waiver', 'page-break'];
const CHOICE_TYPES = ['dropdown', 'radio', 'checkbox-group', 'chip-select'];

export default function FieldProperties({
    field,
    onUpdate,
}: {
    field: FormField;
    onUpdate: (updates: Partial<FormField>) => void;
}) {
    const isLayout = LAYOUT_TYPES.includes(field.type);

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Field Properties</h3>

            <div>
                <Label>Label</Label>
                <Input
                    value={field.label}
                    onChange={(e) => onUpdate({ label: e.target.value })}
                    className="mt-1.5"
                />
            </div>

            {!isLayout && (
                <>
                    <div>
                        <Label>Placeholder</Label>
                        <Input
                            value={field.placeholder || ''}
                            onChange={(e) => onUpdate({ placeholder: e.target.value })}
                            className="mt-1.5"
                        />
                    </div>

                    <div>
                        <Label>Help Text</Label>
                        <Textarea
                            value={field.helpText || ''}
                            onChange={(e) => onUpdate({ helpText: e.target.value })}
                            rows={2}
                            className="mt-1.5"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label>Required</Label>
                        <Switch
                            checked={field.required ?? false}
                            onCheckedChange={(checked) => onUpdate({ required: checked })}
                        />
                    </div>
                </>
            )}

            <div>
                <Label>Column Width</Label>
                <Select
                    value={field.width ?? 'full'}
                    onValueChange={(value: FieldWidth) => onUpdate({ width: value })}
                >
                    <SelectTrigger className="mt-1.5">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="half">Half Width</SelectItem>
                        <SelectItem value="full">Full Width</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {CHOICE_TYPES.includes(field.type) && (
                <div>
                    <Label>Options (one per line)</Label>
                    <Textarea
                        value={(field.options || []).join('\n')}
                        onChange={(e) =>
                            onUpdate({
                                options: e.target.value.split('\n').filter((o) => o.trim()),
                            })
                        }
                        rows={5}
                        className="mt-1.5"
                        placeholder={'Option 1\nOption 2\nOption 3'}
                    />
                </div>
            )}

            {field.type === 'email' && (
                <div>
                    <Label>Email Domain Restriction</Label>
                    <Input
                        value={field.validation?.emailDomain || ''}
                        onChange={(e) =>
                            onUpdate({
                                validation: {
                                    ...field.validation,
                                    emailDomain: e.target.value,
                                },
                            })
                        }
                        placeholder="ufl.edu"
                        className="mt-1.5"
                    />
                </div>
            )}

            {field.type === 'section-header' && (
                <>
                    <div>
                        <Label>Heading Level</Label>
                        <Select
                            value={String(field.headingLevel ?? 3)}
                            onValueChange={(value) => onUpdate({ headingLevel: parseInt(value) as FormField['headingLevel'] })}
                        >
                            <SelectTrigger className="mt-1.5">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">H1 — Page Title</SelectItem>
                                <SelectItem value="2">H2 — Section</SelectItem>
                                <SelectItem value="3">H3 — Subsection</SelectItem>
                                <SelectItem value="4">H4 — Small Heading</SelectItem>
                                <SelectItem value="5">H5 — Label</SelectItem>
                                <SelectItem value="6">H6 — Overline</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Subtitle</Label>
                        <Input
                            value={field.content || ''}
                            onChange={(e) => onUpdate({ content: e.target.value })}
                            placeholder="Optional subtitle text"
                            className="mt-1.5"
                        />
                    </div>
                </>
            )}

            {['info-banner', 'waiver'].includes(field.type) && (
                <div>
                    <Label>Content</Label>
                    <Textarea
                        value={field.content || ''}
                        onChange={(e) => onUpdate({ content: e.target.value })}
                        rows={6}
                        className="mt-1.5"
                    />
                </div>
            )}
        </div>
    );
}
