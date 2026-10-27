import { createClient } from "@supabase/supabase-js";

// Anonymous, cookie-free client for public reads. Pages that only use this
// client can be statically cached and revalidated instead of rendering per request.
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
