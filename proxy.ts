import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow homepage and system/static files
  const isHomePage = pathname === '/'
  const isPublicFile = pathname.includes('.')
  const isNextInternal = pathname.startsWith('/_next')

  // Redirect everything else to home
//   if (!isHomePage && !isPublicFile && !isNextInternal) {
//     return NextResponse.redirect(new URL('/', request.url))
//   }

  // Run your Supabase session update
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
