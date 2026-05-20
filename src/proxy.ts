import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// Inline the decrypt logic here because session.ts imports 'server-only'
// which is incompatible with the Edge Runtime that middleware runs in.
const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

async function decryptSession(session: string) {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch {
    return null
  }
}

export async function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value
  const user = sessionCookie ? await decryptSession(sessionCookie) : null

  const isOwner = user?.role === 'owner'
  const isMandor = user?.role === 'mandor'
  const pathname = request.nextUrl.pathname

  // --- Root page "/" ---
  // Redirect logged-in users to their dashboard, otherwise to login
  if (pathname === '/') {
    if (isOwner) {
      return NextResponse.redirect(new URL('/owner/dashboard', request.url))
    }
    if (isMandor) {
      return NextResponse.redirect(new URL('/mandor/dashboard', request.url))
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // --- Login page ---
  // Logged-in users visiting /login → redirect to their dashboard
  if (pathname.startsWith('/login')) {
    if (isOwner) {
      return NextResponse.redirect(new URL('/owner/dashboard', request.url))
    }
    if (isMandor) {
      return NextResponse.redirect(new URL('/mandor/dashboard', request.url))
    }
    // Not logged in, let them see the login page
    return NextResponse.next()
  }

  // --- Protected owner routes ---
  if (pathname.startsWith('/owner')) {
    if (!user) {
      // Not logged in → go to login
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (isMandor) {
      // Mandor trying to access owner pages → redirect to mandor dashboard
      return NextResponse.redirect(new URL('/mandor/dashboard', request.url))
    }
    // User is owner → allow access
    return NextResponse.next()
  }

  // --- Protected mandor routes ---
  if (pathname.startsWith('/mandor')) {
    if (!user) {
      // Not logged in → go to login
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (isOwner) {
      // Owner trying to access mandor pages → redirect to owner dashboard
      return NextResponse.redirect(new URL('/owner/dashboard', request.url))
    }
    // User is mandor → allow access
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
