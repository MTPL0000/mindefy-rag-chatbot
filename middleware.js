import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Get current path
  let path = url.pathname;

  // Define domains
  // You can use environment variables or hardcode them here
  const portfolioDomain = 'portfolio.mindefy.tech';
  const askDocsDomain = 'ask.mindefy.tech';
  const moviesDomain = 'movie-recommendation.mindefy.tech';

  // Check for localhost (development)
  // We can simulate domains using paths or subdomains if needed, 
  // but for now let's assume direct mapping or fallback
  const isDev = hostname.includes('localhost');

  // Logic for rewriting based on domain

  // 1. Portfolio Domain
  if (hostname === portfolioDomain) {
    // Rewrite all requests to /portfolio
    // e.g. / -> /portfolio
    // e.g. /about -> /portfolio/about
    url.pathname = `/portfolio${path === '/' ? '' : path}`;
    return NextResponse.rewrite(url);
  }

  // 2. AskDocs Domain
  if (hostname === askDocsDomain) {
    // Rewrite to /askdocs
    // e.g. /login -> /askdocs/login
    url.pathname = `/askdocs${path === '/' ? '' : path}`;
    return NextResponse.rewrite(url);
  }

  // 3. Movies Domain
  if (hostname === moviesDomain) {
    // Rewrite to /movies
    // e.g. / -> /movies
    // e.g. /inception -> /movies/inception
    url.pathname = `/movies${path === '/' ? '' : path}`;
    return NextResponse.rewrite(url);
  }

  // Fallback for localhost development
  // We can map localhost:3000 to Portfolio by default, or provide a way to switch
  if (isDev) {
    // For testing purposes, let's allow accessing folders directly or 
    // default to portfolio if path is root
    if (path === '/') {
        url.pathname = '/portfolio';
        return NextResponse.rewrite(url);
    }
    // If path starts with one of our app prefixes, let it pass (standard Next.js behavior)
    // If not, we might want to default to one app. 
    // Let's just leave it standard for dev so you can visit localhost:3000/portfolio etc.
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
