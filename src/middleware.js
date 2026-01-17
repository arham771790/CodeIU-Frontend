
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
    '/Contest_ProblemPage',
    '/CreateProblem' ,
    '/Leaderboard' ,
    
    // Add other sensitive user-specific routes here
  ];

  const adminPaths = ['/Admin']; // /problems/CreateProblem is already in protectedPaths but admin check handles role
  const authPaths = ['/login', '/signup'];

  // 2. CHECK: Admin Access
  const isAccessingAdminPath = adminPaths.some((path) => pathname.startsWith(path));
  
  if (isAccessingAdminPath) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (user.role !== 'ADMIN') {
      // Redirect to unauthorized or home if they are just a normal user
      return NextResponse.redirect(new URL('/', request.url)); 
    }
    return NextResponse.next();
  }

  // 3. CHECK: General Protected Access
  const isAccessingProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));
  if (isAccessingProtectedPath) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 4. CHECK: Auth Pages (Login/Signup)
  // If user is already logged in, kick them to dashboard
  if (authPaths.includes(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
