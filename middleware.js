// middleware.js
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const { pathname } = req.nextUrl;

    const isAuthPage =
      pathname.startsWith("/login") || pathname.startsWith("/signup");
    const isAdminPage = pathname.startsWith("/admin");

    const callbackUrl = req.nextUrl.searchParams.get("callbackUrl");

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL(callbackUrl || "/", req.url));
      }
      return NextResponse.next();
    }

    if (!isAuth) {
      const from = pathname + req.nextUrl.search;
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(from)}`, req.url)
      );
    }

    // Admin pages require admin role
    if (isAdminPage && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

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
    "/admin/:path*",
    "/login",
    "/signup",
  ],
};
