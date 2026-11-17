// Matches the "Any " policy on public.workshops.
export const WORKSHOP_PUBLISHER_ROLES = ["President", "Technology Coordinator", "Workshop Coordinator"];

export const canPublishWorkshops = (role?: string | null) => !!role && WORKSHOP_PUBLISHER_ROLES.includes(role);
