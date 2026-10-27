import { createBrowserClient } from '@supabase/ssr'
import { useAuth } from '@clerk/nextjs'
import { useMemo } from 'react'

export function createUserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
  )

}

// Supabase client bridged to the current Clerk session — RLS keys off the
// Clerk JWT's `sub` claim instead of Supabase's own auth.uid(). Use this (not
// createUserClient) for any browser-side call that should be subject to RLS
// as the signed-in admin user (admin content editors, self-service settings).
export function useSupabaseClient() {
  const { getToken } = useAuth()
  return useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    { accessToken: async () => getToken() }
  ), [getToken])
}