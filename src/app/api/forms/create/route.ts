import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClerkBridgedServerClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return new Response('Unauthorized', { status: 401 });

    const form = await req.json();

    const supabase = await createClerkBridgedServerClient();

    // Ensure slug uniqueness
    if (form.slug) {
        const { data: existing } = await supabase.from('forms').select('id').eq('slug', form.slug).maybeSingle();
        if (existing) {
            form.slug = `${form.slug}-${Math.random().toString(36).slice(2, 6)}`;
        }
    }

    const { data, error: insertError } = await supabase
        .from('forms')
        .insert({ ...form, created_by: userId })
        .select()
        .single();

    if (insertError) return new Response(insertError.message, { status: 400 });
    return Response.json(data);
}
