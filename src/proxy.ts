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

  // Logged-in users visiting /login → redirect to their dashboard
  if (pathname.startsWith('/login')) {
    if (user) {
      if (isOwner) {
        return NextResponse.redirect(new URL('/owner', request.url))
      }
      if (isMandor) {
        return NextResponse.redirect(new URL('/mandor', request.url))
      }
    }
    // Not logged in, let them see the login page
    return NextResponse.next()
  }

  // Protected owner routes
  if (pathname.startsWith('/owner')) {
    if (!user || !isOwner) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  // Protected mandor routes
  if (pathname.startsWith('/mandor')) {
    if (!user || !isMandor) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
