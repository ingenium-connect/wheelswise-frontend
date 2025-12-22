"use server";

import { UserPayload, vehiclePayload } from "@/types/data";
import { postHandler, handleRegisterVehicle } from "@/utilities/api";
import { REGISTER_VEHICLE_ENDPOINT, USER_REGISTRATION_ENDPOINT } from "@/utilities/endpoints";

export async function signupAction({
  userPayload,
  vehiclePayload,
}: {
  userPayload: UserPayload;
  vehiclePayload: vehiclePayload;
}) {
  const response = await postHandler(
    USER_REGISTRATION_ENDPOINT,
    false,
    userPayload
  );

  const token = response?.auth_credentials?.idToken;

  if (!token) {
    throw new Error("User registration failed: token missing");
  }

  const vehicleResponse = await handleRegisterVehicle(
    REGISTER_VEHICLE_ENDPOINT,
    token,
    vehiclePayload
  );

  return {
    user: response,
    vehicle: vehicleResponse,
  };
}
