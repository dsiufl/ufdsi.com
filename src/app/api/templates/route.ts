import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClerkBridgedServerClient } from '@/lib/supabase/server';

export async function GET() {
    const { userId } = await auth();
    if (!userId) return new Response('Unauthorized', { status: 401 });

    const supabase = await createClerkBridgedServerClient();
    const { data, error: fetchError } = await supabase
        .from('form_templates')
        .select('*')
        .order('is_default', { ascending: false })
        .order('name');

    if (fetchError) return new Response(fetchError.message, { status: 500 });
    return Response.json(data);
}

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return new Response('Unauthorized', { status: 401 });

    const template = await req.json();

    const supabase = await createClerkBridgedServerClient();
    const { data, error: insertError } = await supabase
        .from('form_templates')
        .insert({ ...template, created_by: userId })
        .select()
        .single();

    if (insertError) return new Response(insertError.message, { status: 400 });
    return Response.json(data);
}
