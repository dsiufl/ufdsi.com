'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Bus, CalendarCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formTemplates } from '@/lib/form-templates';
import { createUserClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';
import { FormTemplateDB } from '@/types/db';

const iconMap: Record<string, LucideIcon> = {
    FileText,
    Bus,
    Presentation: CalendarCheck,
    CalendarCheck,
};

export default function TemplatePicker() {
    const router = useRouter();
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [templates, setTemplates] = useState<FormTemplateDB[] | null>(null);
    const [loadingTemplates, setLoadingTemplates] = useState(true);

    useEffect(() => {
        const supabase = createUserClient();
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                // Fall back to static templates
                setTemplates(null);
                setLoadingTemplates(false);
                return;
            }
            fetch('/api/templates', {
                headers: { Authorization: `Bearer ${session.access_token}` },
            })
                .then(r => r.ok ? r.json() : Promise.reject())
                .then(data => setTemplates(data))
                .catch(() => setTemplates(null))
                .finally(() => setLoadingTemplates(false));
        });
    }, []);

    // Fall back to static templates if DB fetch fails or returns empty
    const displayTemplates = (templates && templates.length > 0) ? templates : formTemplates.map(t => ({
        ...t,
        category: 'general',
        is_default: true,
        created_by: null,
        created_at: '',
        updated_at: '',
        description: t.description ?? null,
    }));

    async function handleSelect(template: FormTemplateDB) {
        setCreating(true);
        setError(null);
        const supabase = createUserClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            setError('You must be logged in to create a form.');
            setCreating(false);
            return;
        }

        try {
            const res = await fetch('/api/forms/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    access_token: session.access_token,
                    title: template.name === 'Blank Form' ? 'Untitled Form' : template.name,
                    fields: template.fields ?? [],
                    slug: `form-${Date.now().toString(36)}`,
                }),
            });

            if (res.ok) {
                const form = await res.json();
                router.push(`/admin/builder/${form.id}`);
            } else {
                setError(await res.text());
                setCreating(false);
            }
        } catch {
            setError('Failed to create form. Please try again.');
            setCreating(false);
        }
    }

    // Group templates by category
    const grouped = displayTemplates.reduce<Record<string, FormTemplateDB[]>>((acc, t) => {
        const cat = t.category || 'general';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(t);
        return acc;
    }, {});

    return (
        <div className="container pt-20">
            <button
                onClick={() => router.push('/admin/forms')}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
                style={{ background: 'none', padding: 0, fontWeight: 'normal' }}
            >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Forms
            </button>
            <h1 className="text-2xl font-semibold mb-1">Choose a Template</h1>
            <p className="text-sm text-muted-foreground mb-8">
                Start with a template or build from scratch
            </p>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {loadingTemplates ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map(i => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader>
                                <div className="mb-3 h-12 w-12 rounded-lg bg-muted" />
                                <div className="h-5 w-32 rounded bg-muted" />
                                <div className="mt-2 h-4 w-48 rounded bg-muted" />
                            </CardHeader>
                            <CardContent>
                                <div className="h-4 w-24 rounded bg-muted" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                Object.entries(grouped).map(([category, categoryTemplates]) => (
                    <div key={category} className="mb-8">
                        {Object.keys(grouped).length > 1 && (
                            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                                {category}
                            </h2>
                        )}
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {categoryTemplates.map((template) => {
                                const Icon = iconMap[template.icon] ?? FileText;
                                return (
                                    <Card
                                        key={template.id}
                                        className={`cursor-pointer transition-all hover:border-[#FF5722] hover:shadow-md ${creating ? 'pointer-events-none opacity-60' : ''}`}
                                        onClick={() => handleSelect(template)}
                                    >
                                        <CardHeader>
                                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[#FF5722]/10">
                                                <Icon className="h-6 w-6 text-[#FF5722]" />
                                            </div>
                                            <CardTitle className="text-lg">{template.name}</CardTitle>
                                            <CardDescription className="mt-2">{template.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground">
                                                {template.fields.length} pre-configured field{template.fields.length !== 1 ? 's' : ''}
                                            </p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
