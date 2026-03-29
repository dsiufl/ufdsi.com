import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { notFound, redirect } from 'next/navigation';
import FormDetail from './components/FormDetail';
import { EventForm } from '@/types/db';

function createAdminClient() {
    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_ADMIN_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

export default async function FormDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/admin/login');

    const adminSupabase = createAdminClient();
    const { data: form, error } = await adminSupabase
        .from('forms')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !form) notFound();

    return (
        <div className="container pt-20">
            <FormDetail form={form as EventForm} />
        </div>
    );
}
