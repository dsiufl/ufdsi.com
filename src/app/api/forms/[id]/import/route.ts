import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClerkBridgedServerClient } from '@/lib/supabase/server';

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
    const { userId } = await auth();
    if (!userId) return new Response('Unauthorized', { status: 401 });

    const body = await req.json();
    const { rows, skip_duplicates, default_status } = body as {
        rows: ImportRow[];
        skip_duplicates: boolean;
        default_status: 'confirmed' | 'pending';
    };

    const supabase = await createClerkBridgedServerClient();

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

    // form_submissions has a partial unique index on (form_id, lower(email))
    // WHERE status <> 'cancelled' -- a duplicate against an existing
    // non-cancelled row, or a duplicate within this same file, fails that
    // row at the DB level regardless of skip_duplicates. Treat both the
    // same way: skip_duplicates=true silently skips them, false reports
    // them as errors -- neither path attempts an insert the DB would reject.
    let existingEmails = new Set<string>();
    if (rows.length > 0) {
        const emails = rows.map(r => r.email.toLowerCase().trim()).filter(Boolean);
        const { data: existing } = await supabase
            .from('form_submissions')
            .select('email')
            .eq('form_id', formId)
            .neq('status', 'cancelled')
            .in('email', emails);
        existingEmails = new Set((existing ?? []).map(e => e.email));
    }

    const seenInFile = new Set<string>();

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (!row.first_name || !row.last_name || !row.email) {
            errors.push({ row: i + 1, message: 'Missing required fields' });
            continue;
        }

        const email = row.email.toLowerCase().trim();
        const isDuplicate = existingEmails.has(email) || seenInFile.has(email);
        if (isDuplicate) {
            if (skip_duplicates) {
                skipped++;
            } else {
                errors.push({ row: i + 1, message: `Duplicate email (${email}) -- already registered or repeated in this file` });
            }
            continue;
        }
        seenInFile.add(email);

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
        // Insert in batches of 100; fall back to per-row insert on a batch
        // failure so one bad row (e.g. a race against a concurrent
        // submission) doesn't sink the other 99 with a single vague error.
        for (let i = 0; i < toInsert.length; i += 100) {
            const batch = toInsert.slice(i, i + 100);
            const { error: insertError } = await supabase
                .from('form_submissions')
                .insert(batch);

            if (!insertError) {
                imported += batch.length;
                continue;
            }

            for (let j = 0; j < batch.length; j++) {
                const { error: rowError } = await supabase
                    .from('form_submissions')
                    .insert(batch[j]);
                if (rowError) {
                    errors.push({ row: i + j + 1, message: rowError.message });
                } else {
                    imported++;
                }
            }
        }
    }

    return Response.json({ imported, skipped, errors });
}
