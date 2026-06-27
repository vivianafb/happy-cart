import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import type { NextRequest } from 'next/server'

const isProtected = createRouteMatcher(['/cart(.*)', '/invoice(.*)'])

export default clerkMiddleware(async (auth, req: NextRequest) => {
  if (isProtected(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/(api|trpc)(.*)',
    '/__clerk/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
