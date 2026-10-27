// Retention purge (see /privacy): delete form submissions and uploaded files
// older than a cutoff. Run once a year, by May 31.
//
//   node --env-file=.env.local scripts/purge-forms.mjs --before 2027-05-31            # dry run
//   node --env-file=.env.local scripts/purge-forms.mjs --before 2027-05-31 --execute  # delete
//
// Forms themselves (titles, fields, settings) are kept so they can be reused.

import { createClient } from '@supabase/supabase-js';
import { parseArgs } from 'node:util';

const { values: args } = parseArgs({
    options: {
        before: { type: 'string' },
        execute: { type: 'boolean', default: false },
    },
});

const cutoff = new Date(args.before ?? '');
if (isNaN(cutoff.getTime())) {
    console.error('Usage: --before YYYY-MM-DD [--execute]');
    process.exit(1);
}

const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_ADMIN_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
});
const bucket = admin.storage.from('form-uploads');
const mode = args.execute ? 'DELETING' : 'DRY RUN';
console.log(`${mode}: submissions and files created before ${cutoff.toISOString()}\n`);

// Storage layout is <formId>/<fieldId>/<uuid>.<ext> (older uploads: <formId>/<file>).
// Folders come back from list() with id === null.
async function listOldFiles(prefix) {
    const out = [];
    for (let offset = 0; ; offset += 1000) {
        const { data, error } = await bucket.list(prefix, { limit: 1000, offset });
        if (error) throw error;
        for (const item of data) {
            const path = prefix ? `${prefix}/${item.name}` : item.name;
            if (item.id === null) out.push(...await listOldFiles(path));
            else if (new Date(item.created_at) < cutoff) out.push(path);
        }
        if (data.length < 1000) break;
    }
    return out;
}

const { count, error: countErr } = await admin
    .from('form_submissions')
    .select('*', { count: 'exact', head: true })
    .lt('submitted_at', cutoff.toISOString());
if (countErr) throw countErr;

const files = await listOldFiles('');
console.log(`Submissions: ${count}`);
console.log(`Files:       ${files.length}`);

if (!args.execute) {
    console.log('\nNothing deleted. Re-run with --execute to delete.');
    process.exit(0);
}

for (let i = 0; i < files.length; i += 100) {
    const { error } = await bucket.remove(files.slice(i, i + 100));
    if (error) throw error;
}
const { error: delErr } = await admin.from('form_submissions').delete().lt('submitted_at', cutoff.toISOString());
if (delErr) throw delErr;

console.log('\nDone.');
