/**
 * Server-side authentication helper utilities
 * These functions run ONLY on the server and handle token validation
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";
import { REFRESH_TOKEN_ENDPOINT, SERVER_URL } from "./endpoints";

/**
 * Checks if the current request has a valid authentication token
 * @returns The access token if present, null otherwise
 */
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN)?.value;
  return token || null;
}

/**
 * Verifies if the request is authenticated
 * @returns Object with auth status and token
 */
export async function verifyAuth(): Promise<{
  isAuthenticated: boolean;
  token: string | null;
}> {
  const token = await getAuthToken();
  return {
    isAuthenticated: Boolean(token),
    token,
  };
}

/**
 * Requires authentication - redirects to login if not authenticated
 * Use this in server components that require auth
 * @param redirectTo - Optional path to redirect to after login
 * @throws Redirects to login page if not authenticated
 */
export async function requireAuth(redirectTo?: string): Promise<string> {
  const { isAuthenticated, token } = await verifyAuth();

  if (!isAuthenticated || !token) {
    const loginUrl = redirectTo ? `/login?redirect=${redirectTo}` : "/login";
    redirect(loginUrl);
  }

  return token;
}

/**
 * Refreshes the access token using the refresh token
 * Updates both access and refresh token cookies
 * @returns New access token or null if refresh failed
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

    // Update cookies with new tokens
    cookieStore.set(ACCESS_TOKEN, newAccessToken, {
      httpOnly: true, // ✅ Now httpOnly for security
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60, // 15 minutes
    });

    cookieStore.set(REFRESH_TOKEN, newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return newAccessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return null;
  }
}

/**
 * Clears all authentication cookies
 * Use this during logout
 */
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();

  // Clear access token
  cookieStore.set(ACCESS_TOKEN, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  // Clear refresh token
  cookieStore.set(REFRESH_TOKEN, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Sets authentication cookies after successful login/signup
 * @param accessToken - The access token
 * @param refreshToken - The refresh token
 */
export async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN, accessToken, {
    httpOnly: true, // ✅ httpOnly for security
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60, // 15 minutes
  });

  cookieStore.set(REFRESH_TOKEN, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
}
