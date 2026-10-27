import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createClerkBridgedServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return new Response('Unauthorized', { status: 401 });
    }

    const { user } = await req.json();
    if (!user?.email) {
        return new Response('No user data provided', { status: 400 });
    }

    const supabase = await createClerkBridgedServerClient();
    // The invitee's Clerk user id doesn't exist yet (they haven't accepted the
    // invite), so we seed a placeholder PK and let /api/webhooks/clerk backfill
    // the real Clerk id once their user.created event arrives.
    const pendingId = `pending:${randomUUID()}`;

    const { data: inserted, error: insertError } = await supabase
        .schema('admin')
        .from('people')
        .insert({ ...user, id: pendingId, account_setup: false })
        .select()
        .single();

    if (insertError) {
        // RLS (people_insert_privileged) rejects this for non-President/Tech-Coord callers.
        console.log("insert error", insertError);
        return new Response('Forbidden', { status: 403 });
    }

    try {
        const client = await clerkClient();
        await client.invitations.createInvitation({
            emailAddress: user.email,
            redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/admin/accept-invite`,
        });
    } catch (err) {
        console.log("Error creating Clerk invitation:", err);
        await supabase.schema('admin').from('people').delete().eq('id', pendingId);
        return new Response('Error sending invite', { status: 500 });
    }

    return new Response(JSON.stringify(inserted), { status: 200 });
}
