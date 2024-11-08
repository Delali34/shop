// middleware.js
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/signup");

    // Store the original destination for after login
    const callbackUrl = req.nextUrl.searchParams.get("callbackUrl");

    if (isAuthPage) {
      if (isAuth) {
        // If user is already logged in on auth pages
        return NextResponse.redirect(new URL(callbackUrl || "/", req.url));
      }
      // Let them access login/signup pages
      return NextResponse.next();
    }

    if (!isAuth) {
      // If user is not logged in, redirect to login with callback
      const from = req.nextUrl.pathname + req.nextUrl.search;
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(from)}`, req.url)
      );
    }

    // Allow authenticated users to access protected pages
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => true,
    },
  }
);

export const config = {
  matcher: [
    "/profile/:path*",
    "/orders/:path*",
    "/checkout/:path*",
    "/login",
    "/signup",
  ],
};
