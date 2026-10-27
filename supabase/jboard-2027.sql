-- Junior board (coordinators) for the 2026-27 year (board.year 2027). Safe to run more than once in the Supabase SQL editor.
-- role is the team + " Coordinator"; the team page groups people by role.
-- Headshots are left empty so the page shows initials until photos are uploaded;
-- set board.headshot per person afterwards.

alter table public.board add column if not exists email text;

insert into public.board (year, name, role, exec, email, headshot)
select v.year, v.name, v.role, v.exec, v.email, v.headshot
from (values
  (2027, 'Hyunmin Kim', 'Event Coordinator', false, 'hyunminkim@ufl.edu', ''),
  (2027, 'Anish Nelluri', 'Event Coordinator', false, 'anelluri@ufl.edu', ''),
  (2027, 'Nicolas Murguia', 'Event Coordinator', false, 'nmurguia@ufl.edu', ''),
  (2027, 'Toni Comer', 'Event Coordinator', false, 'tonicomer@ufl.edu', ''),
  (2027, 'Jiexi Yang', 'Hackathon Coordinator', false, 'j.yang2@ufl.edu', ''),
  (2027, 'Felix Chang', 'Hackathon Coordinator', false, 'felix.chang@ufl.edu', ''),
  (2027, 'Joshua Brown', 'Hackathon Coordinator', false, 'jbrown29@ufl.edu', ''),
  (2027, 'Evan Daniels', 'Marketing Coordinator', false, 'e.daniels@ufl.edu', ''),
  (2027, 'Emily Blumhof', 'Marketing Coordinator', false, 'emilyblumhof@ufl.edu', ''),
  (2027, 'Zibran Faruque', 'Marketing Coordinator', false, 'zfaruque@ufl.edu', ''),
  (2027, 'Sarah Acra', 'Marketing Coordinator', false, 'sarahacra@ufl.edu', ''),
  (2027, 'Grace Corathers', 'Marketing Coordinator', false, 'gcorathers@ufl.edu', ''),
  (2027, 'Jonathan Gleiber', 'Networking Coordinator', false, 'jonathan.gleiber@ufl.edu', ''),
  (2027, 'Taher Akolawala', 'Networking Coordinator', false, 'taherakolawala@ufl.edu', ''),
  (2027, 'Rithvika Veerapureddy', 'Networking Coordinator', false, 'rithvika.veerapu@ufl.edu', ''),
  (2027, 'Nikhil Sangamkar', 'Networking Coordinator', false, 'nikhil.sangamkar@ufl.edu', ''),
  (2027, 'Youssef Alhamzawi', 'Research Coordinator', false, 'youssefalhamzawi@ufl.edu', ''),
  (2027, 'Isabelle Zolkos', 'Research Coordinator', false, 'zolkosisabelle@ufl.edu', ''),
  (2027, 'Nikhil Raj Deep', 'Research Coordinator', false, 'nikhildeep@ufl.edu', ''),
  (2027, 'Neha Jupalli', 'Sponsorship Coordinator', false, 'jupallineha@ufl.edu', ''),
  (2027, 'Aryan Patel', 'Sponsorship Coordinator', false, 'aryan.patel@ufl.edu', ''),
  (2027, 'Andrew Robinson', 'Sponsorship Coordinator', false, 'ap.robinson@ufl.edu', ''),
  (2027, 'Brigid O''Sullivan', 'Sponsorship Coordinator', false, 'brigid.osullivan@ufl.edu', ''),
  (2027, 'Jossaya Camille', 'Technology Coordinator', false, 'jossaya.camille@ufl.edu', ''),
  (2027, 'Zayd Tawam', 'Technology Coordinator', false, 'ztawam@ufl.edu', ''),
  (2027, 'John Courtney', 'Technology Coordinator', false, 'johncourtney@ufl.edu', ''),
  (2027, 'Hana Elbatouty', 'Technology Coordinator', false, 'hanaelbatout@ufl.edu', ''),
  (2027, 'Ragul Thiyagarajan', 'Workshop Coordinator', false, 'rthiyagarajan@ufl.edu', ''),
  (2027, 'Devereaux Dumas', 'Workshop Coordinator', false, 'ddumas1@ufl.edu', ''),
  (2027, 'Anjali Tomerlin', 'Workshop Coordinator', false, 'a.tomerlin@ufl.edu', ''),
  (2027, 'Hayden Luong', 'Workshop Coordinator', false, 'giakhangluong@ufl.edu', ''),
  (2027, 'Sai Rajan', 'Workshop Coordinator', false, 'srajan1@ufl.edu', '')
) as v(year, name, role, exec, email, headshot)
where not exists (
  select 1 from public.board b where b.year = v.year and b.name = v.name
);

-- people already in the table keep their row but get the role and email from this list
update public.board b
set role = v.role, email = v.email
from (values
  (2027, 'Hyunmin Kim', 'Event Coordinator', false, 'hyunminkim@ufl.edu', ''),
  (2027, 'Anish Nelluri', 'Event Coordinator', false, 'anelluri@ufl.edu', ''),
  (2027, 'Nicolas Murguia', 'Event Coordinator', false, 'nmurguia@ufl.edu', ''),
  (2027, 'Toni Comer', 'Event Coordinator', false, 'tonicomer@ufl.edu', ''),
  (2027, 'Jiexi Yang', 'Hackathon Coordinator', false, 'j.yang2@ufl.edu', ''),
  (2027, 'Felix Chang', 'Hackathon Coordinator', false, 'felix.chang@ufl.edu', ''),
  (2027, 'Joshua Brown', 'Hackathon Coordinator', false, 'jbrown29@ufl.edu', ''),
  (2027, 'Evan Daniels', 'Marketing Coordinator', false, 'e.daniels@ufl.edu', ''),
  (2027, 'Emily Blumhof', 'Marketing Coordinator', false, 'emilyblumhof@ufl.edu', ''),
  (2027, 'Zibran Faruque', 'Marketing Coordinator', false, 'zfaruque@ufl.edu', ''),
  (2027, 'Sarah Acra', 'Marketing Coordinator', false, 'sarahacra@ufl.edu', ''),
  (2027, 'Grace Corathers', 'Marketing Coordinator', false, 'gcorathers@ufl.edu', ''),
  (2027, 'Jonathan Gleiber', 'Networking Coordinator', false, 'jonathan.gleiber@ufl.edu', ''),
  (2027, 'Taher Akolawala', 'Networking Coordinator', false, 'taherakolawala@ufl.edu', ''),
  (2027, 'Rithvika Veerapureddy', 'Networking Coordinator', false, 'rithvika.veerapu@ufl.edu', ''),
  (2027, 'Nikhil Sangamkar', 'Networking Coordinator', false, 'nikhil.sangamkar@ufl.edu', ''),
  (2027, 'Youssef Alhamzawi', 'Research Coordinator', false, 'youssefalhamzawi@ufl.edu', ''),
  (2027, 'Isabelle Zolkos', 'Research Coordinator', false, 'zolkosisabelle@ufl.edu', ''),
  (2027, 'Nikhil Raj Deep', 'Research Coordinator', false, 'nikhildeep@ufl.edu', ''),
  (2027, 'Neha Jupalli', 'Sponsorship Coordinator', false, 'jupallineha@ufl.edu', ''),
  (2027, 'Aryan Patel', 'Sponsorship Coordinator', false, 'aryan.patel@ufl.edu', ''),
  (2027, 'Andrew Robinson', 'Sponsorship Coordinator', false, 'ap.robinson@ufl.edu', ''),
  (2027, 'Brigid O''Sullivan', 'Sponsorship Coordinator', false, 'brigid.osullivan@ufl.edu', ''),
  (2027, 'Jossaya Camille', 'Technology Coordinator', false, 'jossaya.camille@ufl.edu', ''),
  (2027, 'Zayd Tawam', 'Technology Coordinator', false, 'ztawam@ufl.edu', ''),
  (2027, 'John Courtney', 'Technology Coordinator', false, 'johncourtney@ufl.edu', ''),
  (2027, 'Hana Elbatouty', 'Technology Coordinator', false, 'hanaelbatout@ufl.edu', ''),
  (2027, 'Ragul Thiyagarajan', 'Workshop Coordinator', false, 'rthiyagarajan@ufl.edu', ''),
  (2027, 'Devereaux Dumas', 'Workshop Coordinator', false, 'ddumas1@ufl.edu', ''),
  (2027, 'Anjali Tomerlin', 'Workshop Coordinator', false, 'a.tomerlin@ufl.edu', ''),
  (2027, 'Hayden Luong', 'Workshop Coordinator', false, 'giakhangluong@ufl.edu', ''),
  (2027, 'Sai Rajan', 'Workshop Coordinator', false, 'srajan1@ufl.edu', '')
) as v(year, name, role, exec, email, headshot)
where b.year = v.year and b.name = v.name;
