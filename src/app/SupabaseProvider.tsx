'use client';
import { createUserClient } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { createContext } from "react"

export const SupabaseContext = createContext<SupabaseClient | null>(null);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {

    return (
        <SupabaseContext.Provider value={createUserClient()}>
            {children}
        </SupabaseContext.Provider>
    )
}