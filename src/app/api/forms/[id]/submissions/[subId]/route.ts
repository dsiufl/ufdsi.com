import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import validateToken from '@/lib/supabase/validate';
import { sendPromotedEmail, sendCancelledEmail } from '@/lib/brevo';

function adminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_ADMIN_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; subId: string }> }
) {
    const { subId } = await params;
    const { access_token, status } = await req.json();

    const { error } = await validateToken(access_token);
    if (error) return new Response('Unauthorized', { status: 401 });

    const supabase = adminClient();

    // Load current submission + form title for email
    const { data: current } = await supabase
        .from('form_submissions')
        .select('*, forms(title)')
        .eq('id', subId)
        .single();

    const updates: Record<string, unknown> = { status };
    // Clear waitlist_position if no longer on waitlist
    if (status !== 'waitlist') updates.waitlist_position = null;

    const { data, error: updateError } = await supabase
        .from('form_submissions')
        .update(updates)
        .eq('id', subId)
        .select()
        .single();

    if (updateError) return new Response(updateError.message, { status: 400 });

    // Send email on meaningful status transitions
    if (current && current.status !== status) {
        const event_title = (current.forms as { title: string } | null)?.title ?? '';
        if (status === 'confirmed' && current.status === 'waitlist') {
            sendPromotedEmail({ email: current.email, first_name: current.first_name, event_title }).catch(console.error);
        } else if (status === 'cancelled') {
            sendCancelledEmail({ email: current.email, first_name: current.first_name, event_title }).catch(console.error);
        }
    }

    return Response.json(data);
}
