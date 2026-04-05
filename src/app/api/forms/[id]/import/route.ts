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

interface ImportRow {
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    data: Record<string, string>;
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: formId } = await params;
    const body = await req.json();
    const { access_token, rows, skip_duplicates, default_status } = body as {
        access_token: string;
        rows: ImportRow[];
        skip_duplicates: boolean;
        default_status: 'confirmed' | 'pending';
    };

    const { error } = await validateToken(access_token);
    if (error) return new Response('Unauthorized', { status: 401 });

    const supabase = adminClient();

    // Verify form exists
    const { data: form } = await supabase.from('forms').select('id').eq('id', formId).single();
    if (!form) return new Response('Form not found', { status: 404 });

    let skipped = 0;
    const errors: { row: number; message: string }[] = [];
    const toInsert: Array<{
        form_id: string;
        first_name: string;
        last_name: string;
        email: string;
        phone: string | null;
        data: Record<string, string>;
        status: string;
    }> = [];

    // Check for existing emails if skip_duplicates
    let existingEmails = new Set<string>();
    if (skip_duplicates && rows.length > 0) {
        const emails = rows.map(r => r.email.toLowerCase().trim()).filter(Boolean);
        const { data: existing } = await supabase
            .from('form_submissions')
            .select('email')
            .eq('form_id', formId)
            .in('email', emails);
        existingEmails = new Set((existing ?? []).map(e => e.email));
    }

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (!row.first_name || !row.last_name || !row.email) {
            errors.push({ row: i + 1, message: 'Missing required fields' });
            continue;
        }

        const email = row.email.toLowerCase().trim();
        if (skip_duplicates && existingEmails.has(email)) {
            skipped++;
            continue;
        }

        toInsert.push({
            form_id: formId,
            first_name: row.first_name.trim(),
            last_name: row.last_name.trim(),
            email,
            phone: row.phone || null,
            data: row.data,
            status: default_status ?? 'confirmed',
        });
    }

    let imported = 0;
    if (toInsert.length > 0) {
        // Insert in batches of 100
        for (let i = 0; i < toInsert.length; i += 100) {
            const batch = toInsert.slice(i, i + 100);
            const { error: insertError, count } = await supabase
                .from('form_submissions')
                .insert(batch);

            if (insertError) {
                errors.push({ row: i + 1, message: insertError.message });
            } else {
                imported += batch.length;
            }
        }
    }

    return Response.json({ imported, skipped, errors });
}
