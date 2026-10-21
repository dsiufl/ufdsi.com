# Loading the 2026 junior board

Run these in the Supabase SQL editor, in order. Both are safe to repeat.

1. `jboard-2026.sql` adds the coordinators. It skips anyone already in `board` for 2026 with the same name.
2. `jboard-2026-emails.sql` adds the `email` column and fills it in. The team page shows a mail icon for anyone with an email.

Headshots are left empty, so the page shows initials. Set `board.headshot` per person once photos are uploaded.
