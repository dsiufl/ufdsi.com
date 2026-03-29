import {
    Type,
    AlignLeft,
    Mail,
    Phone,
    Hash,
    ChevronDown,
    Circle,
    CheckSquare,
    Tag,
    CircleDot,
    IdCard,
    Calendar,
    Upload,
    Users,
    Heading2,
    Info,
    FileText,
    Minus,
    LucideIcon,
} from 'lucide-react';
import { FieldType, FormField } from '@/types/db';

export const fieldTypeIcons: Record<FieldType, LucideIcon> = {
    'short-text': Type,
    'long-text': AlignLeft,
    'email': Mail,
    'phone': Phone,
    'number': Hash,
    'dropdown': ChevronDown,
    'radio': Circle,
    'checkbox-group': CheckSquare,
    'chip-select': Tag,
    'yes-no': CircleDot,
    'uf-id': IdCard,
    'date': Calendar,
    'file-upload': Upload,
    'emergency-contact': Users,
    'section-header': Heading2,
    'info-banner': Info,
    'waiver': FileText,
    'page-break': Minus,
};

export const fieldCategories = [
    {
        name: 'Input Fields',
        fields: [
            { type: 'short-text' as FieldType, label: 'Short Text' },
            { type: 'long-text' as FieldType, label: 'Long Text' },
            { type: 'email' as FieldType, label: 'Email' },
            { type: 'phone' as FieldType, label: 'Phone' },
            { type: 'number' as FieldType, label: 'Number' },
            { type: 'uf-id' as FieldType, label: 'UF ID' },
            { type: 'date' as FieldType, label: 'Date Picker' },
            { type: 'file-upload' as FieldType, label: 'File Upload' },
        ],
    },
    {
        name: 'Choice Fields',
        fields: [
            { type: 'dropdown' as FieldType, label: 'Dropdown' },
            { type: 'radio' as FieldType, label: 'Radio Buttons' },
            { type: 'checkbox-group' as FieldType, label: 'Checkbox Group' },
            { type: 'chip-select' as FieldType, label: 'Chip Select' },
            { type: 'yes-no' as FieldType, label: 'Yes/No' },
        ],
    },
    {
        name: 'Special Fields',
        fields: [
            { type: 'emergency-contact' as FieldType, label: 'Emergency Contact' },
        ],
    },
    {
        name: 'Layout Blocks',
        fields: [
            { type: 'section-header' as FieldType, label: 'Section Header' },
            { type: 'info-banner' as FieldType, label: 'Info Banner' },
            { type: 'waiver' as FieldType, label: 'Waiver/Terms' },
            { type: 'page-break' as FieldType, label: 'Page Break' },
        ],
    },
];

export function createField(type: FieldType, label?: string): FormField {
    const defaults: FormField = {
        id: `field-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type,
        label: label ?? fieldCategories.flatMap(c => c.fields).find(f => f.type === type)?.label ?? 'Untitled',
        width: 'full',
    };

    if (['dropdown', 'radio', 'checkbox-group', 'chip-select'].includes(type)) {
        defaults.options = ['Option 1', 'Option 2', 'Option 3'];
    }

    if (type === 'email') {
        defaults.placeholder = 'you@ufl.edu';
    }

    return defaults;
}
