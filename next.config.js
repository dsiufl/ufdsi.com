const symposiumYear = require("./src/lib/symposium-year.json");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "",
      },
      {
        protocol: "https",
        hostname: "nljfmwgzmavnjzmiqgbp.supabase.co"
      }
    ],
  },
  experimental: {
    authInterrupts: true,
  },
  // Retired routes. The calendar now lives on the workshops page.
  async redirects() {
    return [
      { source: "/calendar", destination: "/workshops-list#calendar", permanent: true },
      { source: "/symposium", destination: `/symposium/${symposiumYear.current}`, permanent: false },
      { source: "/symposium-new", destination: `/symposium/${symposiumYear.current}`, permanent: false },
      { source: "/error", destination: "/", permanent: true },
    ];
  },
};

module.exports = nextConfig;
