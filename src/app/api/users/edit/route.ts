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

    // Privileged full-row edits (role/email/publish) go through
    // admin.update_person() -- a SECURITY DEFINER function, not a plain RLS
    // policy. A plain policy here would let a non-privileged user's own-row
    // update (admin_people_update_own) smuggle a role change through, since
    // Postgres ORs permissive policies together. Fetch the current row
    // first so fields the edit form doesn't collect (e.g. displayName)
    // aren't nulled out by the update.
    const { data: current, error: fetchError } = await supabase
        .schema('admin')
        .from('people')
        .select()
        .eq('id', user.id)
        .single();

    if (fetchError || !current) {
        return new Response('User not found', { status: 404 });
    }

    const { data, error } = await supabase
        .schema('admin')
        .rpc('update_person', {
            target_id: user.id,
            new_role: user.role ?? current.role,
            new_email: user.email ?? current.email,
            new_publish: user.publish ?? current.publish,
            new_first_name: user.first_name ?? current.first_name,
            new_last_name: user.last_name ?? current.last_name,
            new_display_name: user.displayName ?? current.displayName,
            new_picture_url: user.pictureURL ?? current.pictureURL,
        });

    if (error) {
        if (error.code === '42501') {
            return new Response('Forbidden', { status: 403 });
        }
        if (error.code === 'P0002') {
            return new Response('User not found', { status: 404 });
        }
        console.log("update error", error);
        return new Response('Error updating user', { status: 500 });
    }

    return new Response(JSON.stringify(data), { status: 200 });
}
