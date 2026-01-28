import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
    
    const {data: { properties: { action_link } } } = await supabase.auth.admin.generateLink({
        email: user.email,
        type: "magiclink"
    })
    console.log(user.email, action_link);
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'api-key': process.env.BREVO_API_KEY!
        },
        method: 'POST',
        body: JSON.stringify({
            sender: {
                name: "DSI Admin",
                email: "jossayacamille@gmail.com"
            },
            to: [{ email: user.email, name: user.first_name + ' ' + user.last_name }],
            subject: "Your DSI Admin Account has been created",
            templateId: 1,
            params: {
                first_name: user.first_name,
                role: user.role,
                action_link
            }
           
        }) 
    }).catch((err) => {
        console.log("Error sending email:", err);
    })

    if (res && res.status >= 400) {
        console.log("Error sending email:", await res.text());
    }
    if (!res) {
        return new Response('Error sending email', { status: 500 });
    }

    return new Response('User created', { status: 200 });

}