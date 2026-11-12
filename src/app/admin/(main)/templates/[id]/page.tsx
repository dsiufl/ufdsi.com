import { auth } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import { createClerkBridgedServerClient } from '@/lib/supabase/server';
import { FormTemplateDB } from '@/types/db';
import TemplateEditor from './TemplateEditor';

export default async function TemplateEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { userId } = await auth();
    if (!userId) redirect('/admin/login');

    const supabase = await createClerkBridgedServerClient();
    const { data: template, error } = await supabase
        .from('form_templates')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !template) notFound();

    return <TemplateEditor template={template as FormTemplateDB} />;
}
