export const SERVER_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// AUTH ENDPOINTS
export const LOGIN_ENDPOINT = "/users/login";

// USER ENDPOINTS

export const PROFILE_ENDPOINT = "/users/profile";
export const USER_POLICIES_ENDPOINT = "/users/policies";
export const USER_VEHICLES_ENDPOINT = "/users/vehicles";
export const RESET_PASSWORD_ENDPOINT = "/account/request";

// DATA ENDPOINTS
export const COVER_TYPES_ENDPOINT = "/cover-types";
export const MOTOR_TYPES_ENDPOINT = "/motor-type";
export const POLICY_ENDPOINT = "/policies";
export const PRODUCT_RATE_ENDPOINT = "/product-rate";
export const MOTOR_SUBTYPE_ENDPOINT = "/policies/products/subtype";

export const OTP_VERIFY_ENDPOINT = "/otp";
export const REGISTER_VEHICLE_ENDPOINT = "/vehicle/new";
export const USER_REGISTRATION_ENDPOINT = "/users/register";

export const POLICY_PAYMENT_ENDPOINT = "policy/new";
export const POLICY_UPDATE_ENDPOINT = "policy";
export const POLICY_PAYMENT_VERIFY_ENDPOINT = "payments/verify";

// SUPPORT ENDPOINTS
export const SUPPORT_REQUEST_ENDPOINT = "/support/request";

// POLICY ACTIONS
export const POLICY_COMPLETE_PURCHASE_ENDPOINT = "/policy/complete-purchase";
export const POLICY_DETAIL_ENDPOINT = "/policy";
export const ACCOUNT_RESET_ENDPOINT = "/account/reset";
