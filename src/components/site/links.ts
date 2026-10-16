import { symposiumHref } from "@/lib/symposia";

export const DISCORD_URL = "https://discord.gg/GUEAwEhRQw";

export const socials = [
  { name: "Instagram", handle: "@uf_dsi", href: "https://www.instagram.com/uf_dsi/" },
  { name: "LinkedIn", handle: "dsiufl", href: "https://www.linkedin.com/company/dsiufl/" },
  { name: "YouTube", handle: "@ufdsi", href: "https://www.youtube.com/@ufdsi" },
];

export const navLinks = [
  { title: "About", href: "/about" },
  { title: "Workshops", href: "/workshops-list" },
  { title: "Projects", href: "/projects" },
  { title: "Symposium", href: symposiumHref() },
  { title: "Team", href: "/team" },
  { title: "News", href: "/newsletter" },
];
