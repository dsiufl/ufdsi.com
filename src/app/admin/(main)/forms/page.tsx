export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import FormsManager from './components/FormsManager';
import { EventForm } from '@/types/db';

function createAdminClient() {
    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_ADMIN_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

export default async function FormsPage() {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const adminSupabase = createAdminClient();

    const { data: forms } = await adminSupabase
        .from('forms')
        .select('*')
        .order('created_at', { ascending: false });

    // Fetch submission counts per form using admin client (bypasses RLS on form_submissions)
    const formIds = (forms ?? []).map((f: EventForm) => f.id);
    const counts: Record<string, { total: number; confirmed: number; waitlist: number }> = {};

    if (formIds.length > 0) {
        const { data: submissions } = await adminSupabase
            .from('form_submissions')
            .select('form_id, status')
            .in('form_id', formIds);

        (submissions ?? []).forEach((s: { form_id: string; status: string }) => {
            if (!counts[s.form_id]) counts[s.form_id] = { total: 0, confirmed: 0, waitlist: 0 };
            counts[s.form_id].total++;
            if (s.status === 'confirmed') counts[s.form_id].confirmed++;
            if (s.status === 'waitlist') counts[s.form_id].waitlist++;
        });
    }

    return (
        <div className="container pt-20">
            <FormsManager forms={forms ?? []} counts={counts} />
        </div>
    );
}
