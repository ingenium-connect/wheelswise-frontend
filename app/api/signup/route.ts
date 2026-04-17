import { NextResponse } from "next/server";
import { USER_REGISTRATION_ENDPOINT } from "@/utilities/endpoints";
import { postHandler } from "@/utilities/api";
import { ACCESS_TOKEN, REFRESH_TOKEN, USER_ID, NAME, EMAIL } from "@/utilities/constants";

export async function POST(req: Request) {
  try {
    const { userPayload } = await req.json();

    const userResponse = await postHandler(
      USER_REGISTRATION_ENDPOINT,
      false,
      userPayload,
    );

    const token = userResponse?.auth_credentials?.idToken;
    const refreshToken = userResponse?.auth_credentials?.refreshToken;
    if (!token) {
      return NextResponse.json(
        { error: "User registration failed: token missing" },
        { status: 400 },
      );
    }

    const response = NextResponse.json({
      user: userResponse,
    });

    // ACCESS_TOKEN: httpOnly for security (client cannot access it)
    response.cookies.set({
      name: ACCESS_TOKEN,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    // REFRESH_TOKEN: httpOnly for security
    response.cookies.set({
      name: REFRESH_TOKEN,
      value: refreshToken ?? "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    // Set user info cookies for client-side auth checks (not httpOnly so client can read)
    const cookieMaxAge = 60 * 60; // 1 hour
    const cookieOptions = {
      httpOnly: false, // Client needs to read these
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: cookieMaxAge,
    };

    if (userResponse?.id) {
      response.cookies.set({
        name: USER_ID,
        value: userResponse.id,
        ...cookieOptions,
      });
    }

    if (userResponse?.name) {
      response.cookies.set({
        name: NAME,
        value: encodeURIComponent(userResponse.name),
        ...cookieOptions,
      });
    }

    if (userResponse?.email) {
      response.cookies.set({
        name: EMAIL,
        value: encodeURIComponent(userResponse.email),
        ...cookieOptions,
      });
    }

    return response;
  } catch (error: unknown) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { error: (error as Error).message ?? "Signup failed" },
      { status: 500 },
    );
  }
}
