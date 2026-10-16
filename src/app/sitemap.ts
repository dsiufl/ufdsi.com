import { symposia, symposiumHref } from "@/lib/symposia";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ufdsi.com";

  const routes = [
    "",
    "/about",
    "/workshops-list",
    "/projects",
    "/team",
    "/newsletter",
    "/sponsors",
    "/contact",
    ...Object.keys(symposia).map((year) => symposiumHref(Number(year))),
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === "" ? 1 : 0.8,
  }));
}
