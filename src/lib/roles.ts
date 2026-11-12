// Single source of truth for valid officer roles, shared by the role
// dropdowns (AddUserDialog, EditUser) and mirrored in the database as a
// CHECK constraint (see supabase/migrations -- keep both in sync).
//
// Matches https://www.ufdsi.com/team, plus two legacy values that exist on
// current accounts but aren't shown on the public team page: "President"
// (team page now shows "Co-President" for the same seat -- both are kept
// valid) and "Advisor" (a non-elected role, intentionally not public-facing).
export const ROLES = [
    "President",
    "Co-President",
    "Internal Vice President",
    "Secretary",
    "Treasurer",
    "Workshop Director",
    "Networking Director",
    "Project Director",
    "Research Director",
    "Hackathon Director",
    "Advisor",
    "Technology Coordinator",
    "Workshop Coordinator",
    "Marketing Coordinator",
    "Sponsorship Coordinator",
    "Networking Coordinator",
    "Event Coordinator",
    "Hackathon Coordinator",
    "Research Coordinator",
] as const;

export type Role = typeof ROLES[number];
