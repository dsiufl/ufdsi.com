import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { access_token, user } = await req.json();
    
    if (!access_token) {
        return new Response('Unauthorized', { status: 401 });
    }
    if (!user) {
        return new Response('No user ID provided', { status: 400 });
    }


    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_ADMIN_KEY!,
        {auth: {
            autoRefreshToken: false,
            persistSession: false
        }}
    );

    const { data: { user: auth }, error } = await supabase.auth.getUser(access_token);
    const { data: profile, error: profileError } = await supabase.schema('admin').from('people').select().eq('id', auth?.id).single();
    if (!auth || error) {
        console.log("auth error", error);
        console.log(access_token)   
        return new Response('Unauthorized', { status: 401 });
    }
    if (!profile.role || !['President', 'Technology Coordinator'].includes(profile.role)) {
        console.log(profile.role)
        return new Response('Forbidden', { status: 403 });
    }
    await supabase.schema('admin').from('people').update(user).eq('id', user.id);
    return new Response('User edited', { status: 200 });

}