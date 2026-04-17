import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN } from "@/utilities/constants";

/**
 * GET /api/auth/check
 * Reads the httpOnly access token cookie (invisible to client JS) and
 * returns whether the current session is authenticated.
 * Used by AuthContext to reliably gate the nav Dashboard/Profile actions.
 */
export async function GET(req: NextRequest) {
  const token = req.cookies.get(ACCESS_TOKEN)?.value;
  return NextResponse.json({ authenticated: Boolean(token) });
}
