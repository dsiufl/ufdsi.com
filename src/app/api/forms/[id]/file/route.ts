import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import validateToken from '@/lib/supabase/validate';

function adminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_ADMIN_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

export async function GET(req: NextRequest) {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    const { error } = await validateToken(token ?? '');
    if (error) return new Response('Unauthorized', { status: 401 });

    const path = req.nextUrl.searchParams.get('path');
    if (!path) return new Response('Missing path', { status: 400 });

    const supabase = adminClient();
    const { data, error: signError } = await supabase.storage
        .from('form-uploads')
        .createSignedUrl(path, 60 * 60); // 1 hour expiry

    if (signError || !data) return new Response('Failed to generate URL', { status: 500 });

    return Response.json({ url: data.signedUrl });
}
