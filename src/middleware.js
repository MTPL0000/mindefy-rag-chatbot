import { NextResponse } from 'next/server';

export function middleware(request) {
  // Use clone() to avoid mutating the original request URL in unexpected ways
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  const path = url.pathname;

  // Domain definitions
  const portfolioDomain = 'portfolio.mindefy.tech';
  const askDocsDomain = 'ask.mindefy.tech';
  const moviesDomain = 'movie-recommendation.mindefy.tech';

  // Environment checks
  const isDev = hostname.includes('localhost');
  
  // Normalize hostname to handle www subdomain if present
  const cleanHostname = hostname.replace('www.', '');

  // 1. Portfolio Domain
  if (cleanHostname === portfolioDomain) {
    // If the path doesn't already start with /portfolio, rewrite it
    if (!path.startsWith('/portfolio')) {
      url.pathname = `/portfolio${path === '/' ? '' : path}`;
      return NextResponse.rewrite(url);
    }
  }

  // 2. AskDocs Domain
  if (cleanHostname === askDocsDomain) {
    if (!path.startsWith('/askdocs')) {
      url.pathname = `/askdocs${path === '/' ? '' : path}`;
      return NextResponse.rewrite(url);
    }
  }

  // 3. Movies Domain
  if (cleanHostname === moviesDomain) {
    if (!path.startsWith('/movies')) {
      url.pathname = `/movies${path === '/' ? '' : path}`;
      return NextResponse.rewrite(url);
    }
  }

  // 4. Localhost Development
  if (isDev) {
    // If accessing root, show portfolio by default
    if (path === '/') {
      url.pathname = '/portfolio';
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
