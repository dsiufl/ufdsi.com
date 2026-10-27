import { NextRequest } from "next/server";
import { Webhook } from "svix";
import { createClient } from "@supabase/supabase-js";

interface ClerkUserCreatedEvent {
    type: string;
    data: {
        id: string;
        primary_email_address_id: string | null;
        email_addresses: { id: string; email_address: string }[];
    };
}

export async function POST(req: NextRequest) {
    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (!secret) {
        console.error("CLERK_WEBHOOK_SECRET is not set");
        return new Response('Server misconfigured', { status: 500 });
    }

    const payload = await req.text();
    const svixHeaders = {
        'svix-id': req.headers.get('svix-id') ?? '',
        'svix-timestamp': req.headers.get('svix-timestamp') ?? '',
        'svix-signature': req.headers.get('svix-signature') ?? '',
    };

    let event: ClerkUserCreatedEvent;
    try {
        const wh = new Webhook(secret);
        event = wh.verify(payload, svixHeaders) as ClerkUserCreatedEvent;
    } catch (err) {
        console.log("Clerk webhook signature verification failed:", err);
        return new Response('Invalid signature', { status: 400 });
    }

    if (event.type !== 'user.created') {
        return new Response('Ignored', { status: 200 });
    }

    const clerkUser = event.data;
    const email =
        clerkUser.email_addresses?.find((e) => e.id === clerkUser.primary_email_address_id)
            ?.email_address ?? clerkUser.email_addresses?.[0]?.email_address;

    if (!email) {
        return new Response('No email on Clerk user', { status: 400 });
    }

    // System-to-system call with no user session to bridge — the one
    // legitimate direct use of the service-role key outside the public
    // form-submission endpoints.
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_ADMIN_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { error } = await supabase
        .schema('admin')
        .from('people')
        .update({ id: clerkUser.id })
        .eq('email', email)
        .like('id', 'pending:%');

    if (error) {
        console.log("Error backfilling admin.people.id:", error);
        return new Response('Error backfilling user', { status: 500 });
    }

    return new Response('OK', { status: 200 });
}
