import { createUserClient } from "@/lib/supabase/client";
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_ADMIN_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
                detectSessionInUrl: false
            }
        }

    )
    const clientbase = createUserClient();
    const body = await req.json();
    const token = body.token
    const new_data = body.data;
    if (!token) return new Response('Unauthorized', { status: 401 });
    if (!new_data) return new Response('No data provided', { status: 400 });
    const { data: { user }, error } = await clientbase.auth.getUser(token);
    
    if (!user || error) return new Response('Unauthorized', { status: 401 });
    const { data: reup, error: err } = await supabase.rpc('debug_current_user')


    const {data, error: fetchError} = await supabase.schema('admin').from('people').select().eq('id', user.id).single();
    if (fetchError) {
        console.log("err", fetchError);

        return new Response('Error fetching user data', { status: 400 });
    }
    if (!data) {
        console.log("No admin data found for user, prompting first-time setup", user.id);
        return new Response('First-time setup required', { status: 204 });
    } else {
        
        const { count, error } = await supabase.schema('admin').from('people').update({...new_data, account_setup: true}).eq('id', user.id);
        if (error) {
            console.log("update err", error);
            return new Response('Error updating user data', { status: 400 });
        }
        return new Response(data, { status: 200 });
    }
}