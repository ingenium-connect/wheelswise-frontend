import { NextResponse } from "next/server";
import {
  REGISTER_VEHICLE_ENDPOINT,
  USER_REGISTRATION_ENDPOINT,
} from "@/utilities/endpoints";
import { handleRegisterVehicle, postHandler } from "@/utilities/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/utilities/constants";

export async function POST(req: Request) {
  try {
    const { userPayload, vehiclePayload } = await req.json();

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

    const vehicleResponse = await handleRegisterVehicle(
      REGISTER_VEHICLE_ENDPOINT,
      token,
      vehiclePayload,
    );

    const response = NextResponse.json({
      user: userResponse,
      vehicle: vehicleResponse,
    });

    // ACCESS_TOKEN: non-httpOnly so client JS can read it for Authorization headers
    response.cookies.set({
      name: ACCESS_TOKEN,
      value: token,
      httpOnly: false,
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

    return response;
  } catch (error: unknown) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { error: (error as Error).message ?? "Signup failed" },
      { status: 500 },
    );
  }
}
