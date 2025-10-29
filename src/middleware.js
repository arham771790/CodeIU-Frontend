import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

console.log('JWT_SECRET:', process.env.JWT_SECRET);


async function verifyToken(token) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload; 
  } catch (e) {
    console.error('Token verification failed:', e.message);
    return null; // Token is invalid, expired, or malformed
  }
}

export async function middleware(request) {
  // 1. Get the auth token from the user's cookies
  const token = request.cookies.get('token')?.value;

  // 2. Get the URL the user is trying to visit
  const { pathname } = request.nextUrl;

  // 3. Define your protected pages
  const protectedPaths = [
    '/contest',
    '/problem',
    '/profile',
    '/Admin',
    '/Each-problem',
    '/Contest_ProblemPage',
    '/CreateProblem' ,
    '/Leaderboard' ,
    
    // Add any other pages that require login
  ];

  const adminPaths = ['/Admin', '/CreateProblem'];

  // 4. Define pages for logged-in users to avoid
  const authPaths = ['/login', '/signup'];

  const isAccessingAdminPath = adminPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isAccessingAdminPath) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    console.log('User :', user)

    if (user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

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


{/* ........................NOTE.............................. 
  
  
  HERE THEIR WILL BE A FIX AS THEIR IS A SECURITY BUG HERE

  => problem is when i am login and changin role in the 
  data base it remain the previous role for example i loged 
  in as admin and then when to database and changed ther role
   to user but not loged out so i can accesss it aFter logout
    when i am logigng then i cant access the admin page so
     this is a bug  so this is called STALE SESSION OR STALE TOKEN  means my middleware 
     checking the previous data as it only ckecks the data when compiled.
     
     
HOW I CAN SOLVE IT :  i have to make a checkadmin controller in auth service  which will
                      directly check the role from database not from token this is the only way.

  
*/}