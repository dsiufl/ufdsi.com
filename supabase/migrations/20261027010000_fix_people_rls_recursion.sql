-- Fix infinite recursion (42P17) in admin.people's privileged policies.
--
-- people_select_all_privileged / people_insert_privileged /
-- people_delete_privileged each had an inline
-- `exists (select 1 from admin.people p where ...)` directly in their
-- USING/WITH CHECK clause. That's a policy ON admin.people querying
-- admin.people -- evaluating it requires re-running admin.people's SELECT
-- policies (including this same policy) to resolve the subquery, forever.
-- admin.is_officer() (used by other tables' policies) hit the same wall
-- transitively, since its own lookup also goes through admin.people's
-- SELECT policies.
--
-- admin.update_person() never had this problem: it's SECURITY DEFINER, so
-- its internal check runs as the function owner, which bypasses RLS
-- entirely -- the same fix applied here via a dedicated function.

create or replace function admin.is_privileged() returns boolean
    language sql stable security definer
    set search_path = admin, public
as $$
    select exists (
        select 1 from admin.people p
        where p.id = (select auth.jwt() ->> 'sub')
          and p.role = any (array['President', 'Technology Coordinator'])
    );
$$;

revoke all on function admin.is_privileged() from public;
grant execute on function admin.is_privileged() to authenticated;

drop policy "people_select_all_privileged" on admin.people;
create policy people_select_all_privileged on admin.people
    for select to authenticated
    using (admin.is_privileged());

drop policy "people_insert_privileged" on admin.people;
create policy people_insert_privileged on admin.people
    for insert to authenticated
    with check (admin.is_privileged());

drop policy "people_delete_privileged" on admin.people;
create policy people_delete_privileged on admin.people
    for delete to authenticated
    using (admin.is_privileged() and id != (select auth.jwt() ->> 'sub'));
