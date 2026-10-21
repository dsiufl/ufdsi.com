-- Junior board (coordinators) for 2026. Run once in the Supabase SQL editor.
-- Emails are kept out for now; see jboard-2026-emails.sql.
-- Headshots are left empty so the page shows initials until photos are uploaded;
-- set board.headshot per person afterwards.

insert into public.board (year, name, role, exec, headshot)
select v.year, v.name, v.role, v.exec, v.headshot
from (values
  (2026, 'Hyunmin Kim', 'Event Coordinator', false, ''),
  (2026, 'Anish Nelluri', 'Event Coordinator', false, ''),
  (2026, 'Nicolas Murguia', 'Event Coordinator', false, ''),
  (2026, 'Toni Comer', 'Event Coordinator', false, ''),
  (2026, 'Jiexi Yang', 'Hackathon Coordinator', false, ''),
  (2026, 'Felix Chang', 'Hackathon Coordinator', false, ''),
  (2026, 'Joshua Brown', 'Hackathon Coordinator', false, ''),
  (2026, 'Evan Daniels', 'Marketing Coordinator', false, ''),
  (2026, 'Emily Blumhof', 'Marketing Coordinator', false, ''),
  (2026, 'Zibran Faruque', 'Marketing Coordinator', false, ''),
  (2026, 'Sarah Acra', 'Marketing Coordinator', false, ''),
  (2026, 'Grace Corathers', 'Marketing Coordinator', false, ''),
  (2026, 'Jonathan Gleiber', 'Networking Coordinator', false, ''),
  (2026, 'Taher Akolawala', 'Networking Coordinator', false, ''),
  (2026, 'Rithvika Veerapureddy', 'Networking Coordinator', false, ''),
  (2026, 'Nikhil Sangamkar', 'Networking Coordinator', false, ''),
  (2026, 'Youssef Alhamzawi', 'Research Coordinator', false, ''),
  (2026, 'Isabelle Zolkos', 'Research Coordinator', false, ''),
  (2026, 'Nikhil Raj Deep', 'Research Coordinator', false, ''),
  (2026, 'Neha Jupalli', 'Sponsorship Coordinator', false, ''),
  (2026, 'Aryan Patel', 'Sponsorship Coordinator', false, ''),
  (2026, 'Andrew Robinson', 'Sponsorship Coordinator', false, ''),
  (2026, 'Brigid O''Sullivan', 'Sponsorship Coordinator', false, ''),
  (2026, 'Jossaya Camille', 'Technology Coordinator', false, ''),
  (2026, 'Zayd Tawam', 'Technology Coordinator', false, ''),
  (2026, 'John Courtney', 'Technology Coordinator', false, ''),
  (2026, 'Hana Elbatouty', 'Technology Coordinator', false, ''),
  (2026, 'Ragul Thiyagarajan', 'Workshop Coordinator', false, ''),
  (2026, 'Devereaux Dumas', 'Workshop Coordinator', false, ''),
  (2026, 'Anjali Tomerlin', 'Workshop Coordinator', false, ''),
  (2026, 'Hayden Luong', 'Workshop Coordinator', false, ''),
  (2026, 'Sai Rajan', 'Workshop Coordinator', false, '')
) as v(year, name, role, exec, headshot)
where not exists (
  select 1 from public.board b where b.year = v.year and b.name = v.name
);
