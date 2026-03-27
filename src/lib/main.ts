import { createClient } from "@supabase/supabase-js";
import { createClient as serverClient } from "./supabase/server";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY)

export { supabase }