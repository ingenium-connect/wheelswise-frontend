import { NextResponse } from "next/server";
import {
  REGISTER_VEHICLE_ENDPOINT,
  USER_REGISTRATION_ENDPOINT,
} from "@/utilities/endpoints";
import { handleRegisterVehicle, postHandler } from "@/utilities/api";
import { setCookie } from "nookies";
import { ACCESS_TOKEN } from "@/utilities/constants";

export async function POST(req: Request) {
  try {
    const { userPayload, vehiclePayload } = await req.json();

    const userResponse = await postHandler(
      USER_REGISTRATION_ENDPOINT,
      false,
      userPayload
    );

    const token = userResponse?.auth_credentials?.idToken;
    if (!token) {
      return NextResponse.json(
        { error: "User registration failed: token missing" },
        { status: 400 }
      );
    }

    const vehicleResponse = await handleRegisterVehicle(
      REGISTER_VEHICLE_ENDPOINT,
      token,
      vehiclePayload
    );

    if (vehicleResponse) {
      setCookie(null, ACCESS_TOKEN, token, {
        maxAge: 60 * 60, // 1 hour
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    return NextResponse.json({
      user: userResponse,
      vehicle: vehicleResponse,
    });
  } catch (error: any) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { error: error.message ?? "Signup failed" },
      { status: 500 }
    );
  }
}
