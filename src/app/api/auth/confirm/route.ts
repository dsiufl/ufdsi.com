import validateToken from "@/lib/supabase/validate";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { access_token } = await req.json();
    
    if (access_token) {
        const result = await validateToken(access_token as string);
        if (result.user && !result.error) {
            if (result.profile && result.profile.account_setup) return new Response('Authorized', { status: 200 });
            return new Response('setup_password', { status: 202 });
        }
    }
    return new Response('Unauthorized', { status: 401 });
}