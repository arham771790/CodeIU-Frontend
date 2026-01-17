const ALB_URL = process.env.NEXT_PUBLIC_DIRECT_ALB_URL || "https://api.codeiu.in";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["randomuser.me", "cdn.prod.website-files.com"],
  },
  async rewrites() {
    return [
      // Submission Service: /{service}/api/v1/{path}
      {
        source: "/api/v1/submission/:path*",
        destination:
          `${ALB_URL}/submission/api/v1/:path*`,
      },
      // Other Services: /{service}/api/v1/{service}/{path}
      {
        source: "/api/v1/:service/:path*",
        destination:
          `${ALB_URL}/:service/api/v1/:service/:path*`,
      },
    ];
  },
};

export default nextConfig;
