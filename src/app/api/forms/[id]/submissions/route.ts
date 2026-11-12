import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClerkBridgedServerClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { userId } = await auth();
    if (!userId) return new Response('Unauthorized', { status: 401 });

    const supabase = await createClerkBridgedServerClient();

    const url = new URL(req.url);
    const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50'), 200);
    const offset = parseInt(url.searchParams.get('offset') ?? '0');

    const { count } = await supabase
        .from('form_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('form_id', id);

    const { data, error: fetchError } = await supabase
        .from('form_submissions')
        .select('*')
        .eq('form_id', id)
        .order('submitted_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (fetchError) return new Response(fetchError.message, { status: 500 });
    return Response.json({ data: data ?? [], total: count ?? 0 });
}
