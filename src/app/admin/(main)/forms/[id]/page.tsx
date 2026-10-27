import { auth } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';
import { createClerkBridgedServerClient } from '@/lib/supabase/server';
import FormDetail from './components/FormDetail';
import { EventForm } from '@/types/db';

export default async function FormDetailPage({ params }: { params: Promise<{ id: string }> }) {
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

    return (
        <div className="container pt-20">
            <FormDetail form={form as EventForm} />
        </div>
    );
}
