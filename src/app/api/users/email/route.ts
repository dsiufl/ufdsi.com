import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import sendEmail from "./lib";

export async function POST(req: NextRequest) {

    const { access_token, user } = await req.json();
    
    if (!access_token) {
        return new Response('Unauthorized', { status: 401 });
    }
    if (!user) {
        return new Response('No user ID provided', { status: 400 });
    }

    const res = await sendEmail(user, access_token);

    if (res && res.status >= 400) {
        console.log("Error sending email:", await res.text());
    }
    if (!res) {
        return new Response('Error sending email', { status: 500 });
    }

    return new Response('User created', { status: 200 });

}