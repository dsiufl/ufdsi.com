'use client';
import { createUserClient } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { createContext } from "react"


class Supabase extends SupabaseClient {
    constructor() {
        console.log("Creating Supabase client with URL:", process.env.NEXT_PUBLIC_SUPABASE_URL, "and Key:", process.env.NEXT_PUBLIC_SUPABASE_KEY);
        super(
            process.env.NEXT_PUBLIC_SUPABASE_URL || "",
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || ""
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

export function SupabaseProvider({ children }: { children: React.ReactNode }) {

    return (
        <SupabaseContext.Provider value={new Supabase()}>
            {children}
        </SupabaseContext.Provider>
    )
}