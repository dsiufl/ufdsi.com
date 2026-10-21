# Loading the 2027 junior board

Run `jboard-2027.sql` in the Supabase SQL editor. It is safe to run more than once.

- It adds the `email` column to `board` if it is missing.
- It inserts each coordinator with their role (the team plus " Coordinator", which is what the team page groups on) and email. People already in `board` for 2027 with the same name are skipped.
- It then sets the role and email for everyone on the list, so people who were already in the table end up in the right team too.

Headshots are left empty, so the page shows initials. Set `board.headshot` per person once photos are uploaded.

Then run `eboard-2027.sql` for the executive board and `carry-over-photos-2027.sql` to reuse last year's headshots. The team page reads `board.year = 2027`.
