-- Migrate identity from Supabase Auth to Clerk.
--
-- admin.people.id (and the FK columns that referenced auth.users) switch from
-- a Supabase Auth uuid to Clerk's string user id. RLS predicates move from
-- auth.uid() to the Clerk JWT's `sub` claim via Supabase's third-party-auth
-- bridge. Role-gated actions stay enforced by Postgres -- via RLS, or via a
-- SECURITY DEFINER function for the one case a plain RLS policy can't safely
-- express -- never by application code alone.

-- 1. admin.people: drop the auth.users FK, retype id to text.
alter table admin.people drop constraint people_id_fkey;
alter table admin.people alter column id drop default;
alter table admin.people alter column id type text using id::text;

-- 2. forms.created_by / form_templates.created_by: same retype, drop FK to auth.users.
alter table public.forms drop constraint forms_created_by_fkey;
alter table public.forms alter column created_by type text using created_by::text;

alter table public.form_templates drop constraint form_templates_created_by_fkey;
alter table public.form_templates alter column created_by type text using created_by::text;

-- 3. admin.activity_log.user_id and record_id: retype to text. record_id is
--    shared across triggers on people/speakers/symposiums/workshops/news --
--    only people.id changed type, but the column has to accommodate all of
--    them, so it becomes text (uuid values still store fine as text).
alter table admin.activity_log alter column user_id type text using user_id::text;
alter table admin.activity_log alter column record_id type text using record_id::text;

-- 4. Rewrite auth.uid() -> the Clerk JWT's `sub` claim.
drop policy "people_select_own" on admin.people;
create policy people_select_own on admin.people
    for select to authenticated
    using ((select auth.jwt() ->> 'sub') = id);

drop policy "admin_people_update_own" on admin.people;
create policy admin_people_update_own on admin.people
    for update to authenticated
    using ((select auth.jwt() ->> 'sub') = id)
    with check ((select auth.jwt() ->> 'sub') = id);

drop policy "Any officer can read the actions of their role" on admin.actions;
create policy "Any officer can read the actions of their role" on admin.actions
    for select
    using (exists (
        select 1 from admin.people p
        where p.id = (select auth.jwt() ->> 'sub') and p.role = any (actions.role)
    ));

-- 5. Loosen news/projects/workshops writes to "any eboard member", matching
--    speakers/symposiums' existing openness. Explicit product decision, not
--    a side effect of the identity swap.
drop policy "Any " on public.workshops;
create policy workshops_write_any_officer on public.workshops
    for all to authenticated
    using (true)
    with check (true);

drop policy "Permissions for correct users" on public.news;
create policy news_write_any_officer on public.news
    for all to authenticated
    using (true)
    with check (true);

drop policy "Restrict editing projects to President, Internal Vice President" on public.projects;
create policy projects_write_any_officer on public.projects
    for all to authenticated
    using (true)
    with check (true);

-- 6. form_templates / form_submissions had zero policies (deny-all except
--    service_role) -- these were only ever "is a logged-in officer", never
--    role-restricted, so open them the same way the forms/symposiums/speakers
--    tables already are.
create policy form_templates_any_officer on public.form_templates
    for all to authenticated
    using (true)
    with check (true);

create policy form_submissions_any_officer on public.form_submissions
    for all to authenticated
    using (true)
    with check (true);

-- 7. Privileged admin.people operations (President / Technology Coordinator).
--
--    SELECT and DELETE are safe as plain RLS policies -- there is no
--    competing "self" policy for either that a privileged predicate could be
--    OR'd past. UPDATE is NOT safe as a plain policy: admin_people_update_own
--    (above) already lets any authenticated user update their OWN row, and
--    Postgres combines multiple permissive policies for the same command
--    with OR -- so if the column grant below ever included role/email/
--    publish (needed for privileged edits), a non-privileged user's own-row
--    update would also satisfy admin_people_update_own's WITH CHECK and
--    could smuggle a role change through, regardless of which policy "meant"
--    to allow it. Privileged full-row edits instead go through
--    admin.update_person(), a SECURITY DEFINER function that checks the
--    caller's own role before writing. The self-service column grant from
--    the restrict_people_access migration (displayName/pictureURL/
--    first_name/last_name/account_setup only) is untouched.

create policy people_select_all_privileged on admin.people
    for select to authenticated
    using (exists (
        select 1 from admin.people p
        where p.id = (select auth.jwt() ->> 'sub')
          and p.role = any (array['President', 'Technology Coordinator'])
    ));

-- INSERT is also safe as a plain policy: there is no competing "self-insert"
-- policy to OR past (people never insert their own row), and the WITH CHECK
-- below requires the CALLER to already be a privileged officer regardless of
-- what row they're inserting -- a non-privileged caller's own admin.people
-- row never satisfies the EXISTS, so they can't insert anything, including a
-- row for themselves. Used by /api/users/create to seed a placeholder
-- 'pending:<uuid>' id row before the invitee's real Clerk id exists; the
-- Clerk `user.created` webhook backfills it.
create policy people_insert_privileged on admin.people
    for insert to authenticated
    with check (exists (
        select 1 from admin.people p
        where p.id = (select auth.jwt() ->> 'sub')
          and p.role = any (array['President', 'Technology Coordinator'])
    ));

create policy people_delete_privileged on admin.people
    for delete to authenticated
    using (
        exists (
            select 1 from admin.people p
            where p.id = (select auth.jwt() ->> 'sub')
              and p.role = any (array['President', 'Technology Coordinator'])
        )
        and id != (select auth.jwt() ->> 'sub')
    );

grant insert, delete on admin.people to authenticated;

create or replace function admin.update_person(
    target_id text,
    new_role text,
    new_email text,
    new_publish boolean,
    new_first_name text,
    new_last_name text,
    new_display_name text,
    new_picture_url text
) returns admin.people
    language plpgsql security definer
    set search_path = admin, public
as $$
declare
    result admin.people;
begin
    if not exists (
        select 1 from admin.people p
        where p.id = (select auth.jwt() ->> 'sub')
          and p.role = any (array['President', 'Technology Coordinator'])
    ) then
        raise exception 'insufficient_privilege' using errcode = '42501';
    end if;

    update admin.people
    set role = new_role,
        email = new_email,
        publish = new_publish,
        first_name = new_first_name,
        last_name = new_last_name,
        "displayName" = new_display_name,
        "pictureURL" = new_picture_url
    where id = target_id
    returning * into result;

    if result is null then
        raise exception 'not_found' using errcode = 'P0002';
    end if;

    return result;
end;
$$;

revoke all on function admin.update_person(text, text, text, boolean, text, text, text, text) from public;
grant execute on function admin.update_person(text, text, text, boolean, text, text, text, text) to authenticated;

-- 8. admin.log_activity(): auth.uid() -> Clerk JWT `sub` (user_id/record_id
--    are text now, no cast needed).
create or replace function admin.log_activity() returns trigger
    language plpgsql security definer
    as $$begin
  if (tg_op = 'DELETE') then
    insert into admin.activity_log (user_id, action_type, table_name, record_id, old_data)
    values ((select auth.jwt() ->> 'sub'), tg_op, tg_table_name, old.id, row_to_json(old)::jsonb);
    return old;
  elsif (tg_op = 'UPDATE') then
    insert into admin.activity_log (user_id, action_type, table_name, record_id, old_data, new_data)
    values ((select auth.jwt() ->> 'sub'), tg_op, tg_table_name, new.id, row_to_json(old)::jsonb, row_to_json(new)::jsonb);
    return new;
  elsif (tg_op = 'INSERT') then
    insert into admin.activity_log (user_id, action_type, table_name, record_id, new_data)
    values ((select auth.jwt() ->> 'sub'), tg_op, tg_table_name, new.id, row_to_json(new)::jsonb);
    return new;
  end if;
  return null;
end;$$;

-- 10. Leave the auth.* schema / auth.users rows in place -- just stop using
--     them from app code. supabase/config.toml's third-party Clerk
--     integration gets flipped on separately once a real Clerk domain
--     exists.

-- 11. form-uploads Storage bucket: /api/forms/[id]/file now signs download
--     URLs through the Clerk-bridged client (not service_role), which needs
--     an RLS policy on storage.objects to succeed. Officer-submission
--     uploads themselves go through signed upload tokens (minted via
--     service_role, consumed directly by the browser), so no INSERT policy
--     for anon is needed here -- SELECT for any authenticated officer only.
create policy form_uploads_select_officers on storage.objects
    for select to authenticated
    using (bucket_id = 'form-uploads');
