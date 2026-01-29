import { NextResponse } from "next/server";
import {
  REGISTER_VEHICLE_ENDPOINT,
  USER_REGISTRATION_ENDPOINT,
} from "@/utilities/endpoints";
import { handleRegisterVehicle, postHandler } from "@/utilities/api";
import { ACCESS_TOKEN } from "@/utilities/constants";

export async function POST(req: Request) {
  try {
    const { userPayload, vehiclePayload } = await req.json();

    const userResponse = await postHandler(
      USER_REGISTRATION_ENDPOINT,
      false,
      userPayload,
    );

    const token = userResponse?.auth_credentials?.idToken;
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

    response.cookies.set({
      name: ACCESS_TOKEN,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60, // 1 hour
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
