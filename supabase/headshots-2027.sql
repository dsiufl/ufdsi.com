-- Sets the 2027 junior board headshots. Safe to run more than once.

update public.board b
set headshot = v.headshot
from (values
  ('Hyunmin Kim', '/images/people/2026-2027/2026HyunminKim_Event.jpg'),
  ('Anish Nelluri', '/images/people/2026-2027/2026AnishNelluri_Event.jpg'),
  ('Nicolas Murguia', '/images/people/2026-2027/2026NicolasMurguia_Event.jpg'),
  ('Toni Comer', '/images/people/2026-2027/2026ToniComer_Event.jpg'),
  ('Jiexi Yang', '/images/people/2026-2027/2026JiexiYang_Hackathon.jpg'),
  ('Felix Chang', '/images/people/2026-2027/2026FelixChang_Hackathon.jpg'),
  ('Joshua Brown', '/images/people/2026-2027/2026JoshuaBrown_Hackathon.jpg'),
  ('Evan Daniels', '/images/people/2026-2027/2026EvanDaniels_Marketing.jpg'),
  ('Emily Blumhof', '/images/people/2026-2027/2026EmilyBlumhof_Marketing.jpg'),
  ('Zibran Faruque', '/images/people/2026-2027/2026ZibranFaruque_Marketing.jpg'),
  ('Sarah Acra', '/images/people/2026-2027/2026SarahAcra_Marketing.jpg'),
  ('Grace Corathers', '/images/people/2026-2027/2026GraceCorathers_Marketing.jpg'),
  ('Jonathan Gleiber', '/images/people/2026-2027/2026JonathanGleiber_Networking.jpg'),
  ('Taher Akolawala', '/images/people/2026-2027/2026TaherAkolawala_Networking.jpg'),
  ('Rithvika Veerapureddy', '/images/people/2026-2027/2026RithvikaVeerapureddy_Networking.jpg'),
  ('Nikhil Sangamkar', '/images/people/2026-2027/2026NikhilSangamkar_Networking.jpg'),
  ('Youssef Alhamzawi', '/images/people/2026-2027/2026YoussefAlhamzawi_Research.jpg'),
  ('Isabelle Zolkos', '/images/people/2026-2027/2026IsabelleZolkos_Research.jpg'),
  ('Nikhil Raj Deep', '/images/people/2026-2027/2026NikhilRajDeep_Research.jpg'),
  ('Neha Jupalli', '/images/people/2026-2027/2026NehaJupalli_Sponsorship.jpg'),
  ('Aryan Patel', '/images/people/2026-2027/2026AryanPatel_Sponsorship.jpg'),
  ('Andrew Robinson', '/images/people/2026-2027/2026AndrewRobinson_Sponsorship.jpg'),
  ('Brigid O''Sullivan', '/images/people/2026-2027/2026BrigidOSullivan_Sponsorship.jpg'),
  ('Jossaya Camille', '/images/people/2026-2027/2026JossayaCamille_Technology.jpg'),
  ('Zayd Tawam', '/images/people/2026-2027/2026ZaydTawam_Technology.jpg'),
  ('John Courtney', '/images/people/2026-2027/2026JohnCourtney_Technology.jpg'),
  ('Ragul Thiyagarajan', '/images/people/2026-2027/2026RagulThiyagarajan_Workshop.jpg'),
  ('Devereaux Dumas', '/images/people/2026-2027/2026DevereauxDumas_Workshop.jpg'),
  ('Anjali Tomerlin', '/images/people/2026-2027/2026AnjaliTomerlin_Workshop.jpg'),
  ('Hayden Luong', '/images/people/2026-2027/2026HaydenLuong_Workshop.jpg'),
  ('Sai Rajan', '/images/people/2026-2027/2026SaiRajan_Workshop.jpg'),
  ('Hana Elbatouty', '/images/people/2026-2027/2026HanaElbatouty_Technology.jpg')
) as v(name, headshot)
where b.year = 2027 and b.name = v.name;
