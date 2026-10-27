import { NextRequest, after } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendRegistrationConfirmedEmail, sendWaitlistEmail } from '@/lib/email';
import { CONSENT_VERSION } from '@/lib/privacy';
import { FormField } from '@/types/db';

const MAX_BODY_BYTES = 64 * 1024;
const MAX_STRING_LENGTH = 5000;
const DISPLAY_ONLY = new Set(['section-header', 'info-banner', 'page-break']);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Error messages raised by public.submit_form() → HTTP responses
const RPC_ERRORS: Record<string, [number, string]> = {
    FORM_NOT_FOUND: [404, 'Form not found'],
    FORM_CLOSED: [400, 'Form is not accepting submissions'],
    DEADLINE_PASSED: [400, 'Submission deadline has passed'],
    FORM_FULL: [409, 'This event is full and the waitlist is closed'],
};

function adminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_ADMIN_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

function isEmpty(val: unknown) {
    return (
        val === undefined ||
        val === null ||
        (typeof val === 'string' && !val.trim()) ||
        (Array.isArray(val) && val.length === 0)
    );
}

function tooLong(val: unknown): boolean {
    if (typeof val === 'string') return val.length > MAX_STRING_LENGTH;
    if (Array.isArray(val)) return val.some(tooLong);
    if (val && typeof val === 'object') return Object.values(val).some(tooLong);
    return false;
}

// Keep only answers to real fields (keyed by label, as the admin table and CSV
// export expect) and enforce required fields server-side.
function validateData(
    fields: FormField[],
    raw: Record<string, unknown>,
    formId: string
): { data: Record<string, unknown> } | { error: string } {
    const data: Record<string, unknown> = {};
    for (const field of fields) {
        if (DISPLAY_ONLY.has(field.type)) continue;
        const val = raw[field.label];

        if (isEmpty(val)) {
            if (field.required) return { error: `Missing required field: ${field.label}` };
            continue;
        }
        if (tooLong(val)) return { error: `Answer too long: ${field.label}` };

        if (field.type === 'waiver' && field.required && val !== true) {
            return { error: `You must agree to: ${field.label}` };
        }
        if (field.type === 'file-upload') {
            const file = val as { path?: unknown; name?: unknown };
            if (typeof file.path !== 'string' || !file.path.startsWith(`${formId}/`) || typeof file.name !== 'string') {
                return { error: `Invalid upload for: ${field.label}` };
            }
            data[field.label] = { path: file.path, name: file.name };
            continue;
        }
        data[field.label] = val;
    }
    return { data };
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) return new Response('Submission too large', { status: 413 });

    let body: Record<string, unknown>;
    try {
        body = JSON.parse(text);
    } catch {
        return new Response('Invalid JSON', { status: 400 });
    }

    // Honeypot: real users never see or fill this field. Pretend success.
    if (body.website) return Response.json({ id: null, status: 'confirmed', waitlist_position: null });

    const { first_name, last_name, email, phone, consent, data: rawData } = body;

    if (typeof first_name !== 'string' || typeof last_name !== 'string' || typeof email !== 'string'
        || !first_name.trim() || !last_name.trim() || !email.trim()) {
        return new Response('Missing required fields: first_name, last_name, email', { status: 400 });
    }
    const normalizedEmail = email.toLowerCase().trim();
    if (!EMAIL_RE.test(normalizedEmail) || normalizedEmail.length > 254) {
        return new Response('Enter a valid email', { status: 400 });
    }
    if (phone != null && (typeof phone !== 'string' || phone.length > 50)) {
        return new Response('Invalid phone number', { status: 400 });
    }
    if (consent !== true) {
        return new Response('You must agree to the Privacy Policy', { status: 400 });
    }

    const supabase = adminClient();

    const { data: form, error: formError } = await supabase
        .from('forms')
        .select('id, title, event_date, fields, allowed_domains')
        .eq('id', id)
        .single();
    if (formError || !form) return new Response('Form not found', { status: 404 });

    const validated = validateData(
        (form.fields ?? []) as FormField[],
        rawData && typeof rawData === 'object' ? (rawData as Record<string, unknown>) : {},
        id
    );
    if ('error' in validated) return new Response(validated.error, { status: 400 });

    // Status/deadline/domain/duplicate/capacity checks and the insert happen
    // atomically in the database so concurrent submits can't overfill a form.
    const { data: rows, error: rpcError } = await supabase.rpc('submit_form', {
        p_form_id: id,
        p_first_name: first_name,
        p_last_name: last_name,
        p_email: normalizedEmail,
        p_phone: phone ?? null,
        p_data: validated.data,
        p_consent_version: CONSENT_VERSION,
    });

    if (rpcError) {
        if (rpcError.code === '23505') {
            return new Response('You have already submitted this form', { status: 409 });
        }
        if (rpcError.message === 'DOMAIN_NOT_ALLOWED') {
            return new Response(`Email must be from: ${(form.allowed_domains ?? []).join(', ')}`, { status: 400 });
        }
        const mapped = RPC_ERRORS[rpcError.message];
        if (mapped) return new Response(mapped[1], { status: mapped[0] });
        console.error('submit_form failed:', rpcError);
        return new Response('Failed to submit', { status: 500 });
    }

    const submission = (rows as { id: string; status: 'confirmed' | 'waitlist'; waitlist_position: number | null }[])[0];

    // after() keeps the function alive until the email is sent, which a bare
    // un-awaited promise does not guarantee on serverless.
    after(async () => {
        if (submission.status === 'confirmed') {
            await sendRegistrationConfirmedEmail({
                email: normalizedEmail,
                first_name: first_name.trim(),
                event_title: form.title,
                event_date: form.event_date,
            });
        } else {
            await sendWaitlistEmail({
                email: normalizedEmail,
                first_name: first_name.trim(),
                event_title: form.title,
                waitlist_position: submission.waitlist_position!,
            });
        }
    });

    return Response.json({
        id: submission.id,
        status: submission.status,
        waitlist_position: submission.waitlist_position,
    });
}
