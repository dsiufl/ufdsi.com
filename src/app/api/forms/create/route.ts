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

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { access_token, ...form } = body;

    const { user, error } = await validateToken(access_token);
    if (error || !user) return new Response('Unauthorized', { status: 401 });

    const supabase = adminClient();

    // Ensure slug uniqueness
    if (form.slug) {
        const { data: existing } = await supabase.from('forms').select('id').eq('slug', form.slug).maybeSingle();
        if (existing) {
            form.slug = `${form.slug}-${Math.random().toString(36).slice(2, 6)}`;
        }
    }

    const { data, error: insertError } = await supabase
        .from('forms')
        .insert({ ...form, created_by: user.id })
        .select()
        .single();

    if (insertError) return new Response(insertError.message, { status: 400 });
    return Response.json(data);
}
