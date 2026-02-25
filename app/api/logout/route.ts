import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN } from "@/utilities/constants";

export async function GET(req: NextRequest) {
  const forwardedHost = req.headers.get("x-forwarded-host");
  const forwardedProto = req.headers.get("x-forwarded-proto") ?? "https";
  const origin = forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : req.nextUrl.origin;
  const loginUrl = new URL("/login", origin);
  const response = NextResponse.redirect(loginUrl);

  // Clear the access token cookie by setting it with maxAge 0
  response.cookies.set({
    name: ACCESS_TOKEN,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  // Also signal the client to clear client-side state (localStorage + persisted stores)
  response.cookies.set({
    name: "clear_client_state",
    value: "1",
    path: "/",
    sameSite: "lax",
  });

  return response;
}
