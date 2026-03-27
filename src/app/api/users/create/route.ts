import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import sendEmail from "../email/lib";

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
    const {data: {user: newUser}, error: createUserError } = await supabase.auth.admin.createUser({
        email: user.email,
        email_confirm: true,
    })
    if (createUserError) {
        console.log("create user error", createUserError);
        return new Response('Error creating user', { status: 400 });
    }
    
    await supabase.schema('admin').from('people').insert({...user, id: newUser?.id});
    const res = await sendEmail(user, access_token);

    if (res && res.status >= 400) {
        console.log("Error sending email:", await res.text());
    }
    if (!res) {
        return new Response('Error sending email', { status: 500 });
    }

    return new Response('User created', { status: 200 });

}