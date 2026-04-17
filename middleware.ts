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
    return NextResponse.next();

  response = NextResponse.next();

  const authToken = request.cookies.get(ACCESS_TOKEN)?.value || "";
  const isAuthenticated = Boolean(authToken);

  // Add auth status header (can be read by client)
  response.headers.set("X-Auth-Status", isAuthenticated ? "authenticated" : "unauthenticated");

  // If user is authenticated and trying to access login or register, redirect to /dashboard
  if (
    authToken &&
    (pathname === "/" ||
      pathname.startsWith("/register") ||
      pathname.startsWith("/login"))
  ) {
    return NextResponse.redirect(new URL(`/dashboard`, request.url));
  }

  // If user is unauthenticated and trying to access a protected route redirect to /login
  const isAuthPage = pathname.startsWith("/dashboard");
  if (!authToken && isAuthPage) {
    const res = NextResponse.redirect(new URL(`/login`, request.url));
    // Signal the client to clear client-side state (localStorage + stores)
    res.cookies.set({
      name: "clear_client_state",
      value: "1",
      path: "/",
      // not httpOnly so client JS can read and clear it
      sameSite: "lax",
    });
    return res;
  }

  return response;
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|robots.txt|site.webmanifest|sitemap.xml).*)",
  ],
};
