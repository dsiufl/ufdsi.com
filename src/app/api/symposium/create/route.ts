import { NextRequest } from "next/server";
import { auth } from '@clerk/nextjs/server';
import { createClerkBridgedServerClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { year } = await req.json();
    const supabase = await createClerkBridgedServerClient();

    const { data: symposium, error: symposiumError } = await supabase.from('symposiums').insert({ id: year }).select('*').single();
    if (symposiumError) {
        return new Response(JSON.stringify({ error: symposiumError.message }), { status: 500 });
    }
    return new Response(JSON.stringify({ symposium }), { status: 200 });
}
