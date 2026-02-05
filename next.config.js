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
  }
};

module.exports = nextConfig;
