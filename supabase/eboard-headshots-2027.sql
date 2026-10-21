-- New 2026-27 headshots for Chelsea Zhao and Safi Ali. Safe to run more than once.

update public.board
set headshot = '/images/people/2026-2027/2026ChelseaZhao_NetworkingDirector.jpg'
where year = 2027 and name = 'Chelsea Zhao';

update public.board
set headshot = '/images/people/2026-2027/2026SafiAli_InternalVicePresident.jpg'
where year = 2027 and name = 'Safi Ali';
