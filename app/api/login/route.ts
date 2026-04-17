import { NextRequest, NextResponse } from "next/server";
import { LOGIN_ENDPOINT, SERVER_URL } from "@/utilities/endpoints";
import { ACCESS_TOKEN, REFRESH_TOKEN, EMAIL, NAME, USER_ID } from "@/utilities/constants";

/**
 * Login API Route - Handles login and sets httpOnly cookies
 * This ensures the access token is stored securely and cannot be accessed by client JavaScript
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { national_identifier, password, user_type } = body;

    // Call backend login endpoint
    const response = await fetch(SERVER_URL + LOGIN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        national_identifier,
        password,
        user_type,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || data.message || "Login failed" },
        { status: response.status },
      );
    }

    // Return user data without setting cookies if OTP not verified or account inactive
    if (!data.id) {
      return NextResponse.json(data);
    }

    const otpVerified = data.otp_verified === true;
    const isActive = data.is_active === true;

    // If OTP not verified or account inactive, return data without setting cookies
    if (!otpVerified || !isActive) {
      return NextResponse.json(data);
    }

    // Extract tokens
    const accessToken = data.auth_credentials?.idToken;
    const refreshToken = data.auth_credentials?.refreshToken;

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { error: "Authentication tokens missing" },
        { status: 400 },
      );
    }

    // Create response with user data
    const jsonResponse = NextResponse.json(data);

    // Set httpOnly cookies for tokens
    jsonResponse.cookies.set({
      name: ACCESS_TOKEN,
      value: accessToken,
      httpOnly: true, // Secure - cannot be accessed by JavaScript
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60, // 15 minutes
    });

    jsonResponse.cookies.set({
      name: REFRESH_TOKEN,
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    // Set non-sensitive user data as non-httpOnly cookies for client access
    jsonResponse.cookies.set({
      name: USER_ID,
      value: data.id,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    jsonResponse.cookies.set({
      name: EMAIL,
      value: data.email || "",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    jsonResponse.cookies.set({
      name: NAME,
      value: data.name || "",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    return jsonResponse;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Login request failed" },
      { status: 500 },
    );
  }
}
