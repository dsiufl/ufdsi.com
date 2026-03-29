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
    // (the submit API handles putting users on the waitlist when confirmed >= capacity)
    if (form.capacity) {
        const { count: confirmedCount } = await supabase
            .from('form_submissions')
            .select('*', { count: 'exact', head: true })
            .eq('form_id', form.id)
            .eq('status', 'confirmed');

        if ((confirmedCount ?? 0) < form.capacity) {
            // Still have confirmed spots — allow access
        } else {
            const { count: waitlistCount } = await supabase
                .from('form_submissions')
                .select('*', { count: 'exact', head: true })
                .eq('form_id', form.id)
                .eq('status', 'waitlist');

            // Only show closed when waitlist also reaches capacity (no more room at all)
            if ((waitlistCount ?? 0) >= form.capacity) {
                redirect(`/forms/${slug}/closed?reason=capacity`);
            }
        }
    }

    return <DynamicForm form={form as EventForm} slug={slug} />;
}
