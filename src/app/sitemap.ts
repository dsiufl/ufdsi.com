import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ufdsi.com";

  // Priority tiers:
  //   1.0 — homepage
  //   0.9 — high-traffic landing pages
  //   0.8 — secondary pages
  //   0.7 — supporting pages
  // Excluded: /error, /unsubscribe (noindex)
  const routes: { path: string; priority: number; changeFreq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "",                priority: 1.0, changeFreq: "weekly" },
    { path: "/workshops-list", priority: 0.9, changeFreq: "weekly" },
    { path: "/newsletter",     priority: 0.9, changeFreq: "weekly" },
    { path: "/symposium-new",  priority: 0.9, changeFreq: "weekly" },
    { path: "/about",          priority: 0.8, changeFreq: "monthly" },
    { path: "/calendar",       priority: 0.8, changeFreq: "weekly" },
    { path: "/team",           priority: 0.8, changeFreq: "monthly" },
    { path: "/sponsors",       priority: 0.8, changeFreq: "monthly" },
    { path: "/contact",        priority: 0.7, changeFreq: "monthly" },
    { path: "/symposium",      priority: 0.6, changeFreq: "monthly" },
  ];

  return routes.map(({ path, priority, changeFreq }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: changeFreq,
    priority,
  }));
}
