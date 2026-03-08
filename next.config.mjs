const ALB_URL = process.env.NEXT_PUBLIC_DIRECT_ALB_URL || "https://api.codeiu.in";
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "https", hostname: "cdn.prod.website-files.com" },
      { protocol: "https", hostname: "api.codeiu.in" },
      { protocol: "https", hostname: "codeiu.in" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400, // 24h browser cache for optimized images
  },

  // Compress output
  compress: true,

  // Generate ETags for static pages
  generateEtags: true,

  // Strict React mode for catching bugs
  reactStrictMode: true,

  // Powered-by header removal (security)
  poweredByHeader: false,

  // Production source maps disabled for smaller bundles
  productionBrowserSourceMaps: false,

  // CDN & Security Headers
  async headers() {
    const isLocal = !process.env.NEXT_PUBLIC_DIRECT_ALB_URL || process.env.NEXT_PUBLIC_DIRECT_ALB_URL.includes("localhost");

    const securityHeaders = [
      // Prevent MIME-type sniffing
      { key: "X-Content-Type-Options", value: "nosniff" },
      // Prevent clickjacking
      { key: "X-Frame-Options", value: "DENY" },
      // XSS protection fallback
      { key: "X-XSS-Protection", value: "1; mode=block" },
      // Referrer policy
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      // DNS prefetch for external resources
      { key: "X-DNS-Prefetch-Control", value: "on" },
    ];

    const crossOriginHeaders = isLocal ? [] : [
      { key: 'Cross-Origin-Embedder-Policy', value: 'credentialless' },
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
    ];

    return [
      // All pages: security headers
      {
        source: '/(.*)',
        headers: [...securityHeaders, ...crossOriginHeaders],
      },
      // Static assets: aggressive long-term caching
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Public folder static assets
      {
        source: '/(.*)\\.(ico|png|jpg|jpeg|svg|webp|avif|woff2|woff|css|js)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' },
        ],
      },
      // Fonts: very long cache
      {
        source: '/_next/static/media/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
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
          source: "/api/v1/playlist/:path*",
          destination: "http://localhost:8000/problem/api/v1/playlist/:path*",
        },
        {
          source: "/api/v1/playlist",
          destination: "http://localhost:8000/problem/api/v1/playlist",
        },
        {
          source: "/api/v1/:service/:path*",
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
          source: "/api/v1/playlist/:path*",
          destination: `${ALB_URL}/problem/api/v1/playlist/:path*`,
        },
        {
          source: "/api/v1/playlist",
          destination: `${ALB_URL}/problem/api/v1/playlist`,
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
