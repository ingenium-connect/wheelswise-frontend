import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN } from "@/utilities/constants";

export async function GET(req: NextRequest) {
  const loginUrl = new URL("/login", req.nextUrl.origin);
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

  return response;
}
