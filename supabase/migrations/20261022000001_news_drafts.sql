-- News drafts: any admin member can submit a draft, Presidents / Technology / Marketing
-- Coordinators (the existing "Permissions for correct users" policy) publish it.
-- Existing articles stay published.

alter table public.news
    add column if not exists status text not null default 'published'
        check (status in ('draft', 'published')),
    add column if not exists author uuid default auth.uid();

-- the public site (anon) only sees published posts
drop policy if exists "Enable read access for all users" on public.news;
create policy "Public read published news" on public.news
    for select using (status = 'published');

-- members work on their own drafts, and can never publish
create policy "Members read own news" on public.news
    for select to authenticated
    using (author = (select auth.uid()));

create policy "Members submit drafts" on public.news
    for insert to authenticated
    with check (
        status = 'draft'
        and author = (select auth.uid())
        and exists (select 1 from admin.people p where p.id = (select auth.uid()))
    );

create policy "Members edit own drafts" on public.news
    for update to authenticated
    using (author = (select auth.uid()) and status = 'draft')
    with check (author = (select auth.uid()) and status = 'draft');

create policy "Members delete own drafts" on public.news
    for delete to authenticated
    using (author = (select auth.uid()) and status = 'draft');
