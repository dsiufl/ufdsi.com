import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id: formId } = await params;

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const fieldId = formData.get('fieldId') as string | null;

    if (!file || !fieldId) {
        return new Response('Missing file or fieldId', { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
        return new Response('File type not allowed', { status: 400 });
    }

    if (file.size > MAX_SIZE) {
        return new Response('File exceeds 25MB limit', { status: 400 });
    }

    const ext = file.name.split('.').pop() ?? 'bin';
    const path = `${formId}/${fieldId}-${Date.now()}.${ext}`;

    const supabase = adminClient();
    const { error } = await supabase.storage
        .from('form-uploads')
        .upload(path, file, {
            contentType: file.type,
            upsert: false,
        });

    if (error) return new Response(error.message, { status: 500 });

    return Response.json({ path, name: file.name });
}
