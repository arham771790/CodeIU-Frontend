// src/app/(pages)/layout.jsx
// Security is now handled by Next.js middleware.js (Edge-level cookie check).
// No need for AuthGuard wrapper anymore — the middleware physically
// blocks unauthenticated users from even receiving this page's JS bundle.

export default function ProtectedLayout({ children }) {
  return <>{children}</>;
}
