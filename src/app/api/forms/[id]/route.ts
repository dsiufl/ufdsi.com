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
    const { data, error: fetchError } = await supabase
        .from('forms')
        .select('*')
        .eq('id', id)
        .single();

    if (fetchError) return new Response('Not found', { status: 404 });
    return Response.json(data);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { access_token, ...updates } = await req.json();

    const { error } = await validateToken(access_token);
    if (error) return new Response('Unauthorized', { status: 401 });

    const supabase = adminClient();
    const { data, error: updateError } = await supabase
        .from('forms')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (updateError) return new Response(updateError.message, { status: 400 });
    return Response.json(data);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { access_token } = await req.json();

    const { error } = await validateToken(access_token);
    if (error) return new Response('Unauthorized', { status: 401 });

    const supabase = adminClient();
    await supabase.from('form_submissions').delete().eq('form_id', id);
    const { error: deleteError } = await supabase.from('forms').delete().eq('id', id);
    if (deleteError) return new Response(deleteError.message, { status: 500 });

    return new Response(null, { status: 200 });
}
