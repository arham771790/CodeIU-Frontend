
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Helper to verify token locally without calling backend
async function verifyToken(token) {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET environment variable is not set');
    return null;
  }
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload; 
  } catch (e) {
    console.error('Token verification failed:', e.message);
    return null; 
  }
}

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // 1. DEFINITION: Protected Paths (Require Login)
  // We REMOVED: /contest, /problem, /Each-problem, /Leaderboard (Now Public)
  const protectedPaths = [
     '/profile',
    '/contest-problem-view',
    '/problems/create-problem' ,
    '/leaderboard' ,
    
    // Add other sensitive user-specific routes here
  ];

  const adminPaths = ['/admin']; // /problems/create-problem is already in protectedPaths but admin check handles role
  const authPaths = ['/login', '/signup', '/forget-user', '/reset-password', '/verify-email'];

  // ... (previous checks)

  // 4. CHECK: Auth Pages (Login/Signup/etc.) - Guest Only
  const isAccessingAuthPath = authPaths.some((path) => pathname.startsWith(path));
  if (isAccessingAuthPath) {
    if (token) {
      const user = await verifyToken(token);
      if (user) {
        // If valid session exists, don't allow access to login/signup
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
