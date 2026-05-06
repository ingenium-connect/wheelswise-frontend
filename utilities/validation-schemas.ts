import { z } from "zod";

export const MAX_VEHICLE_VALUE = 10_000_000;
export const VEHICLE_VALUE_LIMIT_ERROR = `Vehicle value cannot exceed KES ${MAX_VEHICLE_VALUE.toLocaleString()}.`;

export const loginFormSchema = z.object({
  national_identifier: z
    .string()
    .min(1, "Please enter your ID or passport number.")
    .max(20),
  password: z.string().min(4, "Please enter a valid password.").max(20),
});

// temporary validators, TODO: add zod validators
export const validateEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const getVehicleValueLimitError = (value: number | string) => {
  const numericValue = typeof value === "string" ? Number(value) : value;

  if (!Number.isFinite(numericValue) || numericValue <= MAX_VEHICLE_VALUE) {
    return "";
  }

  return VEHICLE_VALUE_LIMIT_ERROR;
};
