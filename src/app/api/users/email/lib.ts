import { Profile } from "@/types/db";
import { createClient } from "@supabase/supabase-js";

export default async function sendEmail(user: Profile, access_token: string) {
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
    console.log(`${process.env.VERCEL_URL ?? "https://unstable.jcamille.dev"}/admin/login/link`)
    const {data: { properties: { hashed_token, action_link } } } = await supabase.auth.admin.generateLink({
        email: user.email,
        type: "magiclink",
        options: {
            redirectTo: `${process.env.VERCEL_URL ?? "https://unstable.jcamille.dev"}/admin/login/link`
        }
        
    })
    console.log("Action link:", action_link);
    const token = action_link.match(/token=([^&]+)/)?.[1];
    return await fetch("https://api.brevo.com/v3/smtp/email", {
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
                action_link: `${process.env.VERCEL_URL ?? "https://unstable.jcamille.dev"}/admin/login/link?token=${hashed_token}`
            }
           
        }) 
    }).catch((err) => {
        console.log("Error sending email:", err);
    })
}