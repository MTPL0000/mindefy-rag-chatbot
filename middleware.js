import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Get environment variables for domain configuration
  const askDocsUrl = process.env.NEXT_PUBLIC_ASKDOCS_DOMAIN || 'https://askdocs.mindefy.com';
  const cineSenseUrl = process.env.NEXT_PUBLIC_CINESENSE_DOMAIN || 'https://cinesense.mindefy.com';
  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'https://mindefy.com';

  // Extract base hostname without port (for local development)
  const baseHostname = hostname.split(':')[0];

  // Check if we're on a subdomain
  const isAskDocsDomain = baseHostname.includes('askdocs');
  const isCineSenseDomain = baseHostname.includes('cinesense');
  const isMainDomain = !isAskDocsDomain && !isCineSenseDomain;

  // Define all AskDocs routes (RAG Chatbot project)
  const askDocsRoutes = [
    '/login',
    '/signup',
    '/chat',
    '/admin',
    '/profile',
    '/auth'
  ];

  // Define all CineSense routes (Movie Recommendation project)
  const cineSenseRoutes = [
    '/movies',
    '/recommendations'
  ];

  // Helper function to check if pathname starts with any route in array
  const matchesRoute = (path, routes) => {
    return routes.some(route => path.startsWith(route));
  };

  // Redirect logic based on current domain and requested path
  
  // If on main domain and trying to access project routes, redirect to subdomain
  if (isMainDomain) {
    // Redirect AskDocs routes to AskDocs subdomain
    if (matchesRoute(pathname, askDocsRoutes)) {
      return NextResponse.redirect(new URL(pathname, askDocsUrl));
    }
    // Redirect CineSense routes to CineSense subdomain
    if (matchesRoute(pathname, cineSenseRoutes)) {
      return NextResponse.redirect(new URL(pathname, cineSenseUrl));
    }
  }

  // If on AskDocs subdomain
  if (isAskDocsDomain) {
    // Redirect root to /login
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Block access to CineSense routes - redirect to main domain
    if (matchesRoute(pathname, cineSenseRoutes)) {
      return NextResponse.redirect(new URL('/', mainDomain));
    }
  }

  // If on CineSense subdomain
  if (isCineSenseDomain) {
    // Redirect root to /movies
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/movies', request.url));
    }
    // Block access to AskDocs routes - redirect to main domain
    if (matchesRoute(pathname, askDocsRoutes)) {
      return NextResponse.redirect(new URL('/', mainDomain));
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
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
