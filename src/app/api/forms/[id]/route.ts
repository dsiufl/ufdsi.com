import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClerkBridgedServerClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { userId } = await auth();
    if (!userId) return new Response('Unauthorized', { status: 401 });

    const supabase = await createClerkBridgedServerClient();
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
    const { userId } = await auth();
    if (!userId) return new Response('Unauthorized', { status: 401 });

    const updates = await req.json();

    const supabase = await createClerkBridgedServerClient();
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
    const { userId } = await auth();
    if (!userId) return new Response('Unauthorized', { status: 401 });

    const supabase = await createClerkBridgedServerClient();
    await supabase.from('form_submissions').delete().eq('form_id', id);
    const { error: deleteError } = await supabase.from('forms').delete().eq('id', id);
    if (deleteError) return new Response(deleteError.message, { status: 500 });

    return new Response(null, { status: 200 });
}
