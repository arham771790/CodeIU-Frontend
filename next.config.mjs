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
          "https://api.codeiu.in/submission/api/v1/:path*",
      },
      // Other Services: /{service}/api/v1/{service}/{path}
      {
        source: "/api/v1/:service/:path*",
        destination:
          "https://api.codeiu.in/:service/api/v1/:service/:path*",
      },
    ];
  },
};

export default nextConfig;
