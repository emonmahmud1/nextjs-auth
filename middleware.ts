import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for Authentication and Route Protection
 * 
 * This middleware runs before every request to check authentication status
 * and protect routes that require authentication.
 * 
 * BEST PRACTICE: Use middleware for:
 * - Route protection (redirecting unauthenticated users)
 * - Token validation
 * - Setting security headers
 * - Logging and analytics
 */

// Define protected routes that require authentication
const protectedRoutes = [
  '/',
  '/dashboard',
  // Add more protected routes here
];

// Define auth routes that authenticated users shouldn't access
const authRoutes = ['/login', '/register'];

/**
 * Middleware function
 * Checks authentication and redirects if necessary
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookies or headers
  const token = request.cookies.get('auth_token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route) && pathname !== '/login' && pathname !== '/register'
  );
  
  // Check if current path is an auth route
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // If user is not authenticated and trying to access protected route
  if (isProtectedRoute && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname); // Save intended destination
    return NextResponse.redirect(url);
  }

  // If user is authenticated and trying to access auth routes
  // Redirect to home page
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Add security headers
  const response = NextResponse.next();
  
  // Security headers (best practice)
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

/**
 * Matcher configuration
 * Specifies which routes this middleware should run on
 * 
 * IMPORTANT: Exclude static files, API routes (if not protected), and _next folder
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - handle auth separately if needed)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};
