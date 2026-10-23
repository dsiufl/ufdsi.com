import { Email, Profile } from "@/types/db";
import { adminClient } from "@/lib/supabase/admin";

const PRODUCTION = "https://ufdsi.com";

// Vercel gives bare hostnames, request origins come with a protocol.
export const siteOrigin = (origin?: string) => {
    const raw = origin || process.env.VERCEL_PROJECT_PRODUCTION_URL || PRODUCTION;
    return (raw.startsWith("http") ? raw : `https://${raw}`).replace(/\/$/, "");
};

type Recipient = Pick<Profile, "email" | "first_name" | "last_name" | "role">;

/** Emails a one-time link to /admin/login/link. Returns true when the email went out. */
export async function sendLinkEmail(user: Recipient, type: Email, origin?: string): Promise<boolean> {
    const supabase = adminClient();
    const linkType = type === Email.INVITE_EMAIL ? "magiclink" : "recovery";
    const { data, error } = await supabase.auth.admin.generateLink({ email: user.email, type: linkType });
    if (error || !data?.properties?.hashed_token) {
        console.log("generateLink error", error);
        return false;
    }
    if (!process.env.BREVO_API_KEY) return false;

    const link = `${siteOrigin(origin)}/admin/login/link?token=${data.properties.hashed_token}&type=${linkType}`;
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { accept: "application/json", "content-type": "application/json", "api-key": process.env.BREVO_API_KEY },
        body: JSON.stringify({
            sender: { name: "DSI Admin", email: "jossayacamille@gmail.com" },
            to: [{ email: user.email, name: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || user.email }],
            subject: type === Email.INVITE_EMAIL ? "Your DSI admin account is ready" : "Reset your DSI admin password",
            templateId: type,
            params: { first_name: user.first_name, role: user.role, action_link: link },
        }),
    }).catch((err) => {
        console.log("Error sending email:", err);
        return null;
    });
    if (!res || res.status >= 400) {
        console.log("Brevo error", res?.status, await res?.text());
        return false;
    }
    return true;
}

/** Checks the caller is a President or Technology Coordinator, then sends the email. */
export default async function sendEmail(user: Profile, access_token: string, type: Email = Email.INVITE_EMAIL, origin?: string) {
    const supabase = adminClient();
    const { data: { user: auth }, error } = await supabase.auth.getUser(access_token);
    if (!auth || error) return new Response("Unauthorized", { status: 401 });
    const { data: profile } = await supabase.schema("admin").from("people").select("role").eq("id", auth.id).single();
    if (!profile?.role || !["President", "Technology Coordinator"].includes(profile.role)) {
        return new Response("Forbidden", { status: 403 });
    }
    const sent = await sendLinkEmail(user, type, origin);
    return sent ? new Response("Sent", { status: 200 }) : new Response("Error sending email", { status: 502 });
}
