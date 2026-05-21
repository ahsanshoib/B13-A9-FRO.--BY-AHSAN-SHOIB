import { NextResponse } from "next/server";

const privateRoutes = ["/add-car", "/my-bookings", "/my-cars"];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const isPrivate = privateRoutes.some((r) => pathname.startsWith(r));

  if (isPrivate) {
    const sessionToken =
      request.cookies.get("better-auth.session_token")?.value ||
      request.cookies.get("__Secure-better-auth.session_token")?.value;

    if (!sessionToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/add-car/:path*", "/my-bookings/:path*", "/my-cars/:path*"],
};