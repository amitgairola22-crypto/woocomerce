import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  if (pathname.startsWith('/admin')) {
    if (!session?.user) {
      return NextResponse.redirect(new URL(`/login?callbackUrl=${pathname}`, req.url))
    }
    const role = (session.user as { role?: string }).role
    if (!role || !['admin', 'manager'].includes(role)) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*'],
}
