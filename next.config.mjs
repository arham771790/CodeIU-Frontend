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

      // ---------- ADMIN OVERRIDE ----------
      {
        source: "/api/v1/admin/:path*",
        destination: `${ALB_URL}/auth/api/v1/admin/:path*`,
      },

      // ---------- SUBMISSION EXECUTE OVERRIDE ----------
      {
        source: "/api/v1/submission/execute/:path*",
        destination: `${ALB_URL}/submission/api/v1/execute/:path*`,
      },

      // ---------- API v1 ROUTES (Generic) ----------
      {
        source: "/api/v1/:service/:path*",
        destination: `${ALB_URL}/:service/api/v1/:service/:path*`,
      },
    ];
  },
};

export default nextConfig;
