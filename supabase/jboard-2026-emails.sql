-- Adds the email column to the board and fills it in for the 2026 junior board.

alter table public.board add column if not exists email text;

update public.board set email = 'hyunminkim@ufl.edu' where year = 2026 and name = 'Hyunmin Kim';
update public.board set email = 'anelluri@ufl.edu' where year = 2026 and name = 'Anish Nelluri';
update public.board set email = 'nmurguia@ufl.edu' where year = 2026 and name = 'Nicolas Murguia';
update public.board set email = 'tonicomer@ufl.edu' where year = 2026 and name = 'Toni Comer';
update public.board set email = 'j.yang2@ufl.edu' where year = 2026 and name = 'Jiexi Yang';
update public.board set email = 'felix.chang@ufl.edu' where year = 2026 and name = 'Felix Chang';
update public.board set email = 'jbrown29@ufl.edu' where year = 2026 and name = 'Joshua Brown';
update public.board set email = 'e.daniels@ufl.edu' where year = 2026 and name = 'Evan Daniels';
update public.board set email = 'emilyblumhof@ufl.edu' where year = 2026 and name = 'Emily Blumhof';
update public.board set email = 'zfaruque@ufl.edu' where year = 2026 and name = 'Zibran Faruque';
update public.board set email = 'sarahacra@ufl.edu' where year = 2026 and name = 'Sarah Acra';
update public.board set email = 'gcorathers@ufl.edu' where year = 2026 and name = 'Grace Corathers';
update public.board set email = 'jonathan.gleiber@ufl.edu' where year = 2026 and name = 'Jonathan Gleiber';
update public.board set email = 'taherakolawala@ufl.edu' where year = 2026 and name = 'Taher Akolawala';
update public.board set email = 'rithvika.veerapu@ufl.edu' where year = 2026 and name = 'Rithvika Veerapureddy';
update public.board set email = 'nikhil.sangamkar@ufl.edu' where year = 2026 and name = 'Nikhil Sangamkar';
update public.board set email = 'youssefalhamzawi@ufl.edu' where year = 2026 and name = 'Youssef Alhamzawi';
update public.board set email = 'zolkosisabelle@ufl.edu' where year = 2026 and name = 'Isabelle Zolkos';
update public.board set email = 'nikhildeep@ufl.edu' where year = 2026 and name = 'Nikhil Raj Deep';
update public.board set email = 'jupallineha@ufl.edu' where year = 2026 and name = 'Neha Jupalli';
update public.board set email = 'aryan.patel@ufl.edu' where year = 2026 and name = 'Aryan Patel';
update public.board set email = 'ap.robinson@ufl.edu' where year = 2026 and name = 'Andrew Robinson';
update public.board set email = 'brigid.osullivan@ufl.edu' where year = 2026 and name = 'Brigid O''Sullivan';
update public.board set email = 'jossaya.camille@ufl.edu' where year = 2026 and name = 'Jossaya Camille';
update public.board set email = 'ztawam@ufl.edu' where year = 2026 and name = 'Zayd Tawam';
update public.board set email = 'johncourtney@ufl.edu' where year = 2026 and name = 'John Courtney';
update public.board set email = 'hanaelbatout@ufl.edu' where year = 2026 and name = 'Hana Elbatouty';
update public.board set email = 'rthiyagarajan@ufl.edu' where year = 2026 and name = 'Ragul Thiyagarajan';
update public.board set email = 'ddumas1@ufl.edu' where year = 2026 and name = 'Devereaux Dumas';
update public.board set email = 'a.tomerlin@ufl.edu' where year = 2026 and name = 'Anjali Tomerlin';
update public.board set email = 'giakhangluong@ufl.edu' where year = 2026 and name = 'Hayden Luong';
update public.board set email = 'srajan1@ufl.edu' where year = 2026 and name = 'Sai Rajan';
