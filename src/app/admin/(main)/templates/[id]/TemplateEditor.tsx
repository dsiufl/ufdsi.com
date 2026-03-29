'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { FormTemplateDB, FormField } from '@/types/db';
import { createUserClient } from '@/lib/supabase/client';
import BuilderCanvas from '@/app/admin/builder/[id]/components/BuilderCanvas';

export default function TemplateEditor({ template }: { template: FormTemplateDB }) {
    const router = useRouter();
    const tokenRef = useRef<string | undefined>();
    const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'idle' | 'error'>('saved');

    useEffect(() => {
        const supabase = createUserClient();
        supabase.auth.getSession().then(res => {
            if (res.data.session) tokenRef.current = res.data.session.access_token;
        });
    }, []);

    const handleSave = useCallback(async (fields: FormField[], title: string): Promise<boolean> => {
        if (!tokenRef.current) return false;
        try {
            const res = await fetch(`/api/templates/${template.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    access_token: tokenRef.current,
                    fields,
                    name: title,
                }),
            });
            return res.ok;
        } catch {
            return false;
        }
    }, [template.id]);

    const topBar = (
        <>
            <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => router.push('/admin/templates')}
            >
                <ArrowLeft className="h-4 w-4" />
                Back
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                Template
            </Badge>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-1.5 rounded-md bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                <AlertTriangle className="h-3.5 w-3.5" />
                You are editing a template, not creating a new form
            </div>
        </>
    );

    return (
        <BuilderCanvas
            initialFields={template.fields}
            initialTitle={template.name}
            onSave={handleSave}
            topBar={topBar}
            autoSaveStatus={autoSaveStatus}
            onAutoSaveStatusChange={setAutoSaveStatus}
        />
    );
}
