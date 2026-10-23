import { createClient } from "@supabase/supabase-js";

/** Service-role client. Server only. */
export const adminClient = () =>
    createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_ADMIN_KEY!, {
        auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    });

/** The signed-in person's admin.people row, read with the service key so table rules can't hide it. */
export async function getAdminProfile<T = Record<string, unknown>>(id?: string | null): Promise<T | null> {
    if (!id) return null;
    const { data } = await adminClient().schema("admin").from("people").select("*").eq("id", id).maybeSingle();
    return (data as T) ?? null;
}
