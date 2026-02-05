import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
export async function POST(req: NextRequest) {
    const { token, year } = await req.json();
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_ADMIN_KEY!
    )
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    const { data: profile, error: profileError } = await supabase.schema('admin').from('people').select('*').eq('id', user.id).single();
    if (profileError || !profile) {
        return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }
    const { data: symposium, error: symposiumError } = await supabase.from('symposiums').insert({ id: year }).select('*').single();
    if (symposiumError) {
        return new Response(JSON.stringify({ error: symposiumError.message }), { status: 500 });
    }
    return new Response(JSON.stringify({ symposium }), { status: 200 });
}