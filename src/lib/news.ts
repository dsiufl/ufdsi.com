// Matches the "Permissions for correct users" policy on public.news.
export const NEWS_PUBLISHER_ROLES = ["President", "Technology Coordinator", "Marketing Coordinator"];

export const canPublishNews = (role?: string | null) => !!role && NEWS_PUBLISHER_ROLES.includes(role);
