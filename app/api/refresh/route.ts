import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/utilities/constants";
import { REFRESH_TOKEN_ENDPOINT, SERVER_URL } from "@/utilities/endpoints";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get(REFRESH_TOKEN)?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    const backendResponse = await fetch(SERVER_URL + REFRESH_TOKEN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: "Token refresh failed" },
        { status: 401 },
      );
    }

    const data = await backendResponse.json();
    const newAccessToken: string = data?.idToken;
    const newRefreshToken: string = data?.refreshToken;

    if (!newAccessToken || !newRefreshToken) {
      return NextResponse.json(
        { error: "Invalid refresh response" },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ idToken: newAccessToken });

    // httpOnly for security (client cannot access it)
    response.cookies.set({
      name: ACCESS_TOKEN,
      value: newAccessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    response.cookies.set({
      name: REFRESH_TOKEN,
      value: newRefreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Refresh failed" }, { status: 500 });
  }
}
