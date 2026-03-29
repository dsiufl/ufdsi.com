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

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    const { error } = await validateToken(token ?? '');
    if (error) return new Response('Unauthorized', { status: 401 });

    const supabase = adminClient();

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
