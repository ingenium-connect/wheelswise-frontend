import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN, REFRESH_TOKEN, USER_ID, NAME, EMAIL } from "@/utilities/constants";
import { OTP_VERIFY_ENDPOINT, SERVER_URL } from "@/utilities/endpoints";

/**
 * PATCH /api/otp-verify
 *
 * Forwards the OTP verification request to the backend.
 * If the backend returns auth_credentials (i.e. this is the signup OTP flow),
 * we set all auth + identity cookies here — exactly like /api/login does —
 * so the client immediately has a valid session after verification.
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(SERVER_URL + OTP_VERIFY_ENDPOINT, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    const jsonResponse = NextResponse.json(data);

    // If the backend returned tokens (signup OTP flow), set auth cookies now.
    // The login flow already has cookies from /api/login; this handles signup.
    const accessToken = data.auth_credentials?.idToken;
    const refreshToken = data.auth_credentials?.refreshToken;

    if (accessToken) {
      jsonResponse.cookies.set({
        name: ACCESS_TOKEN,
        value: accessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60,
      });
    }

    if (refreshToken) {
      jsonResponse.cookies.set({
        name: REFRESH_TOKEN,
        value: refreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
      });
    }

    // Set non-sensitive identity cookies so AuthContext can read them client-side
    const cookieMaxAge = 60 * 60; // 1 hour
    const cookieBase = {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: cookieMaxAge,
    };

    if (data.id) {
      jsonResponse.cookies.set({ name: USER_ID, value: data.id, ...cookieBase });
    }
    if (data.name) {
      jsonResponse.cookies.set({ name: NAME, value: encodeURIComponent(data.name), ...cookieBase });
    }
    if (data.email) {
      jsonResponse.cookies.set({ name: EMAIL, value: encodeURIComponent(data.email), ...cookieBase });
    }

    return jsonResponse;
  } catch (error) {
    console.error("OTP verify error:", error);
    return NextResponse.json(
      { error: "OTP verification request failed" },
      { status: 500 },
    );
  }
}
