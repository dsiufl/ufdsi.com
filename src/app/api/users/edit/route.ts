import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClerkBridgedServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return new Response('Unauthorized', { status: 401 });
    }

    const { user } = await req.json();
    if (!user?.id) {
        return new Response('No user ID provided', { status: 400 });
    }

    const supabase = await createClerkBridgedServerClient();
    const { data, error } = await supabase
        .schema('admin')
        .from('people')
        .update(user)
        .eq('id', user.id)
        .select();

    if (error) {
        console.log("update error", error);
        return new Response('Error updating user', { status: 500 });
    }
    // RLS (people_update_privileged) silently filters rows the caller isn't
    // allowed to touch — zero rows affected means "forbidden", not "not found".
    if (!data || data.length === 0) {
        return new Response('Forbidden', { status: 403 });
    }

    return new Response('User edited', { status: 200 });
}
