import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { FormField } from '@/types/db';

const ALLOWED_TYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'text/plain',
]);

const MAX_SIZE = 25 * 1024 * 1024; // 25MB

function adminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_ADMIN_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

// Issues a one-time signed upload URL; the browser then uploads straight to
// Supabase Storage. Files never pass through this function, so Vercel's 4.5MB
// request body limit doesn't apply.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id: formId } = await params;

    let body: { fieldId?: unknown; name?: unknown; type?: unknown; size?: unknown };
    try {
        body = await req.json();
    } catch {
        return new Response('Invalid JSON', { status: 400 });
    }
    const { fieldId, name, type, size } = body;

    if (typeof fieldId !== 'string' || typeof name !== 'string' || typeof type !== 'string' || typeof size !== 'number') {
        return new Response('Missing file or fieldId', { status: 400 });
    }

    if (!ALLOWED_TYPES.has(type)) {
        return new Response('File type not allowed', { status: 400 });
    }

    if (size > MAX_SIZE) {
        return new Response('File exceeds 25MB limit', { status: 400 });
    }

    // Verify the form is open and the field is a real file-upload field
    const supabase = adminClient();
    const { data: form } = await supabase.from('forms').select('status, fields').eq('id', formId).single();
    if (!form) return new Response('Form not found', { status: 404 });
    if (form.status !== 'open') return new Response('Form is not accepting submissions', { status: 400 });
    const isUploadField = (form.fields as FormField[] ?? []).some(f => f.id === fieldId && f.type === 'file-upload');
    if (!isUploadField) return new Response('Unknown upload field', { status: 400 });

    const ext = (name.split('.').pop() ?? 'bin').replace(/[^a-zA-Z0-9]/g, '').slice(0, 10) || 'bin';
    const path = `${formId}/${fieldId}/${crypto.randomUUID()}.${ext}`;
    const { data, error } = await supabase.storage
        .from('form-uploads')
        .createSignedUploadUrl(path);

    if (error || !data) return new Response('Failed to prepare upload', { status: 500 });

    return Response.json({ path, token: data.token, name });
}
