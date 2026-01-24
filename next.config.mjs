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

      // ---------- AUTH SERVICE OVERRIDES ----------
      {
        source: "/api/v1/auth/:path*",
        destination: `${ALB_URL}/auth/api/v1/auth/:path*`,
      },
      {
        source: "/api/v1/admin/:path*",
        destination: `${ALB_URL}/auth/api/v1/admin/:path*`,
      },

      // ---------- SUBMISSION SERVICE OVERRIDES ----------
      {
        source: "/api/v1/submission/:path*",
        destination: `${ALB_URL}/submission/api/v1/submission/:path*`,
      },
      {
        source: "/api/v1/execute/:path*",
        destination: `${ALB_URL}/submission/api/v1/execute/:path*`,
      },

      // ---------- API v1 ROUTES (Generic Pattern: /alb_prefix/api/v1/internal_path) ----------

      // NEW: Contest endpoints
      {
        source: "/api/v1/contests/:id/status",
        destination: `${ALB_URL}/contest/api/v1/contest/contests/:id/status`,
      },
      {
        source: "/api/v1/contests/:id/violation",
        destination: `${ALB_URL}/contest/api/v1/contest/contests/:id/violation`,
      },
      {
        source: "/api/v1/contests/:id/eligibility",
        destination: `${ALB_URL}/contest/api/v1/contest/contests/:id/eligibility`,
      },
      {
        source: "/api/v1/contests/:id/finish",
        destination: `${ALB_URL}/contest/api/v1/contest/contests/:id/finish`,
      },
      {
        source: "/api/v1/contests/:id/bundle",
        destination: `${ALB_URL}/contest/api/v1/contest/contests/:id/bundle`,
      },

      // NEW: User/Submission endpoints
      {
        source: "/api/v1/users/:userId/submissions",
        destination: `${ALB_URL}/submission/api/v1/users/:userId/submissions`,
      },
      {
        source: "/api/v1/submissions/:id/source",
        destination: `${ALB_URL}/submission/api/v1/submissions/:id/source`,
      },
      {
        source: "/api/v1/submissions/get-Submissions-For-Problem/:problemId",
        destination: `${ALB_URL}/submission/api/v1/submission/get-Submissions-For-Problem/:problemId`,
      },

      {
        source: "/api/v1/:service/:path*",
        destination: `${ALB_URL}/:service/api/v1/:service/:path*`,
      },
    ];
  },
};

export default nextConfig;
