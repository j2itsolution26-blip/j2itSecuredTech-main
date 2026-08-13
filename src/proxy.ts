import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from '@/lib/auth/auth.config';

const { auth } = NextAuth(authConfig);

const LOGIN_PATH = '/admin/login';

/**
 * Issues a redirect to a path on this site.
 *
 * `nextUrl.origin` is deliberate: Auth.js resolves it from NEXTAUTH_URL (or,
 * when unset, from the proxy headers because `trustHost` is enabled). Deriving
 * the origin from the raw `Host` header instead would let a spoofed header
 * redirect an administrator to an attacker-controlled login page. Next.js also
 * requires an absolute Location here — a relative one throws ERR_INVALID_URL.
 *
 * Set NEXTAUTH_URL per environment so preview deployments redirect to
 * themselves rather than to production.
 */
function redirectTo(origin: string, path: string) {
  return NextResponse.redirect(new URL(path, origin));
}

/**
 * Request proxy (formerly `middleware.ts`, renamed for the Next 16 convention).
 *
 * Gatekeeps the admin area and stamps cache headers on admin responses. Runs on
 * the edge runtime, so it only reads the JWT — no database access.
 */
export default auth((request) => {
  const { nextUrl } = request;
  const isSignedIn = Boolean(request.auth?.user);
  const isLoginRoute = nextUrl.pathname === LOGIN_PATH;
  const isAdminRoute = nextUrl.pathname.startsWith('/admin');

  if (isAdminRoute && !isLoginRoute && !isSignedIn) {
    // Preserve the requested page so the user lands where they intended.
    const callbackUrl = encodeURIComponent(`${nextUrl.pathname}${nextUrl.search}`);
    return redirectTo(nextUrl.origin, `${LOGIN_PATH}?callbackUrl=${callbackUrl}`);
  }

  if (isLoginRoute && isSignedIn) {
    return redirectTo(nextUrl.origin, '/admin');
  }

  const response = NextResponse.next();

  // The admin console must never be cached or framed.
  if (isAdminRoute) {
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
});

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
