export const dynamic = 'force-dynamic';

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createClerkBridgedServerClient } from '@/lib/supabase/server';
import TemplatesManager from './components/TemplatesManager';

export default async function TemplatesPage() {
    const { userId } = await auth();
    if (!userId) redirect('/admin/login');

    const supabase = await createClerkBridgedServerClient();
    const { data: templates } = await supabase
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
