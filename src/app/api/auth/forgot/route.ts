import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Email } from "@/types/db";
import { adminClient } from "@/lib/supabase/admin";
import { sendLinkEmail, siteOrigin } from "../../users/email/lib";

// Same answer whether or not the email has an account.
const ok = () => new Response("ok", { status: 200 });

// Per-instance cooldown so the form can't be used to flood someone's inbox.
const lastSent = new Map<string, number>();

export async function POST(req: NextRequest) {
    const { email } = await req.json().catch(() => ({}));
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return new Response("Enter a valid email", { status: 400 });
    }
    const address = email.trim().toLowerCase();
    const origin = siteOrigin(req.nextUrl.origin);
    if (Date.now() - (lastSent.get(address) ?? 0) < 60_000) return ok();
    lastSent.set(address, Date.now());

    const { data: person } = await adminClient()
        .schema("admin")
        .from("people")
        .select("email, first_name, last_name, role")
        .ilike("email", address)
        .maybeSingle();
    if (!person) return ok();

    if (await sendLinkEmail(person, Email.RESET_PASSWORD, origin)) return ok();

    // Brevo unavailable: fall back to Supabase's own reset email.
    const anon = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!, {
        auth: { flowType: "implicit", persistSession: false, autoRefreshToken: false },
    });
    const { error } = await anon.auth.resetPasswordForEmail(person.email, { redirectTo: `${origin}/admin/login/reset-password` });
    if (error) {
        console.log("reset email error", error.message);
        return new Response(error.status === 429 ? "rate_limited" : "failed", { status: error.status === 429 ? 429 : 502 });
    }
    return ok();
}
