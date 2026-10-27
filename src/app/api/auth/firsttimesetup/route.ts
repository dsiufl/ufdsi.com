import { createClerkBridgedServerClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return new Response('Unauthorized', { status: 401 });

    const body = await req.json();
    const new_data = body.data;
    if (!new_data) return new Response('No data provided', { status: 400 });

    const supabase = await createClerkBridgedServerClient();

    const { data, error: fetchError } = await supabase.schema('admin').from('people').select().eq('id', userId).single();
    if (fetchError) {
        console.log("err", fetchError);
        return new Response('Error fetching user data', { status: 400 });
    }
    if (!data) {
        console.log("No admin data found for user, prompting first-time setup", userId);
        return new Response('First-time setup required', { status: 204 });
    }

    // Only allow profile fields — never role/email/publish/id from the client.
    const allowed = {
        first_name: new_data.first_name,
        last_name: new_data.last_name,
        displayName: new_data.displayName,
        pictureURL: new_data.pictureURL,
    };
    const { error } = await supabase.schema('admin').from('people').update({ ...allowed, account_setup: true }).eq('id', userId);
    if (error) {
        console.log("update err", error);
        return new Response('Error updating user data', { status: 400 });
    }
    return new Response(JSON.stringify(data), { status: 200 });
}
