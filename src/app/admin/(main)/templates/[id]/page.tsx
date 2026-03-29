import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { FormTemplateDB } from '@/types/db';
import TemplateEditor from './TemplateEditor';

function createAdminClient() {
    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_ADMIN_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

export default async function TemplateEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/admin/login');

    const adminSupabase = createAdminClient();
    const { data: template, error } = await adminSupabase
        .from('form_templates')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !template) notFound();

    return <TemplateEditor template={template as FormTemplateDB} />;
}
