import { NextRequest } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createClerkBridgedServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return new Response('Unauthorized', { status: 401 });
    }

    const { user_id } = await req.json();
    if (!user_id) {
        return new Response('No user ID provided', { status: 400 });
    }
    if (user_id === userId) {
        return new Response('Cannot delete own user account', { status: 400 });
    }

    const supabase = await createClerkBridgedServerClient();
    // Delete the DB row first (RLS: people_delete_privileged) — only on success
    // do we touch the Clerk account. No more ON DELETE CASCADE to lean on.
    const { data, error } = await supabase
        .schema('admin')
        .from('people')
        .delete()
        .eq('id', user_id)
        .select();

    if (error) {
        console.log("delete error", error);
        return new Response('Error deleting user', { status: 500 });
    }
    if (!data || data.length === 0) {
        return new Response('Forbidden', { status: 403 });
    }

    try {
        const client = await clerkClient();
        await client.users.deleteUser(user_id);
    } catch (err) {
        console.log("Error deleting Clerk user:", err);
        return new Response('Deleted database row but failed to delete Clerk account', { status: 500 });
    }

    return new Response('User deleted', { status: 200 });
}
