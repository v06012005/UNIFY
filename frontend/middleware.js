import { NextResponse } from 'next/server'
import { verifySession } from './app/lib/dal'

// 1. Specify protected and public routes
const protectedRoutes = ['/profile', "/", "/settings", "/explore", "/reels", "/messages", "/posts"]
const publicRoutes = ['/login', '/signup']

export default async function middleware(req) {
    // 2. Check if the current route is protected or public
    const path = req.nextUrl.pathname
    // const isProtectedRoute = protectedRoutes.includes(path)
    const isPublicRoute = publicRoutes.includes(path)

    // 3. Decrypt the session from the cookie
    const session = await verifySession();

    // 5. Redirect to /login if the user is not authenticated
    if (!isPublicRoute && !session?.isAuth) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    // 6. Redirect to wanted path if the user is authenticated
    if (
        isPublicRoute &&
        session?.isAuth &&
        !req.nextUrl.pathname.startsWith(path)
    ) {
        return NextResponse.redirect(new URL(path, req.nextUrl))
    }

    return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}