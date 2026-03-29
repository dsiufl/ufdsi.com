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
    if (!token) return new Response('Unauthorized', { status: 401 });

    const { error } = await validateToken(token);
    if (error) return new Response('Unauthorized', { status: 401 });

    const supabase = adminClient();
    const { data, error: fetchError } = await supabase
        .from('form_templates')
        .select('*')
        .order('is_default', { ascending: false })
        .order('name');

    if (fetchError) return new Response(fetchError.message, { status: 500 });
    return Response.json(data);
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { access_token, ...template } = body;

    const { user, error } = await validateToken(access_token);
    if (error || !user) return new Response('Unauthorized', { status: 401 });

    const supabase = adminClient();
    const { data, error: insertError } = await supabase
        .from('form_templates')
        .insert({ ...template, created_by: user.id })
        .select()
        .single();

    if (insertError) return new Response(insertError.message, { status: 400 });
    return Response.json(data);
}
