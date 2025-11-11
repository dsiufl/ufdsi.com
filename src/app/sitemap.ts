import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ufdsi.com";

  const routes = [
    "",
    "/about",
    "/calendar",
    "/contact",
    "/newsletter",
    "/projects",
    "/symposium",
    "/team",
    "/workshops-list",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === "" ? 1 : 0.8,
  }));
}
