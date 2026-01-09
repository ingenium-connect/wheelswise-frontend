import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN } from "./utilities/constants";

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  let response;

  // Allow static assets and public files
  if (
    [
      "/images",
      "/robots.txt",
      "/site.webmanifest",
      "/sitemap.xml",
      "/favicon.ico",
    ].includes(pathname)
  )
    return;

  response = NextResponse.next();

  const authToken = request.cookies.get(ACCESS_TOKEN)?.value || "";

  // If user is authenticated and trying to access login or register, redirect to /dashboard
  if (
    authToken &&
    (pathname === "/" || pathname.startsWith("/register") || pathname.startsWith("/login"))
  ) {
    return NextResponse.redirect(new URL(`/dashboard`, request.url));
  }

  // If user is unauthenticated and trying to access a protected route redirect to /
  const isAuthPage = pathname.startsWith("/dashboard");
  if (!authToken && isAuthPage) {
    return NextResponse.redirect(new URL(`/`, request.url));
  }

  return response;
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|robots.txt|site.webmanifest|sitemap.xml).*)",
  ],
};
