import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// Import the helper exactly as you had it in proxy.ts
import { updateSession } from '@/lib/supabase/proxy'

export async function middleware(request: NextRequest) {
  
  // 1. DEV MODE: Allow everything so you can work on localhost
  if (process.env.NODE_ENV === 'development') {
    return await updateSession(request)
  }

  const { pathname } = request.nextUrl

  // 2. STATIC FILES: Always allow Next.js internals, APIs, and images
  // This ensures your site styles and Supabase auth endpoints still work
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.includes('.')
  ) {
    return await updateSession(request)
  }

  // 3. HOME PAGE: Allow the "Coming Soon" page to load (and run auth)
  if (pathname === '/') {
    return await updateSession(request)
  }

  // 4. BLOCK EVERYTHING ELSE: Redirect deep links back to home
  return NextResponse.redirect(new URL('/', request.url))
}

// Use your existing matcher config (it was good!)
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}