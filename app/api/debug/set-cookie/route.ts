import { NextResponse } from "next/server";
import { ACCESS_TOKEN } from "@/utilities/constants";

export async function GET() {
  const res = NextResponse.json({ ok: true, note: "Setting test cookie" });

  // For local development we set secure=false; change for production
  res.cookies.set({
    name: ACCESS_TOKEN,
    value: "test-server-token-123",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hour
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}

export const runtime = "edge";
