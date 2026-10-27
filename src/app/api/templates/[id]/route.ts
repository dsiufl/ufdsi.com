import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClerkBridgedServerClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { userId } = await auth();
    if (!userId) return new Response('Unauthorized', { status: 401 });

    const supabase = await createClerkBridgedServerClient();
    const { data, error: fetchError } = await supabase
        .from('form_templates')
        .select('*')
        .eq('id', id)
        .single();

    if (fetchError || !data) return new Response('Template not found', { status: 404 });
    return Response.json(data);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { userId } = await auth();
    if (!userId) return new Response('Unauthorized', { status: 401 });

    const updates = await req.json();

    const supabase = await createClerkBridgedServerClient();
    const { data, error: updateError } = await supabase
        .from('form_templates')
        .update({ ...updates, updated_at: new Date().toISOString() })
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

    // Prevent deleting default templates
    const { data: template } = await supabase
        .from('form_templates')
        .select('is_default')
        .eq('id', id)
        .single();

    if (template?.is_default) {
        return new Response('Cannot delete default templates', { status: 400 });
    }

    const { error: deleteError } = await supabase
        .from('form_templates')
        .delete()
        .eq('id', id);

    if (deleteError) return new Response(deleteError.message, { status: 500 });
    return new Response(null, { status: 200 });
}
