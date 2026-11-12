import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { EventForm } from '@/types/db';
import DynamicForm from './components/DynamicForm';

export default async function FormPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data: form, error } = await supabase
        .from('forms')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !form) notFound();

    if (form.status === 'draft') notFound();

    if (form.status === 'closed') {
        redirect(`/forms/${slug}/closed?reason=closed`);
    }

    if (form.deadline && new Date(form.deadline) < new Date()) {
        redirect(`/forms/${slug}/closed?reason=expired`);
    }

    // Check capacity — only redirect when both confirmed and waitlist are at capacity
    // (the submit API handles putting users on the waitlist when confirmed >= capacity).
    // form_submissions isn't readable by anon, so this goes through a
    // security-definer function that only returns two booleans.
    if (form.capacity !== null) {
        const { data: availability } = await supabase.rpc('form_availability', { p_form_id: form.id });
        if (availability?.[0]?.waitlist_full) {
            redirect(`/forms/${slug}/closed?reason=capacity`);
        }
    }

    return <DynamicForm form={form as EventForm} slug={slug} />;
}
