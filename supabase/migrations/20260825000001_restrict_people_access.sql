-- Least-privilege hardening for admin.people.
--
-- 1. Members could SELECT every row (USING (true)) and therefore read all
--    members' emails/names/roles with the public API key + a session.
--    Replace with an own-row policy. Server routes use the service_role
--    key (bypasses RLS), so the admin users page is unaffected.
--
-- 2. The blanket UPDATE grant let members update ANY column of their own
--    row (including role -> 'President') directly via PostgREST.
--    Restrict the grant to profile columns; role/email/publish/id can
--    only be changed via service_role.

drop policy "Enable read access for all users" on admin.people;

create policy people_select_own on admin.people
    for select to authenticated
    using ((select auth.uid()) = id);

revoke update on admin.people from authenticated;

grant update ("displayName", "pictureURL", first_name, last_name, account_setup)
    on admin.people to authenticated;
