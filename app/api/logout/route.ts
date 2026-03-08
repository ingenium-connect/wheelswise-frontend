import { NextResponse } from "next/server";
import { ACCESS_TOKEN } from "@/utilities/constants";

export async function GET(req: Request) {
  const response = NextResponse.redirect(new URL("/login", req.url));

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
