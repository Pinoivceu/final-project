import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';



export default async function proxy(request: NextRequest) {

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    const user = sessionCookie ? await decrypt(sessionCookie) : null;

    const isOwner = user?.role === "owner";
    const isMandor = user?.role === "mandor";


    if (request.nextUrl.pathname.startsWith('/login')) {

        if (sessionCookie) {
            let targetRoute = 'login'

            if (isOwner) {
            
                targetRoute = '/owner';
            
            } else {
                
                targetRoute = '/mandor'
            
            }
            return NextResponse.redirect(new URL(targetRoute, request.url));

        }
    }

    if (request.nextUrl.pathname.startsWith('/owner')) {

        if (!sessionCookie || !isOwner) {

            return NextResponse.redirect(new URL('/login', request.url));

        }

    }

    if (request.nextUrl.pathname.startsWith('/mandor')) {

        if (!sessionCookie || !isMandor) {

            return NextResponse.redirect(new URL('/login', request.url));

        }

    }
}

export const config = {

    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],

};