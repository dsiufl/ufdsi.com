import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendRegistrationConfirmedEmail, sendWaitlistEmail } from '@/lib/brevo';

function adminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_ADMIN_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await req.json();
    const { first_name, last_name, email, phone, ...rest } = body;

    if (!first_name || !last_name || !email) {
        return new Response('Missing required fields: first_name, last_name, email', { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const supabase = adminClient();

    // Load form config
    const { data: form, error: formError } = await supabase
        .from('forms')
        .select('*')
        .eq('id', id)
        .single();

    if (formError || !form) return new Response('Form not found', { status: 404 });
    if (form.status !== 'open') return new Response('Form is not accepting submissions', { status: 400 });

    // Deadline check
    if (form.deadline && new Date(form.deadline) < new Date()) {
        return new Response('Submission deadline has passed', { status: 400 });
    }

    // Domain restriction
    if (form.allowed_domains && form.allowed_domains.length > 0) {
        const emailDomain = normalizedEmail.split('@')[1];
        const allowed = form.allowed_domains.some(
            (d: string) => d.toLowerCase() === emailDomain
        );
        if (!allowed) {
            return new Response(
                `Email must be from: ${form.allowed_domains.join(', ')}`,
                { status: 400 }
            );
        }
    }

    // Duplicate check
    const { data: existing } = await supabase
        .from('form_submissions')
        .select('id')
        .eq('form_id', id)
        .eq('email', normalizedEmail)
        .neq('status', 'cancelled')
        .maybeSingle();

    if (existing) {
        return new Response('You have already submitted this form', { status: 409 });
    }

    // Capacity check
    let status: 'confirmed' | 'waitlist' = 'confirmed';
    let waitlist_position: number | null = null;

    if (form.capacity !== null) {
        const { count } = await supabase
            .from('form_submissions')
            .select('*', { count: 'exact', head: true })
            .eq('form_id', id)
            .eq('status', 'confirmed');

        if ((count ?? 0) >= form.capacity) {
            // Check if waitlist is also full
            const { count: waitlistCount } = await supabase
                .from('form_submissions')
                .select('*', { count: 'exact', head: true })
                .eq('form_id', id)
                .eq('status', 'waitlist');

            if ((waitlistCount ?? 0) >= form.capacity) {
                return new Response('This event is full and the waitlist is closed', { status: 409 });
            }

            status = 'waitlist';
            waitlist_position = (waitlistCount ?? 0) + 1;
        }
    }

    // Insert submission
    const { data: submission, error: insertError } = await supabase
        .from('form_submissions')
        .insert({
            form_id: id,
            status,
            waitlist_position,
            first_name: first_name.trim(),
            last_name: last_name.trim(),
            email: normalizedEmail,
            phone: phone ?? null,
            data: rest,
        })
        .select()
        .single();

    if (insertError) return new Response('Failed to submit', { status: 500 });

    // Send email (non-blocking — failure does not affect response)
    if (status === 'confirmed') {
        sendRegistrationConfirmedEmail({
            email: normalizedEmail,
            first_name: first_name.trim(),
            event_title: form.title,
            event_date: form.event_date,
        }).catch(console.error);
    } else {
        sendWaitlistEmail({
            email: normalizedEmail,
            first_name: first_name.trim(),
            event_title: form.title,
            waitlist_position: waitlist_position!,
        }).catch(console.error);
    }

    return Response.json({ id: submission.id, status, waitlist_position });
}
