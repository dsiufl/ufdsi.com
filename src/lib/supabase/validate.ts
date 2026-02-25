import { Profile } from "@/types/db";
import { createClient, User } from "@supabase/supabase-js";

export default async function validateToken(token: string): Promise<{ user?: User; profile?: Profile; error?: string }> {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_ADMIN_KEY!,
        {auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false,
        }}
    )
    if (!token) return { error: 'Unauthorized' };
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (!user || error) return { error: 'Unauthorized' };
    const {data, error: fetchError} = await supabase.schema('admin').from('people').select().eq('id', user.id).single();
    if (fetchError) {
        return { error: 'Error fetching user data' };
    }
    return { user: user, profile: data };
    
}