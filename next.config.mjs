const ALB_URL = process.env.NEXT_PUBLIC_DIRECT_ALB_URL || "https://api.codeiu.in";
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["randomuser.me", "cdn.prod.website-files.com", "api.codeiu.in"],
  },

  // Enables cross-origin isolation and specific headers only in production
  async headers() {
    const isLocal = !process.env.NEXT_PUBLIC_DIRECT_ALB_URL || process.env.NEXT_PUBLIC_DIRECT_ALB_URL.includes("localhost");
    if (isLocal) return [];
    
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Embedder-Policy', value: 'credentialless' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
    ];
  },
  
  // Custom rewrites to proxy requests to backend services via API Gateway proxy rewrite
  async rewrites() {
    // Check if we are running against localhost services
    const isLocal = !process.env.NEXT_PUBLIC_DIRECT_ALB_URL || process.env.NEXT_PUBLIC_DIRECT_ALB_URL.includes("localhost");

    if (isLocal) {
      // ✅ LOCAL DEVELOPMENT: Route directly to microservices
      // Microservices expect the API gateway prefix in their own Express routing, so we must construct it!
      return [
        {
          source: "/api/v1/auth/:path*",
          destination: "http://localhost:8020/auth/api/v1/auth/:path*",
        },
        {
          source: "/api/v1/admin/:path*",
          destination: "http://localhost:8020/auth/api/v1/admin/:path*",
        },
        {
          source: "/api/v1/submission/:path*",
          destination: "http://localhost:8080/submission/api/v1/submission/:path*",
        },
        {
          source: "/api/v1/execute/:path*",
          destination: "http://localhost:8080/submission/api/v1/execute/:path*",
        },
        {
          source: "/api/v1/contest/:path*",
          destination: "http://localhost:8090/contest/api/v1/contest/:path*",
        },
        {
          source: "/api/v1/notification/:path*",
          destination: "http://localhost:8030/notification/api/v1/notification/:path*",
        },
        {
          source: "/api/v1/:service/:path*",
          // This fallback handles "problem" -> 8000
          destination: "http://localhost:8000/:service/api/v1/:service/:path*", 
        },
      ];
    } else {
      // 🌥️ PRODUCTION: Route through single ALB URL
      return [
        {
          source: "/api/:service/health",
          destination: `${ALB_URL}/:service/health`,
        },
        {
          source: "/api/v1/auth/:path*",
          destination: `${ALB_URL}/auth/api/v1/auth/:path*`,
        },
        {
          source: "/api/v1/admin/:path*",
          destination: `${ALB_URL}/auth/api/v1/admin/:path*`,
        },
        {
          source: "/api/v1/submission/:path*",
          destination: `${ALB_URL}/submission/api/v1/submission/:path*`,
        },
        {
          source: "/api/v1/execute/:path*",
          destination: `${ALB_URL}/submission/api/v1/execute/:path*`,
        },
        {
          source: "/api/v1/:service/:path*",
          destination: `${ALB_URL}/:service/api/v1/:service/:path*`,
        }
      ];
    }
  },
};

export default nextConfig;
