// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Define the paths that SHOULD be allowed
  // We allow the home page ('/') and static files (images, css, favicon)
  const isHomePage = pathname === '/'
  const isPublicFile = pathname.includes('.') // matches favicon.ico, logo.png, etc.
  const isNextInternal = pathname.startsWith('/_next') // matches system scripts

  // 2. If it's NOT the home page and NOT a system file, redirect to home
  if (!isHomePage && !isPublicFile && !isNextInternal) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// 3. Optional: Refine which paths the middleware even looks at
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}