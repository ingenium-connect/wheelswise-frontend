"use server";

import { cookies } from "next/headers";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";
import { REFRESH_TOKEN_ENDPOINT, SERVER_URL } from "./endpoints";

/**
 * Calls the backend refresh endpoint using the stored httpOnly refresh token cookie.
 * On success, updates both the ACCESS_TOKEN and REFRESH_TOKEN cookies.
 * Returns the new access token string, or null if refresh failed.
 */
export async function refreshAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN)?.value;

  if (!refreshToken) return null;

  try {
    const response = await fetch(SERVER_URL + REFRESH_TOKEN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const newAccessToken: string = data?.idToken;
    const newRefreshToken: string = data?.refreshToken;

    if (!newAccessToken || !newRefreshToken) return null;

    // ACCESS_TOKEN: non-httpOnly so client JS can read it for Authorization headers
    cookieStore.set(ACCESS_TOKEN, newAccessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    // REFRESH_TOKEN: httpOnly for security
    cookieStore.set(REFRESH_TOKEN, newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return newAccessToken;
  } catch {
    return null;
  }
}
