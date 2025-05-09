import { NextResponse } from "next/server";
import { getUser, verifySession } from "@/app/lib/dal";

// 1. Specify protected and public routes
const protectedRoutes = ["/statistics", "/manage"];
const publicRoutes = [
  "/login",
  "/register",
  "/password/reset",
  "/landing",
  "/password/reset/otp-verification",
  "/password/reset/confirm",
];

export default async function middleware(req) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.some((p) => path.startsWith(p));
  const isProtectedRoute = protectedRoutes.some((p) => path.startsWith(p));

  // 3. Decrypt the session from the cookie
  const session = await verifySession();

  if (isProtectedRoute && session?.isAuth) {
    const user = await getUser();
    if (user?.roles[0]?.id === 2) {
      // Assuming role id 2 is for USER
      return NextResponse.redirect(new URL("/page-not-found", req.nextUrl));
    }
  }

  if (session?.isAuth && publicRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // 5. Redirect to /login if the user is not authenticated
  if (!isPublicRoute && !session?.isAuth) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (
    isPublicRoute &&
    session?.isAuth &&
    !req.nextUrl.pathname.startsWith(path)
  ) {
    return NextResponse.redirect(new URL(path, req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
