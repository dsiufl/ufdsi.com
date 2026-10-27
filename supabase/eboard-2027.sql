-- Executive board for the 2026-27 year (board.year 2027). Safe to run more than once.
-- Headshot and LinkedIn are copied from the person's 2026 row when they have one; check the
-- rows with an empty headshot afterwards. Row order sets the order within a shared role
-- (the co-presidents, Andria first).

insert into public.board (year, name, role, exec, linkedin, headshot, created_at)
select 2027, v.name, v.role, true, o.linkedin, coalesce(o.headshot, ''),
       now() + v.position * interval '1 millisecond'
from (values
  (1, 'Andria Gonzalez Lopez', 'Co-President'),
  (2, 'Pranav Bhargava', 'Co-President'),
  (3, 'Safi Ali', 'Internal Vice President'),
  (4, 'Alfred Navarro', 'Treasurer'),
  (5, 'An Hoang', 'Workshop Director'),
  (6, 'Chelsea Zhao', 'Networking Director'),
  (7, 'Ron Beck', 'Secretary'),
  (8, 'Jaime Breitkreutz', 'Project Director'),
  (9, 'Yimo Liu', 'Research Director')
) as v(position, name, role)
left join (
  select distinct on (name) name, linkedin, headshot
  from public.board
  where year = 2026
  order by name, created_at desc
) o on o.name = v.name
where not exists (
  select 1 from public.board b where b.year = 2027 and b.name = v.name
);

-- anyone already there from an earlier run gets the exec role
update public.board b
set role = v.role, exec = true
from (values
  ('Pranav Bhargava', 'Co-President'),
  ('Andria Gonzalez Lopez', 'Co-President'),
  ('Safi Ali', 'Internal Vice President'),
  ('Alfred Navarro', 'Treasurer'),
  ('An Hoang', 'Workshop Director'),
  ('Chelsea Zhao', 'Networking Director'),
  ('Ron Beck', 'Secretary'),
  ('Jaime Breitkreutz', 'Project Director'),
  ('Yimo Liu', 'Research Director')
) as v(name, role)
where b.year = 2027 and b.name = v.name;
