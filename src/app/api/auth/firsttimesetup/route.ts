import { NextRequest } from "next/server";
import { adminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
    const { token, data: input } = await req.json().catch(() => ({}));
    if (!token) return new Response("Unauthorized", { status: 401 });
    if (!input?.first_name?.trim() || !input?.last_name?.trim()) return new Response("Name is required", { status: 400 });

    const supabase = adminClient();
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (!user || error) return new Response("Unauthorized", { status: 401 });

    // Only profile fields. Role, email and publish stay with whoever invited them.
    const { data, error: updateError } = await supabase
        .schema("admin")
        .from("people")
        .update({
            first_name: input.first_name.trim(),
            last_name: input.last_name.trim(),
            ...(typeof input.pictureURL === "string" && input.pictureURL ? { pictureURL: input.pictureURL } : {}),
            account_setup: true,
        })
        .eq("id", user.id)
        .select("id")
        .maybeSingle();
    if (updateError) {
        console.log("setup update error", updateError);
        return new Response("Couldn't save your profile", { status: 500 });
    }
    if (!data) return new Response("No admin profile for this account", { status: 404 });
    return Response.json({ ok: true });
}
