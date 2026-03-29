export const dynamic = 'force-dynamic';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import TemplatesManager from './components/TemplatesManager';

function createAdminClient() {
    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_ADMIN_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

export default async function TemplatesPage() {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/admin/login');

    const adminSupabase = createAdminClient();
    const { data: templates } = await adminSupabase
        .from('form_templates')
        .select('*')
        .order('is_default', { ascending: false })
        .order('name');

    return (
        <div className="container pt-20 pb-10">
            <TemplatesManager templates={templates ?? []} />
        </div>
    );
}
