-- Reuse last year's headshot and LinkedIn for returning 2027 board members who have none yet.
-- Safe to run more than once; it only fills in blanks.

update public.board j
set headshot = o.headshot,
    linkedin = coalesce(j.linkedin, o.linkedin)
from (
  select distinct on (name) name, headshot, linkedin
  from public.board
  where year = 2026 and headshot <> ''
  order by name, created_at desc
) o
where j.year = 2027 and j.headshot = '' and j.name = o.name;
