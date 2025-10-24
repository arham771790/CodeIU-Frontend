import { NextResponse } from 'next/server';

export function middleware(request) {
  // 1. Get the auth token from the user's cookies
  const token = request.cookies.get('token')?.value;

  // 2. Get the URL the user is trying to visit
  const { pathname } = request.nextUrl;

  // 3. Define your protected pages
  const protectedPaths = [
    '/contest',
    '/problem',
    '/profile',
   
    '/Each-problem',
    '/Contest_ProblemPage',
    '/CreateProblem' ,
    '/Leaderboard' ,
    
    // Add any other pages that require login
  ];

  // 4. Define pages for logged-in users to avoid
  const authPaths = ['/login', '/signup'];

  // 5. Check if the user is trying to access a protected page
  const isAccessingProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // 6. The main redirect logic
  if (isAccessingProtectedPath) {
    if (!token) {
      // If no token and trying to access a protected page, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 7. (Optional but good) If user IS logged in, don't let them see login/register
  if (authPaths.includes(pathname)) {
    if (token) {
      // If they have a token, redirect them to the home page
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 8. If all checks pass, let the user continue
  return NextResponse.next();
}

// 9. The Matcher: This tells the middleware WHICH routes to run on.
// This is more efficient than running it on every single request.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (YOUR API ROUTES - let your backend middleware handle these)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};