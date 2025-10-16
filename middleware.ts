import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/login', '/forgot-password'];
const adminPaths = ['/admin'];
const essPaths = ['/ess'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('quantum-hr-token')?.value;
  const userRole = request.cookies.get('quantum-hr-role')?.value;
  const { pathname } = request.nextUrl;

  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (adminPaths.some((path) => pathname.startsWith(path))) {
    if (
      userRole !== 'super_admin' &&
      userRole !== 'hr_admin' &&
      userRole !== 'payroll_admin'
    ) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  if (essPaths.some((path) => pathname.startsWith(path))) {
    if (!userRole) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
