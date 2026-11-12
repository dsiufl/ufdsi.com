import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClerkBridgedServerClient } from '@/lib/supabase/server';
import { sendPromotedEmail, sendCancelledEmail } from '@/lib/brevo';

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; subId: string }> }
) {
    const { id, subId } = await params;
    const { userId } = await auth();
    if (!userId) return new Response('Unauthorized', { status: 401 });

    const { status } = await req.json();

    const supabase = await createClerkBridgedServerClient();

    // Load current submission + form title for email, verifying it belongs to this form
    const { data: current } = await supabase
        .from('form_submissions')
        .select('*, forms(title)')
        .eq('id', subId)
        .eq('form_id', id)
        .single();

    const updates: Record<string, unknown> = { status };
    // Clear waitlist_position if no longer on waitlist
    if (status !== 'waitlist') updates.waitlist_position = null;

    const { data, error: updateError } = await supabase
        .from('form_submissions')
        .update(updates)
        .eq('id', subId)
        .eq('form_id', id)
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
