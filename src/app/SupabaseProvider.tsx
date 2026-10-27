'use client';
import { SupabaseClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/nextjs";
import { createContext, useMemo, type ReactNode } from "react";

// Bridged to the current Clerk session so RLS (keyed off the Clerk JWT's
// `sub` claim) applies to the direct browser writes/storage uploads this
// client is used for (admin content editors, avatar uploads, etc.).
class Supabase extends SupabaseClient {
    constructor(getToken: () => Promise<string | null>) {
        if (process.env.NODE_ENV === "development") {
            console.log(
                "Supabase:",
                process.env.NEXT_PUBLIC_SUPABASE_URL ? "URL set" : "missing NEXT_PUBLIC_SUPABASE_URL",
                process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ? "key set" : "missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY",
            );
        }
        super(
            process.env.NEXT_PUBLIC_SUPABASE_URL || "",
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || "",
            {
                // supabase-js calls accessToken eagerly at construction time
                // (to set up Realtime auth), which happens during this
                // "use client" component's SSR pass too -- Clerk's
                // getToken() throws there since there's no browser yet.
                // Skip calling it outside the browser.
                accessToken: () => (typeof window === "undefined" ? Promise.resolve(null) : getToken()),
            }
        );
    }
    async upload(path: string, file: Blob, options?: { upsert?: boolean, contentType?: string }) {
        const {data, error} = await this.storage.from('images').upload(path, file, options);
        if (error) return { error: error.message };
        const { data: urlData } = this.storage.from('images').getPublicUrl(path);
        return urlData.publicUrl;
    }
    getPublicUrl(path: string) {
        return this.storage.from('images').getPublicUrl(path);
    }
}

export const SupabaseContext = createContext<Supabase | null>(null);

export function SupabaseProvider({ children }: { children: ReactNode }) {
    const { getToken } = useAuth();
    const client = useMemo(() => new Supabase(getToken), [getToken]);

    return (
        <SupabaseContext.Provider value={client}>
            {children}
        </SupabaseContext.Provider>
    );
}