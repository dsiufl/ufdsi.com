-- LinkedIn profiles for the 2026-27 board. Safe to run more than once; add rows as people send theirs.
update public.board b
set linkedin = v.linkedin
from (values
  ('Nicolas Murguia', 'https://www.linkedin.com/in/nicolasmurguia/'),
  ('Pranav Bhargava', 'https://www.linkedin.com/in/pranavb15'),
  ('Yimo Liu', 'https://www.linkedin.com/in/yimo-liu/'),
  ('Anish Nelluri', 'https://www.linkedin.com/in/anish-nelluri-89648531a'),
  ('Jiexi Yang', 'https://www.linkedin.com/in/jiexiyang/')
) as v(name, linkedin)
where b.year = 2027 and b.name = v.name;
