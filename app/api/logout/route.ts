import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN, REFRESH_TOKEN, USER_ID, NAME, EMAIL } from "@/utilities/constants";

/**
 * Clear all auth cookies helper
 */
function clearAuthCookies(response: NextResponse) {
  const cookiesToClear = [ACCESS_TOKEN, REFRESH_TOKEN, USER_ID, NAME, EMAIL];

  cookiesToClear.forEach((cookieName) => {
    response.cookies.set({
      name: cookieName,
      value: "",
      httpOnly: cookieName === ACCESS_TOKEN || cookieName === REFRESH_TOKEN,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  });

  // Also signal the client to clear client-side state (localStorage + persisted stores)
  response.cookies.set({
    name: "clear_client_state",
    value: "1",
    path: "/",
    sameSite: "lax",
  });
}

/**
 * GET /api/logout - Clears cookies and redirects to login
 * Used when called directly via window.location.href
 */
export async function GET(req: NextRequest) {
  const forwardedHost = req.headers.get("x-forwarded-host");
  const forwardedProto = req.headers.get("x-forwarded-proto") ?? "https";
  const origin = forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : req.nextUrl.origin;
  const loginUrl = new URL("/login", origin);
  const response = NextResponse.redirect(loginUrl);

  clearAuthCookies(response);

  return response;
}

/**
 * POST /api/logout - Clears cookies and returns success
 * Used when called via fetch() so client can handle redirect
 */
export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true });

  clearAuthCookies(response);

  return response;
}
