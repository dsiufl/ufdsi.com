import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import validateToken from '@/lib/supabase/validate';

function adminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_ADMIN_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    const { error } = await validateToken(token ?? '');
    if (error) return new Response('Unauthorized', { status: 401 });

    const supabase = adminClient();

    const { data: form } = await supabase.from('forms').select('title').eq('id', id).single();
    const { data, error: fetchError } = await supabase
        .from('form_submissions')
        .select('*')
        .eq('form_id', id)
        .order('submitted_at');

    if (fetchError) return new Response(fetchError.message, { status: 500 });
    if (!data || data.length === 0) {
        return new Response('id,first_name,last_name,email,status,submitted_at\n', {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="submissions.csv"`,
            },
        });
    }

    // Collect all unique keys from data JSONB across all submissions
    const dataKeys = new Set<string>();
    data.forEach(sub => {
        if (sub.data && typeof sub.data === 'object') {
            Object.keys(sub.data).forEach(k => dataKeys.add(k));
        }
    });

    const coreHeaders = ['id', 'first_name', 'last_name', 'email', 'phone', 'status', 'waitlist_position', 'submitted_at'];
    const allHeaders = [...coreHeaders, ...Array.from(dataKeys)];

    function escapeCSV(val: unknown): string {
        if (val === null || val === undefined) return '';
        // File upload values are { path, name } objects — export the filename
        if (typeof val === 'object' && !Array.isArray(val) && val !== null && 'name' in val) {
            return escapeCSV((val as { name: string }).name);
        }
        const str = String(val);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    }

    const rows = data.map(sub =>
        allHeaders.map(h => {
            const val = coreHeaders.includes(h) ? sub[h] : sub.data?.[h];
            return escapeCSV(val);
        }).join(',')
    );

    const csv = [allHeaders.join(','), ...rows].join('\n');
    const filename = form?.title
        ? `${form.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-submissions.csv`
        : `submissions-${id}.csv`;

    return new Response(csv, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="${filename}"`,
        },
    });
}
