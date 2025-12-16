"use server";

import { OtpPayload } from "@/types/data";
import { postHandler } from "@/utilities/api";
import { OTP_VERIFY_ENDPOINT } from "@/utilities/endpoints";

export async function otpAction(otpPayload: OtpPayload) {
  const response = await postHandler(
    OTP_VERIFY_ENDPOINT,
    false,
    otpPayload,
    "PATCH"
  );

  return response;
}
