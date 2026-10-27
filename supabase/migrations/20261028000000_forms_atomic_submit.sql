-- Make public form submissions safe under concurrent load (~100 people at a GBM).
--
-- The submit route used to check duplicates, count capacity, and insert as
-- separate PostgREST calls, so simultaneous submits could overfill capacity,
-- hand out the same waitlist position twice, or insert duplicate rows.
-- submit_form() does all of it in one transaction behind a row lock on the
-- form, and a partial unique index backstops duplicates.
--
-- PRE-CHECK before applying (the index will fail if this returns rows):
--   select form_id, lower(email), count(*)
--   from public.form_submissions
--   where status <> 'cancelled'
--   group by 1, 2 having count(*) > 1;

-- 1. Duplicate backstop: one active submission per email per form.
create unique index form_submissions_form_email_active_uq
    on public.form_submissions (form_id, lower(email))
    where status <> 'cancelled';

-- 2. Privacy-policy consent record.
alter table public.form_submissions
    add column consented_at timestamptz,
    add column consent_version text;

-- 3. Atomic submit. Called only by the server (service_role).
--    Raises with errcode P0001 and one of these messages, which the route maps
--    to HTTP responses: FORM_NOT_FOUND, FORM_CLOSED, DEADLINE_PASSED,
--    DOMAIN_NOT_ALLOWED, FORM_FULL. Duplicates raise unique_violation (23505).
create or replace function public.submit_form(
    p_form_id uuid,
    p_first_name text,
    p_last_name text,
    p_email text,
    p_phone text,
    p_data jsonb,
    p_consent_version text
)
returns table (id uuid, status text, waitlist_position integer)
language plpgsql
security definer
set search_path = ''
as $$
#variable_conflict use_column
declare
    v_form public.forms%rowtype;
    v_email text := lower(trim(p_email));
    v_confirmed integer;
    v_waitlisted integer;
    v_status text := 'confirmed';
    v_position integer := null;
begin
    -- Serializes concurrent submits to the same form; other forms are unaffected.
    select * into v_form from public.forms f where f.id = p_form_id for update;

    if not found then
        raise exception 'FORM_NOT_FOUND' using errcode = 'P0001';
    end if;
    if v_form.status <> 'open' then
        raise exception 'FORM_CLOSED' using errcode = 'P0001';
    end if;
    if v_form.deadline is not null and v_form.deadline < now() then
        raise exception 'DEADLINE_PASSED' using errcode = 'P0001';
    end if;
    if coalesce(array_length(v_form.allowed_domains, 1), 0) > 0
        and not exists (
            select 1 from unnest(v_form.allowed_domains) d
            where lower(d) = split_part(v_email, '@', 2)
        ) then
        raise exception 'DOMAIN_NOT_ALLOWED' using errcode = 'P0001';
    end if;

    if exists (
        select 1 from public.form_submissions s
        where s.form_id = p_form_id
          and lower(s.email) = v_email
          and s.status <> 'cancelled'
    ) then
        raise exception 'DUPLICATE' using errcode = '23505';
    end if;

    if v_form.capacity is not null then
        select count(*) into v_confirmed
        from public.form_submissions s
        where s.form_id = p_form_id and s.status = 'confirmed';

        if v_confirmed >= v_form.capacity then
            select count(*) into v_waitlisted
            from public.form_submissions s
            where s.form_id = p_form_id and s.status = 'waitlist';

            if v_waitlisted >= v_form.capacity then
                raise exception 'FORM_FULL' using errcode = 'P0001';
            end if;

            v_status := 'waitlist';
            -- max+1 rather than count+1: promotions null out positions without
            -- renumbering, so count+1 could collide with an existing position.
            select coalesce(max(s.waitlist_position), 0) + 1 into v_position
            from public.form_submissions s
            where s.form_id = p_form_id and s.status = 'waitlist';
        end if;
    end if;

    return query
    insert into public.form_submissions as s (
        form_id, status, waitlist_position, first_name, last_name,
        email, phone, data, consented_at, consent_version
    )
    values (
        p_form_id, v_status, v_position, trim(p_first_name), trim(p_last_name),
        v_email, p_phone, coalesce(p_data, '{}'::jsonb),
        case when p_consent_version is not null then now() end, p_consent_version
    )
    returning s.id, s.status, s.waitlist_position;
end;
$$;

revoke all on function public.submit_form(uuid, text, text, text, text, jsonb, text) from public, anon, authenticated;
grant execute on function public.submit_form(uuid, text, text, text, text, jsonb, text) to service_role;

-- 4. Public capacity check for the form page. form_submissions is not readable
--    by anon (RLS), so the page's count queries always saw 0. This exposes only
--    two booleans, never rows.
create or replace function public.form_availability(p_form_id uuid)
returns table (confirmed_full boolean, waitlist_full boolean)
language sql
stable
security definer
set search_path = ''
as $$
    select
        coalesce((select count(*) from public.form_submissions s
                  where s.form_id = f.id and s.status = 'confirmed') >= f.capacity, false),
        coalesce((select count(*) from public.form_submissions s
                  where s.form_id = f.id and s.status = 'waitlist') >= f.capacity, false)
    from public.forms f
    where f.id = p_form_id and f.status = 'open';
$$;

revoke all on function public.form_availability(uuid) from public;
grant execute on function public.form_availability(uuid) to anon, authenticated, service_role;
