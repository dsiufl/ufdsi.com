import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClerkBridgedServerClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return new Response('Unauthorized', { status: 401 });

    const path = req.nextUrl.searchParams.get('path');
    if (!path) return new Response('Missing path', { status: 400 });

    const supabase = await createClerkBridgedServerClient();
    const { data, error: signError } = await supabase.storage
        .from('form-uploads')
        .createSignedUrl(path, 60 * 60); // 1 hour expiry

    if (signError || !data) return new Response('Failed to generate URL', { status: 500 });

    return Response.json({ url: data.signedUrl });
}
