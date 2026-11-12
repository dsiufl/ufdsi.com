import { auth } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import { createClerkBridgedServerClient } from '@/lib/supabase/server';
import FormBuilder from './components/FormBuilder';
import { EventForm } from '@/types/db';

export default async function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { userId } = await auth();
    if (!userId) redirect('/admin/login');

    const supabase = await createClerkBridgedServerClient();
    const { data: form, error } = await supabase
        .from('forms')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !form) notFound();

    return <FormBuilder form={form as EventForm} />;
}
