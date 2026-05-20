// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// import { decrypt } from '@/lib/session';
// import { cookies } from 'next/headers';



// export default async function proxy(request: NextRequest) {

//     const cookieStore = await cookies();
//     const sessionCookie = cookieStore.get("session")?.value;

//     const user = sessionCookie ? await decrypt(sessionCookie) : null;

//     const isOwner = user?.role === "owner";
//     const isMandor = user?.role === "mandor";


//     if (request.nextUrl.pathname.startsWith('/login')) {

//         if (sessionCookie) {
//             let targetRoute = 'login'

//             if (isOwner) {
            
//                 targetRoute = '/owner';
            
//             } else {
                
//                 targetRoute = '/mandor'
            
//             }
//             return NextResponse.redirect(new URL(targetRoute, request.url));

//         }
//     }

//     if (request.nextUrl.pathname.startsWith('/owner')) {

//         if (!sessionCookie || !isOwner) {

//             return NextResponse.redirect(new URL('/login', request.url));

//         }

//     }

//     if (request.nextUrl.pathname.startsWith('/mandor')) {

//         if (!sessionCookie || !isMandor) {

//             return NextResponse.redirect(new URL('/login', request.url));

//         }

//     }
// }

// export const config = {

//     matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],

// };

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session';

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Fix Cookie Extraction: Use request.cookies instead of next/headers
    const sessionCookie = request.cookies.get("session")?.value;
    
    // Safely decrypt if cookie exists
    const user = sessionCookie ? await decrypt(sessionCookie) : null;

    const isOwner = user?.role === "owner";
    const isMandor = user?.role === "mandor";

    // 2. Handle ROOT path (/) explicitly so it doesn't get lost
    if (pathname === '/') {
        if (sessionCookie) {
            const target = isOwner ? '/owner/dashboard' : isMandor ? '/mandor/dashboard' : '/login';
            return NextResponse.redirect(new URL(target, request.url));
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 3. Handle LOGIN path logic
    if (pathname.startsWith('/login')) {
        if (sessionCookie) {
            // Crucial: Send them to their full dashboard path, not just the base directory name
            const targetRoute = isOwner ? '/owner/dashboard' : '/mandor/dashboard';
            return NextResponse.redirect(new URL(targetRoute, request.url));
        }
        // If no session, allow them to view the login page safely
        return NextResponse.next();
    }

    // 4. Protect OWNER paths
    if (pathname.startsWith('/owner')) {
        if (!sessionCookie || !isOwner) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // 5. Protect MANDOR paths
    if (pathname.startsWith('/mandor')) {
        if (!sessionCookie || !isMandor) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Allow the request to proceed if it passes all checks
    return NextResponse.next();
}

export const config = {
    // Keeps your static assets clean from running middleware logic
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};