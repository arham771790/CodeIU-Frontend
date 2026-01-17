const ALB_URL = process.env.NEXT_PUBLIC_DIRECT_ALB_URL || "https://api.codeiu.in";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["randomuser.me", "cdn.prod.website-files.com"],
  },

  async rewrites() {
    return [
      // ---------- HEALTH ROUTES ----------
      {
        source: "/api/:service/health",
        destination: `${ALB_URL}/:service/health`,
      },

      // ---------- API v1 ROUTES ----------
      {
        source: "/api/v1/:service/:path*",
        destination: `${ALB_URL}/:service/api/v1/:service/:path*`,
      },
    ];
  },
};

export default nextConfig;
