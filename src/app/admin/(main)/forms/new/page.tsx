'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Bus, CalendarCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formTemplates } from '@/lib/form-templates';
import { createUserClient } from '@/lib/supabase/client';
import { useState } from 'react';
import { LucideIcon } from 'lucide-react';

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

    async function handleSelect(templateId: string) {
        setCreating(true);
        setError(null);
        const template = formTemplates.find(t => t.id === templateId);
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
                    title: template?.name === 'Blank Form' ? 'Untitled Form' : template?.name ?? 'Untitled Form',
                    fields: template?.fields ?? [],
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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {formTemplates.map((template) => {
                    const Icon = iconMap[template.icon] ?? FileText;
                    return (
                        <Card
                            key={template.id}
                            className={`cursor-pointer transition-all hover:border-[#FF5722] hover:shadow-md ${creating ? 'pointer-events-none opacity-60' : ''}`}
                            onClick={() => handleSelect(template.id)}
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
    );
}
