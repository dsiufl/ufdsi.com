-- Restore the self-service grants declared in 20260825000001.
-- The linked database has SELECT/INSERT/DELETE but no column UPDATE grants,
-- causing first-time setup to fail with 42501 (permission denied for people).
-- Keep updates limited to profile fields: a table-wide UPDATE grant would
-- allow members to change their own role through the own-row RLS policy.
grant update ("displayName", "pictureURL", first_name, last_name, account_setup)
    on admin.people to authenticated;
