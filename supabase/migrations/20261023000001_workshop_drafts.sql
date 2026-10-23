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
-- The form's response id makes retries idempotent.
alter table public.news
    add column if not exists source_response_id text unique,
    add column if not exists submitted_by_email text;

alter table public.workshops
    add column if not exists source_response_id text unique,
    add column if not exists submitted_by_email text;
