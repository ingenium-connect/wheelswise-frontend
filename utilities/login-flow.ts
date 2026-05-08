import { setCookie } from "nookies";

import type { KycVerificationStatus } from "@/types/data";

import {
  ACCESS_TOKEN,
  EMAIL,
  KYC_STATUS,
  NAME,
  REFRESH_TOKEN,
  USER_ID,
} from "./constants";

export const LOGIN_NATIONAL_ID_STORAGE_KEY = "__login_national_id__";
const PENDING_LOGIN_STORAGE_KEY = "__pending_login_session__";

type LoginApiSuccessResponse = {
  id: string;
  email?: string | null;
  name?: string | null;
  kyc_documents_verification_status?: KycVerificationStatus | null;
  auth_credentials?: {
    idToken?: string | null;
    refreshToken?: string | null;
  };
};

export type PendingLoginSession = {
  nationalId: string;
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
  name: string;
  kycStatus: string;
};

export function createPendingLoginSession(
  response: LoginApiSuccessResponse,
  nationalId: string,
): PendingLoginSession | null {
  const accessToken = response.auth_credentials?.idToken;

  if (!response.id || !accessToken) {
    return null;
  }

  return {
    nationalId,
    accessToken,
    refreshToken: response.auth_credentials?.refreshToken ?? "",
    userId: response.id,
    email: response.email ?? "",
    name: response.name ?? "",
    kycStatus: response.kyc_documents_verification_status ?? "",
  };
}

export function stagePendingLogin(session: PendingLoginSession) {
  if (typeof window === "undefined") return;

  sessionStorage.setItem(PENDING_LOGIN_STORAGE_KEY, JSON.stringify(session));
  storeLoginNationalId(session.nationalId);
}

export function storeLoginNationalId(nationalId: string) {
  if (typeof window === "undefined") return;

  sessionStorage.setItem(LOGIN_NATIONAL_ID_STORAGE_KEY, nationalId);
}

export function getLoginNationalId() {
  if (typeof window === "undefined") return "";

  return sessionStorage.getItem(LOGIN_NATIONAL_ID_STORAGE_KEY) ?? "";
}

export function clearLoginFlowState() {
  if (typeof window === "undefined") return;

  sessionStorage.removeItem(PENDING_LOGIN_STORAGE_KEY);
  sessionStorage.removeItem(LOGIN_NATIONAL_ID_STORAGE_KEY);
}

export function readPendingLoginSession(): PendingLoginSession | null {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem(PENDING_LOGIN_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as PendingLoginSession;
  } catch (error) {
    console.error("Failed to parse pending login session", error);
    clearLoginFlowState();
    return null;
  }
}

export function finalizePendingLogin() {
  const session = readPendingLoginSession();
  if (!session) return false;

  const userData = {
    [ACCESS_TOKEN]: session.accessToken,
    [REFRESH_TOKEN]: session.refreshToken,
    [USER_ID]: session.userId,
    [EMAIL]: session.email,
    [NAME]: session.name,
    [KYC_STATUS]: session.kycStatus,
  };

  Object.entries(userData).forEach(([key, value]) =>
    setCookie(null, key, value, {
      maxAge: key === REFRESH_TOKEN ? 30 * 24 * 60 * 60 : 60 * 60,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    }),
  );

  window.dispatchEvent(new Event("auth:changed"));
  clearLoginFlowState();

  return true;
}
