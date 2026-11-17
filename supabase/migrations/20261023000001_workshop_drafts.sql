-- Workshop drafts, same rules as news: any admin member can submit a draft, Presidents /
-- Technology / Workshop Coordinators (the existing "Any " policy) publish it.
-- Existing workshops stay published.

alter table public.workshops
    add column if not exists status text not null default 'published'
        check (status in ('draft', 'published')),
    add column if not exists author uuid default auth.uid();

-- the public site (anon) only sees published workshops. Altered in place rather than
-- dropped and recreated, so the migration stays additive.
alter policy "All can read tables" on public.workshops
    using (status = 'published');

-- members work on their own drafts, and can never publish
create policy "Members read own workshops" on public.workshops
    for select to authenticated
    using (author = (select auth.uid()));

create policy "Members submit drafts" on public.workshops
    for insert to authenticated
    with check (
        status = 'draft'
        and author = (select auth.uid())
        and exists (select 1 from admin.people p where p.id = (select auth.uid()))
    );

create policy "Members edit own drafts" on public.workshops
    for update to authenticated
    using (author = (select auth.uid()) and status = 'draft')
    with check (author = (select auth.uid()) and status = 'draft');

create policy "Members delete own drafts" on public.workshops
    for delete to authenticated
    using (author = (select auth.uid()) and status = 'draft');

-- Google Form submissions (api/webhooks/submissions) land as drafts with no author.
-- Who sent them lives here in the admin schema, not on news/workshops, because anon can
-- select every column of the public tables. The form's response id makes resends idempotent.
-- Deleting the draft deletes its row here too.
create table if not exists admin.draft_submissions (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),
    table_name text not null check (table_name in ('news', 'workshops')),
    news_id uuid references public.news (id) on delete cascade,
    workshop_id uuid references public.workshops (id) on delete cascade,
    source_response_id text not null unique,
    submitted_by_email text,
    check (news_id is null or table_name = 'news'),
    check (workshop_id is null or table_name = 'workshops')
);

alter table admin.draft_submissions enable row level security;

-- the webhook writes with the service key; signed-in admin members can only read
revoke all on admin.draft_submissions from anon, authenticated;
grant select on admin.draft_submissions to authenticated;
grant all on admin.draft_submissions to service_role;

create policy "Members read draft submissions" on admin.draft_submissions
    for select to authenticated
    using (exists (select 1 from admin.people p where p.id = (select auth.uid())));
