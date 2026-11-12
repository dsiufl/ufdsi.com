// Load test for public form submission, sized for a ~100-person GBM.
//
// Usage (env from .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_ADMIN_KEY,
// NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY):
//   node --env-file=.env.local scripts/loadtest/forms.mjs \
//     --base https://<preview>.vercel.app --slug loadtest-gbm3 [--bypass <vercel-token>] \
//     [--submits 100] [--uploads 20] [--upload-mb 10] [--cleanup-only]
//
// Setup: in admin, create an OPEN form whose slug starts with "loadtest-", with
// capacity = submits / 2 (default 50), First Name / Last Name / Email fields,
// no allowed-domain restriction, and optionally a file-upload field.
// Set EMAIL_PROVIDER=none on the deployment under test so no emails are sent.
//
// The script wipes that form's submissions and files before and after running.

import { createClient } from '@supabase/supabase-js';
import { parseArgs } from 'node:util';

const { values: args } = parseArgs({
    options: {
        base: { type: 'string' },
        slug: { type: 'string' },
        bypass: { type: 'string' },
        submits: { type: 'string', default: '100' },
        uploads: { type: 'string', default: '20' },
        'upload-mb': { type: 'string', default: '10' },
        'cleanup-only': { type: 'boolean', default: false },
    },
});

if (!args.slug?.startsWith('loadtest-')) {
    console.error('Refusing to run: --slug must start with "loadtest-" (this script deletes its submissions).');
    process.exit(1);
}
if (!args['cleanup-only'] && !args.base) {
    console.error('Missing --base <deployment url>');
    process.exit(1);
}

const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_ADMIN_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
});
const anon = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? process.env.SUPABASE_ADMIN_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

const base = args.base?.replace(/\/$/, '');
const headers = args.bypass ? { 'x-vercel-protection-bypass': args.bypass } : {};
const results = [];

function check(name, ok, detail = '') {
    results.push({ name, ok });
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
}

function pct(sorted, p) {
    return sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))] : 0;
}

function latencySummary(ms) {
    const s = [...ms].sort((a, b) => a - b);
    return { p50: pct(s, 50), p95: pct(s, 95), p99: pct(s, 99), max: s.at(-1) ?? 0 };
}

async function timed(fn) {
    const t = performance.now();
    const res = await fn();
    return { res, ms: Math.round(performance.now() - t) };
}

async function cleanup(formId) {
    await admin.from('form_submissions').delete().eq('form_id', formId);
    const { data: dirs } = await admin.storage.from('form-uploads').list(formId, { limit: 1000 });
    for (const dir of dirs ?? []) {
        const { data: files } = await admin.storage.from('form-uploads').list(`${formId}/${dir.name}`, { limit: 1000 });
        const paths = (files ?? []).map(f => `${formId}/${dir.name}/${f.name}`);
        if (paths.length) await admin.storage.from('form-uploads').remove(paths);
    }
}

// Build a valid answer set for the form, keyed by label like DynamicForm does
function buildPayload(fields, i, uploadValue) {
    const data = {};
    const sample = {
        'short-text': `Test ${i}`, 'long-text': 'Load test answer', phone: '3525550100', number: '1',
        'uf-id': '12345678', date: '2026-11-01', 'yes-no': 'Yes', waiver: true,
        'emergency-contact': { name: 'Test Contact', phone: '3525550101' },
    };
    let first, last, email;
    for (const f of fields) {
        if (['section-header', 'info-banner', 'page-break'].includes(f.type)) continue;
        const label = f.label.toLowerCase().trim();
        let val;
        if (label.includes('first name')) val = first = `Load${i}`;
        else if (label.includes('last name')) val = last = 'Tester';
        else if (f.type === 'email') val = email = `loadtest+${i}-${Date.now()}@example.com`;
        else if (f.type === 'file-upload') { if (!uploadValue) continue; val = uploadValue; }
        else if (['dropdown', 'radio'].includes(f.type)) val = f.options?.[0];
        else if (['checkbox-group', 'chip-select'].includes(f.type)) val = f.options?.slice(0, 1);
        else val = sample[f.type] ?? 'x';
        if (val !== undefined) data[f.label] = val;
    }
    return { first_name: first, last_name: last, email, consent: true, website: '', data };
}

async function submit(formId, payload) {
    const r = await fetch(`${base}/api/forms/${formId}/submit`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return { status: r.status, body: await r.text() };
}

async function signedUpload(formId, fieldId, bytes) {
    const r = await fetch(`${base}/api/forms/${formId}/upload`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ fieldId, name: 'resume.pdf', type: 'application/pdf', size: bytes.length }),
    });
    if (!r.ok) return { ok: false, error: `${r.status} ${await r.text()}` };
    const { path, token, name } = await r.json();
    const { error } = await anon.storage.from('form-uploads')
        .uploadToSignedUrl(path, token, new Blob([bytes], { type: 'application/pdf' }), { contentType: 'application/pdf' });
    return error ? { ok: false, error: error.message } : { ok: true, value: { path, name } };
}

// ---------------------------------------------------------------------------

const { data: form, error: formErr } = await admin.from('forms').select('*').eq('slug', args.slug).single();
if (formErr || !form) {
    console.error(`Form "${args.slug}" not found`);
    process.exit(1);
}

await cleanup(form.id);
if (args['cleanup-only']) {
    console.log('Cleaned up.');
    process.exit(0);
}

const N = parseInt(args.submits);
const capacity = form.capacity;
if (form.status !== 'open') { console.error('Form must be open'); process.exit(1); }
if (capacity == null || capacity * 2 !== N) {
    console.error(`Set the form's capacity to ${N / 2} (submits / 2) so the burst fills both confirmed and waitlist.`);
    process.exit(1);
}
const fileField = form.fields.find(f => f.type === 'file-upload');
console.log(`Form ${form.slug} (${form.id}), capacity ${capacity}, ${N} submits\n`);

// 1. Page load burst: 150 GETs spread over ~30s
{
    const ms = [];
    let errors = 0;
    await Promise.all(Array.from({ length: 150 }, (_, i) => new Promise(resolve => setTimeout(async () => {
        try {
            const { res, ms: t } = await timed(() => fetch(`${base}/forms/${form.slug}`, { headers, redirect: 'manual' }));
            ms.push(t);
            if (res.status >= 400) errors++;
        } catch { errors++; }
        resolve();
    }, i * 200))));
    const l = latencySummary(ms);
    check('page load burst: 0 errors', errors === 0, `errors=${errors} p50=${l.p50}ms p95=${l.p95}ms p99=${l.p99}ms`);
}

// 2. Uploads: concurrent signed-URL flows (needed first so submits can reference files)
let uploadValues = [];
if (fileField) {
    const count = parseInt(args.uploads);
    const bytes = new Uint8Array(parseInt(args['upload-mb']) * 1024 * 1024);
    const outs = await Promise.all(Array.from({ length: count }, () => timed(() => signedUpload(form.id, fileField.id, bytes))));
    const ok = outs.filter(o => o.res.ok);
    uploadValues = ok.map(o => o.res.value);
    const l = latencySummary(outs.map(o => o.ms));
    const firstErr = outs.find(o => !o.res.ok)?.res.error;
    check(`uploads: ${count} x ${args['upload-mb']}MB all succeed`, ok.length === count,
        `${ok.length}/${count} p95=${l.p95}ms${firstErr ? ` first error: ${firstErr}` : ''}`);
    check('uploads: paths are under the form id', uploadValues.every(v => v.path.startsWith(`${form.id}/`)));
} else {
    console.log('SKIP  uploads (form has no file-upload field)');
}

// 3. Submit burst: N unique people at once
{
    const outs = await Promise.all(Array.from({ length: N }, (_, i) =>
        timed(() => submit(form.id, buildPayload(form.fields, i, uploadValues[i % Math.max(uploadValues.length, 1)])))));
    const codes = {};
    outs.forEach(o => { codes[o.res.status] = (codes[o.res.status] ?? 0) + 1; });
    const l = latencySummary(outs.map(o => o.ms));
    check(`submit burst: all ${N} return 200`, codes[200] === N, `codes=${JSON.stringify(codes)}`);
    check('submit burst: p95 < 1500ms', l.p95 < 1500, `p50=${l.p50}ms p95=${l.p95}ms p99=${l.p99}ms max=${l.max}ms`);
    const bad = outs.find(o => o.res.status !== 200);
    if (bad) console.log(`      sample non-200: ${bad.res.status} ${bad.res.body.slice(0, 200)}`);

    const { data: rows } = await admin.from('form_submissions').select('status, waitlist_position').eq('form_id', form.id);
    const confirmed = rows.filter(r => r.status === 'confirmed').length;
    const waitlist = rows.filter(r => r.status === 'waitlist');
    const positions = waitlist.map(r => r.waitlist_position).sort((a, b) => a - b);
    check(`db: exactly ${capacity} confirmed`, confirmed === capacity, `confirmed=${confirmed}`);
    check(`db: exactly ${capacity} waitlisted`, waitlist.length === capacity, `waitlist=${waitlist.length}`);
    check(`db: waitlist positions are exactly 1..${capacity}`,
        positions.length === capacity && positions.every((p, i) => p === i + 1),
        `first dupes/gaps: ${positions.filter((p, i) => p !== i + 1).slice(0, 5).join(',') || 'none'}`);
}

// 4. Overflow: form + waitlist are full now
{
    const outs = await Promise.all(Array.from({ length: 5 }, (_, i) => submit(form.id, buildPayload(form.fields, 10_000 + i, uploadValues[0]))));
    check('overflow: 5 extra submits all get 409 full', outs.every(o => o.status === 409 && /full/i.test(o.body)),
        outs.map(o => o.status).join(','));
}

// 5. Duplicate burst: same person taps submit 10 times at once.
//    Run against an emptied form so capacity doesn't mask the duplicate check.
{
    await cleanup(form.id);
    const payload = buildPayload(form.fields, 99_999, uploadValues[0]);
    const outs = await Promise.all(Array.from({ length: 10 }, () => submit(form.id, payload)));
    const ok = outs.filter(o => o.status === 200).length;
    const dup = outs.filter(o => o.status === 409).length;
    const { count } = await admin.from('form_submissions').select('*', { count: 'exact', head: true })
        .eq('form_id', form.id).eq('email', payload.email);
    check('duplicate burst: 1 accepted, 9 rejected, 1 row', ok === 1 && dup === 9 && count === 1,
        `200=${ok} 409=${dup} rows=${count}`);
}

// 6. Bad input
{
    const huge = buildPayload(form.fields, 50_000);
    huge.data.padding = 'x'.repeat(1024 * 1024);
    const r1 = await submit(form.id, huge);
    check('bad input: 1MB body rejected (413)', r1.status === 413, `${r1.status}`);

    const noConsent = { ...buildPayload(form.fields, 50_001), consent: false };
    const r2 = await submit(form.id, noConsent);
    check('bad input: missing consent rejected (400)', r2.status === 400, `${r2.status}`);

    const required = form.fields.find(f => f.required && !/first name|last name/i.test(f.label) && f.type !== 'email'
        && !['section-header', 'info-banner', 'page-break'].includes(f.type));
    if (required) {
        const p = buildPayload(form.fields, 50_002, uploadValues[0]);
        delete p.data[required.label];
        const r3 = await submit(form.id, p);
        check(`bad input: missing required "${required.label}" rejected (400)`, r3.status === 400, `${r3.status}`);
    }

    if (fileField) {
        const p = buildPayload(form.fields, 50_003, { path: 'some-other-form/x.pdf', name: 'x.pdf' });
        const r4 = await submit(form.id, p);
        check('bad input: foreign upload path rejected (400)', r4.status === 400, `${r4.status}`);
    }
}

await cleanup(form.id);

const failed = results.filter(r => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed. Test data cleaned up.`);
process.exit(failed ? 1 : 0);
