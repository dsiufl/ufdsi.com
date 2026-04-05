'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Check, Save, Calendar, Clock, Loader2, Paperclip, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { EventForm, FormField } from '@/types/db';

function loadDraft(slug: string): Record<string, unknown> {
    if (typeof window === 'undefined') return {};
    try {
        const s = localStorage.getItem(`form-draft-${slug}`);
        return s ? JSON.parse(s) : {};
    } catch { return {}; }
}

function saveDraft(slug: string, data: Record<string, unknown>) {
    if (typeof window !== 'undefined') {
        localStorage.setItem(`form-draft-${slug}`, JSON.stringify(data));
    }
}

function clearDraft(slug: string) {
    if (typeof window !== 'undefined') localStorage.removeItem(`form-draft-${slug}`);
}

function formatEventDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

function formatDeadline(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

function FileUploadField({
    field,
    value,
    onChange,
    formId,
}: {
    field: FormField;
    value: unknown;
    onChange: (fieldId: string, value: unknown) => void;
    formId: string;
}) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileValue = value as { path: string; name: string } | null;

    async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);
        setUploading(true);
        try {
            const body = new FormData();
            body.append('file', file);
            body.append('fieldId', field.id);

            const res = await fetch(`/api/forms/${formId}/upload`, {
                method: 'POST',
                body,
            });

            if (!res.ok) {
                setError(await res.text());
                setUploading(false);
                return;
            }

            const { path, name } = await res.json();
            onChange(field.id, { path, name });
        } catch {
            setError('Upload failed. Please try again.');
        }
        setUploading(false);
    }

    return (
        <div className={cn('col-span-2', field.width === 'half' && 'sm:col-span-1')}>
            <Label>
                {field.label}
                {field.required && <span className="ml-1 text-[#FF5722]">*</span>}
            </Label>
            {fileValue ? (
                <div className="mt-2 flex items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-2 text-sm">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 truncate">{fileValue.name}</span>
                    <button
                        type="button"
                        onClick={() => onChange(field.id, null)}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ) : (
                <div className="mt-2">
                    <Input
                        type="file"
                        onChange={handleFile}
                        disabled={uploading}
                        accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                    />
                    {uploading && (
                        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Uploading...
                        </div>
                    )}
                </div>
            )}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

function FieldRenderer({
    field,
    value,
    onChange,
    formId,
}: {
    field: FormField;
    value: unknown;
    onChange: (fieldId: string, value: unknown) => void;
    formId?: string;
}) {
    switch (field.type) {
        case 'section-header': {
            const level = field.headingLevel ?? 3;
            const Tag = `h${level}` as keyof JSX.IntrinsicElements;
            const sizeClass = {
                1: 'text-3xl font-bold',
                2: 'text-2xl font-bold',
                3: 'text-lg font-semibold',
                4: 'text-base font-semibold',
                5: 'text-sm font-semibold',
                6: 'text-xs font-semibold uppercase tracking-wide',
            }[level];
            return (
                <div className="col-span-2 border-b border-gray-200 pb-2">
                    <Tag className={`${sizeClass} text-gray-900`}>{field.label}</Tag>
                    {field.content && <p className="mt-1 text-sm text-gray-500">{field.content}</p>}
                </div>
            );
        }

        case 'info-banner':
            return (
                <div className="col-span-2 rounded-lg bg-blue-50 p-4 text-sm text-blue-900 border border-blue-100">
                    {field.content}
                </div>
            );

        case 'page-break':
            return null;

        case 'short-text':
        case 'email':
        case 'phone':
        case 'uf-id':
            return (
                <div className={cn('col-span-2', field.width === 'half' && 'sm:col-span-1')}>
                    <Label>
                        {field.label}
                        {field.required && <span className="ml-1 text-[#FF5722]">*</span>}
                    </Label>
                    {field.helpText && <p className="mt-1 text-xs text-muted-foreground">{field.helpText}</p>}
                    <Input
                        type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
                        placeholder={field.placeholder}
                        value={(value as string) || ''}
                        onChange={(e) => onChange(field.id, e.target.value)}
                        className="mt-2"
                    />
                </div>
            );

        case 'long-text':
            return (
                <div className="col-span-2">
                    <Label>
                        {field.label}
                        {field.required && <span className="ml-1 text-[#FF5722]">*</span>}
                    </Label>
                    {field.helpText && <p className="mt-1 text-xs text-muted-foreground">{field.helpText}</p>}
                    <Textarea
                        placeholder={field.placeholder}
                        value={(value as string) || ''}
                        onChange={(e) => onChange(field.id, e.target.value)}
                        rows={4}
                        className="mt-2"
                    />
                </div>
            );

        case 'number':
            return (
                <div className={cn('col-span-2', field.width === 'half' && 'sm:col-span-1')}>
                    <Label>
                        {field.label}
                        {field.required && <span className="ml-1 text-[#FF5722]">*</span>}
                    </Label>
                    <Input
                        type="number"
                        placeholder={field.placeholder}
                        value={(value as string) || ''}
                        onChange={(e) => onChange(field.id, e.target.value)}
                        className="mt-2"
                        min={field.validation?.min}
                        max={field.validation?.max}
                    />
                </div>
            );

        case 'dropdown':
            return (
                <div className={cn('col-span-2', field.width === 'half' && 'sm:col-span-1')}>
                    <Label>
                        {field.label}
                        {field.required && <span className="ml-1 text-[#FF5722]">*</span>}
                    </Label>
                    <Select value={(value as string) || ''} onValueChange={(v) => onChange(field.id, v)}>
                        <SelectTrigger className="mt-2">
                            <SelectValue placeholder={field.placeholder || 'Select...'} />
                        </SelectTrigger>
                        <SelectContent>
                            {field.options?.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            );

        case 'radio':
            return (
                <div className="col-span-2">
                    <Label>
                        {field.label}
                        {field.required && <span className="ml-1 text-[#FF5722]">*</span>}
                    </Label>
                    <RadioGroup
                        value={(value as string) || ''}
                        onValueChange={(v) => onChange(field.id, v)}
                        className="mt-3 space-y-2"
                    >
                        {field.options?.map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                                <Label htmlFor={`${field.id}-${option}`} className="font-normal cursor-pointer">{option}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            );

        case 'checkbox-group':
            return (
                <div className="col-span-2">
                    <Label>
                        {field.label}
                        {field.required && <span className="ml-1 text-[#FF5722]">*</span>}
                    </Label>
                    <div className="mt-3 space-y-2">
                        {field.options?.map((option) => {
                            const current = (value as string[]) || [];
                            return (
                                <div key={option} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`${field.id}-${option}`}
                                        checked={current.includes(option)}
                                        onCheckedChange={(checked) => {
                                            onChange(field.id, checked
                                                ? [...current, option]
                                                : current.filter((v: string) => v !== option)
                                            );
                                        }}
                                    />
                                    <Label htmlFor={`${field.id}-${option}`} className="font-normal cursor-pointer">{option}</Label>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );

        case 'chip-select': {
            const selected = (value as string[]) || [];
            return (
                <div className="col-span-2">
                    <Label>
                        {field.label}
                        {field.required && <span className="ml-1 text-[#FF5722]">*</span>}
                    </Label>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {field.options?.map((option) => {
                            const isSelected = selected.includes(option);
                            return (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => {
                                        onChange(field.id, isSelected
                                            ? selected.filter((v: string) => v !== option)
                                            : [...selected, option]
                                        );
                                    }}
                                    className={cn(
                                        'rounded-full px-4 py-2 text-sm font-medium transition-all border',
                                        isSelected
                                            ? 'bg-[#FF5722] text-white border-[#FF5722]'
                                            : '!bg-white text-gray-700 border-gray-300 hover:border-[#FF5722]'
                                    )}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                </div>
            );
        }

        case 'yes-no':
            return (
                <div className="col-span-2">
                    <Label>
                        {field.label}
                        {field.required && <span className="ml-1 text-[#FF5722]">*</span>}
                    </Label>
                    <RadioGroup
                        value={(value as string) || ''}
                        onValueChange={(v) => onChange(field.id, v)}
                        className="mt-3 flex gap-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id={`${field.id}-yes`} />
                            <Label htmlFor={`${field.id}-yes`} className="font-normal cursor-pointer">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id={`${field.id}-no`} />
                            <Label htmlFor={`${field.id}-no`} className="font-normal cursor-pointer">No</Label>
                        </div>
                    </RadioGroup>
                </div>
            );

        case 'date':
            return (
                <div className={cn('col-span-2', field.width === 'half' && 'sm:col-span-1')}>
                    <Label>
                        {field.label}
                        {field.required && <span className="ml-1 text-[#FF5722]">*</span>}
                    </Label>
                    <Input
                        type="date"
                        value={(value as string) || ''}
                        onChange={(e) => onChange(field.id, e.target.value)}
                        className="mt-2"
                    />
                </div>
            );

        case 'file-upload':
            return (
                <FileUploadField
                    field={field}
                    value={value}
                    onChange={onChange}
                    formId={formId ?? ''}
                />
            );

        case 'emergency-contact':
            return (
                <div className="col-span-2 space-y-4">
                    <Label>
                        {field.label}
                        {field.required && <span className="ml-1 text-[#FF5722]">*</span>}
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm text-muted-foreground">Contact Name</Label>
                            <Input
                                placeholder="Full name"
                                value={((value as Record<string, string>)?.name) || ''}
                                onChange={(e) => onChange(field.id, { ...((value as Record<string, string>) || {}), name: e.target.value })}
                                className="mt-1.5"
                            />
                        </div>
                        <div>
                            <Label className="text-sm text-muted-foreground">Contact Phone</Label>
                            <Input
                                type="tel"
                                placeholder="(123) 456-7890"
                                value={((value as Record<string, string>)?.phone) || ''}
                                onChange={(e) => onChange(field.id, { ...((value as Record<string, string>) || {}), phone: e.target.value })}
                                className="mt-1.5"
                            />
                        </div>
                    </div>
                </div>
            );

        case 'waiver':
            return (
                <div className="col-span-2">
                    <Label>
                        {field.label}
                        {field.required && <span className="ml-1 text-[#FF5722]">*</span>}
                    </Label>
                    <ScrollArea className="mt-2 h-32 rounded-lg border border-border bg-accent/50 p-4">
                        <p className="text-sm text-foreground">{field.content}</p>
                    </ScrollArea>
                    <div className="mt-4 flex items-start space-x-2">
                        <Checkbox
                            id={field.id}
                            checked={(value as boolean) || false}
                            onCheckedChange={(checked) => onChange(field.id, checked)}
                            className="mt-1"
                        />
                        <Label htmlFor={field.id} className="font-normal cursor-pointer leading-relaxed">
                            I have read and agree to the terms above
                        </Label>
                    </div>
                </div>
            );

        default:
            return null;
    }
}

export default function DynamicForm({ form, slug }: { form: EventForm; slug: string }) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<Record<string, unknown>>(() => loadDraft(slug));
    const [autoSaving, setAutoSaving] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    // Split fields by page breaks
    const fields = form.fields ?? [];
    const pages: FormField[][] = [];
    let currentPage: FormField[] = [];
    for (const field of fields) {
        if (field.type === 'page-break') {
            if (currentPage.length > 0) {
                pages.push(currentPage);
                currentPage = [];
            }
        } else {
            currentPage.push(field);
        }
    }
    if (currentPage.length > 0) pages.push(currentPage);
    if (pages.length === 0) pages.push([]);

    const totalSteps = pages.length;
    const currentFields = pages[currentStep] ?? [];

    const handleChange = (fieldId: string, value: unknown) => {
        const next = { ...formData, [fieldId]: value };
        setFormData(next);
        setValidationErrors(prev => {
            const copy = { ...prev };
            delete copy[fieldId];
            return copy;
        });
        saveDraft(slug, next);
        setAutoSaving(true);
        setTimeout(() => setAutoSaving(false), 1000);
    };

    function validatePage(fields: FormField[]): boolean {
        const errors: Record<string, string> = {};
        for (const field of fields) {
            if (field.type === 'section-header' || field.type === 'info-banner' || field.type === 'page-break') continue;
            const val = formData[field.id];
            if (field.required) {
                if (field.type === 'waiver' && val !== true) {
                    errors[field.id] = 'You must agree to continue';
                } else if (field.type === 'emergency-contact') {
                    const ec = val as Record<string, string> | undefined;
                    if (!ec?.name || !ec?.phone) errors[field.id] = 'Both name and phone are required';
                } else if (field.type === 'file-upload') {
                    if (!val || !(val as Record<string, unknown>)?.path) errors[field.id] = 'Please upload a file';
                } else if (field.type === 'checkbox-group' || field.type === 'chip-select') {
                    if (!Array.isArray(val) || val.length === 0) errors[field.id] = 'Select at least one option';
                } else if (!val || (typeof val === 'string' && !val.trim())) {
                    errors[field.id] = 'This field is required';
                }
            }
            if (field.type === 'email' && val && typeof val === 'string') {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                    errors[field.id] = 'Enter a valid email';
                } else if (field.validation?.emailDomain) {
                    const domain = val.split('@')[1]?.toLowerCase();
                    if (domain !== field.validation.emailDomain.toLowerCase()) {
                        errors[field.id] = `Email must be from @${field.validation.emailDomain}`;
                    }
                }
            }
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    }

    function handleNext() {
        if (!validatePage(currentFields)) return;
        setCurrentStep(s => Math.min(s + 1, totalSteps - 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleBack() {
        setCurrentStep(s => Math.max(s - 1, 0));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function handleSubmit() {
        if (!validatePage(currentFields)) return;
        setSubmitting(true);
        setSubmitError(null);

        const allFields = (form.fields ?? []).filter(f => f.type !== 'page-break');
        const findFieldValue = (labels: string[], type?: string) => {
            const normalize = (s: string) => s.toLowerCase().trim();
            // Exact match first
            let f = allFields.find(field =>
                labels.some(l => normalize(field.label) === normalize(l)) &&
                (!type || field.type === type)
            );
            // Fallback to includes
            if (!f) {
                f = allFields.find(field =>
                    labels.some(l => normalize(field.label).includes(normalize(l))) &&
                    (!type || field.type === type)
                );
            }
            return f ? (formData[f.id] as string) : undefined;
        };

        const firstName = findFieldValue(['first name']) || '';
        const lastName = findFieldValue(['last name']) || '';
        const email = findFieldValue(['email'], 'email') || '';
        const phone = findFieldValue(['phone'], 'phone');

        const data: Record<string, unknown> = {};
        for (const field of allFields) {
            if (['section-header', 'info-banner'].includes(field.type)) continue;
            const val = formData[field.id];
            if (val !== undefined && val !== '' && val !== null) {
                data[field.label] = val;
            }
        }

        try {
            const res = await fetch(`/api/forms/${form.id}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    phone,
                    ...data,
                }),
            });

            if (!res.ok) {
                const msg = await res.text();
                setSubmitError(msg);
                setSubmitting(false);
                return;
            }

            clearDraft(slug);
            const result = await res.json();
            router.push(`/forms/${slug}/success?status=${result.status}&pos=${result.waitlist_position ?? ''}`);
        } catch {
            setSubmitError('Something went wrong. Please try again.');
            setSubmitting(false);
        }
    }

    const isPreview = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('preview') === 'true';

    const hasEventDetails = form.event_date || form.deadline;

    return (
        <div className="min-h-screen bg-white">
            {/* Mobile header */}
            <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-3 md:hidden">
                <div className="flex items-center gap-3">
                    <Image src="/images/logo/dsi-logo-small.svg" alt="UF DSI" width={40} height={40} />
                    <div className="min-w-0">
                        <h1 className="truncate text-lg font-semibold text-gray-900">{form.title}</h1>
                        <div className="flex gap-3 text-xs text-gray-500">
                            {form.event_date && <span>{formatEventDate(form.event_date)}</span>}
                            {form.deadline && <span>Closes {formatDeadline(form.deadline)}</span>}
                        </div>
                    </div>
                </div>
                {isPreview && (
                    <div className="mt-2 rounded bg-yellow-50 border border-yellow-200 px-2 py-1 text-xs text-yellow-800 text-center">
                        Preview Mode
                    </div>
                )}
            </div>

            {/* Split layout */}
            <div className="flex min-h-screen flex-col md:flex-row">
                {/* Left panel — Event Info (hidden on mobile, shown via header instead) */}
                <div className="hidden md:flex md:w-[40%] border-r-4 border-[#FF5722] bg-gray-50">
                    <div className="sticky top-0 flex h-screen w-full flex-col justify-between p-10 lg:p-12">
                        <div>
                            {/* Logo */}
                            <Image src="/images/logo/dsi-logo-small.svg" alt="UF DSI" width={80} height={80} />

                            {/* Title + Description */}
                            <h1 className="mt-8 text-2xl font-bold text-gray-900">{form.title}</h1>
                            {form.description && (
                                <p className="mt-3 text-sm leading-relaxed text-gray-600">{form.description}</p>
                            )}

                            {/* Event Details */}
                            {hasEventDetails && (
                                <>
                                    <div className="my-6 border-t border-gray-200" />
                                    <div className="space-y-4">
                                        {form.event_date && (
                                            <div className="flex items-start gap-3">
                                                <Calendar className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Event Date</p>
                                                    <p className="font-medium text-gray-900">{formatEventDate(form.event_date)}</p>
                                                </div>
                                            </div>
                                        )}
                                        {form.deadline && (
                                            <div className="flex items-start gap-3">
                                                <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Registration Deadline</p>
                                                    <p className="font-medium text-gray-900">Closes {formatDeadline(form.deadline)}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Preview badge */}
                            {isPreview && (
                                <>
                                    <div className="my-6 border-t border-gray-200" />
                                    <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-800 text-center">
                                        Preview Mode — submissions are disabled
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="space-y-3">
                            {/* Auto-save indicator */}
                            <div className="text-xs text-gray-400">
                                {autoSaving ? (
                                    <span className="flex items-center gap-1.5">
                                        <Save className="h-3 w-3 animate-pulse" />
                                        Saving...
                                    </span>
                                ) : (
                                    <span>Changes are saved automatically</span>
                                )}
                            </div>
                            <div className="border-t border-gray-200 pt-3">
                                <p className="text-xs text-gray-400">Powered by UF DSI</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right panel — Form */}
                <div className="flex-1 md:w-[60%] md:max-w-none">
                    <div className="mx-auto flex min-h-screen flex-col px-6 py-8 sm:px-10 md:px-12 lg:px-16 md:max-w-3xl">
                        {/* Step indicator */}
                        {totalSteps > 1 && (
                            <div className="mb-8 flex items-center justify-center gap-2">
                                {Array.from({ length: totalSteps }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            'h-2 rounded-full transition-all',
                                            i === currentStep ? 'w-8 bg-[#FF5722]' : 'w-2 bg-gray-300'
                                        )}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Fields */}
                        <div className="flex-1">
                            <div className="grid grid-cols-2 gap-6">
                                {currentFields.map((field) => {
                                    const alwaysFullWidth = ['section-header', 'info-banner', 'waiver', 'emergency-contact', 'long-text', 'radio', 'checkbox-group', 'chip-select', 'yes-no', 'page-break'];
                                    const isFullWidth = alwaysFullWidth.includes(field.type);
                                    return (
                                    <div key={field.id} className={isFullWidth ? 'col-span-2' : ''}>
                                        <FieldRenderer
                                            field={field}
                                            value={formData[field.id]}
                                            onChange={handleChange}
                                            formId={form.id}
                                        />
                                        {validationErrors[field.id] && (
                                            <p className="text-xs text-red-500 mt-1">{validationErrors[field.id]}</p>
                                        )}
                                    </div>
                                    );
                                })}
                            </div>

                            {submitError && (
                                <p className="mt-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                                    {submitError}
                                </p>
                            )}
                        </div>

                        {/* Navigation */}
                        <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
                            <div>
                                {currentStep > 0 && (
                                    <Button type="button" variant="outline" onClick={handleBack} className="gap-2">
                                        <ChevronLeft className="h-4 w-4" />
                                        Back
                                    </Button>
                                )}
                            </div>
                            <div>
                                {currentStep < totalSteps - 1 ? (
                                    <Button
                                        type="button"
                                        onClick={handleNext}
                                        className="gap-2 bg-[#FF5722] hover:bg-[#F4511E] text-white"
                                    >
                                        Continue
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={submitting || isPreview}
                                        className="gap-2 bg-[#FF5722] hover:bg-[#F4511E] text-white"
                                    >
                                        <Check className="h-4 w-4" />
                                        {submitting ? 'Submitting...' : 'Submit'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
