-- Database-level validation for admin.people.role. Previously free text,
-- enforced only by the UI (and not even that, before the role dropdown
-- shipped). Mirrors src/lib/roles.ts -- keep both lists in sync.
--
-- Matches https://www.ufdsi.com/team, plus two legacy values already in use
-- that aren't shown on the public team page: "President" (the team page now
-- shows "Co-President" for the same seat; both are kept valid rather than
-- rewriting existing rows) and "Advisor" (a non-elected role, intentionally
-- not public-facing).
--
-- role stays nullable -- this only constrains it when actually set.
alter table admin.people
    add constraint people_role_check check (
        role is null or role = any (array[
            'President',
            'Co-President',
            'Internal Vice President',
            'Secretary',
            'Treasurer',
            'Workshop Director',
            'Networking Director',
            'Project Director',
            'Research Director',
            'Hackathon Director',
            'Advisor',
            'Technology Coordinator',
            'Workshop Coordinator',
            'Marketing Coordinator',
            'Sponsorship Coordinator',
            'Networking Coordinator',
            'Event Coordinator',
            'Hackathon Coordinator',
            'Research Coordinator'
        ])
    );
