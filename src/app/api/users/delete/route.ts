import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { access_token, user_id } = await req.json();
    
    if (!access_token) {
        return new Response('Unauthorized', { status: 401 });
    }
    if (!user_id) {
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

    const { data: { user }, error } = await supabase.auth.getUser(access_token);
    const { data: profile, error: profileError } = await supabase.schema('admin').from('people').select().eq('id', user?.id).single();
    if (!user || error) {
        return new Response('Unauthorized', { status: 401 });
    }
    if (!profile.role || !['President', 'Technology Coordinator'].includes(profile.role)) {
        console.log(profile.role)
        return new Response('Forbidden', { status: 403 });
    }
    if (user.id === user_id) {
        return new Response('Cannot delete own user account', { status: 400 });
    }
    const { data, error: deleteError } = await supabase.auth.admin.deleteUser(user_id);
    if (deleteError) {
        console.log("Error deleting user:", deleteError);
        return new Response('Error deleting user', { status: 500 });
    }
    return new Response('User deleted', { status: 200 });

}