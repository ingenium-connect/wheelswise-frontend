"use server";

import { LoginPayload, PayloadT } from "@/types/data";
import { destroyCookie, parseCookies } from "nookies";

import { ACCESS_TOKEN, EMAIL, NAME, USER_ID } from "./constants";
import { LOGIN_ENDPOINT, SERVER_URL } from "./endpoints";
import { cookies } from "next/headers";

/**
 * Reusable function used to resolve data fetching promise and handle errors
 * @param url URL endpoint
 * @returns data fetch promise
 */
export const apiHandler = async (url: string, requiresAuth: boolean = true) => {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN)?.value ?? "";

  const authHeaderValue = requiresAuth ? `Bearer ${token}` : "";
  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-cache",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeaderValue,
      },
    });
    const data = await response.json();

    if (response.status === 401) {
      [ACCESS_TOKEN, USER_ID, EMAIL, NAME].forEach((cookie) =>
        destroyCookie(null, cookie)
      );
      throw new Error(
        `Failed to fetch data: ${response?.status} ${response?.statusText}`
      );
    }

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data: ${response?.status} ${response?.statusText}`
      );
    }

    return data;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Reusable function used to resolve data posting promise and handle errors
 * @param ENDPOINT URL endpoint
 * @returns data fetch promise
 */
export const postHandler = async (
  ENDPOINT: string,
  requiresAuth: boolean = true,
  payload: PayloadT,
  method: string = "POST"
) => {
  const token = parseCookies()[ACCESS_TOKEN];

  const authHeaderValue = requiresAuth ? `Bearer ${token}` : "";
  try {
    const url = SERVER_URL + ENDPOINT;

    const response = await fetch(url, {
      method: method,
      cache: "no-cache",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeaderValue,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();


    if (response.status === 401) {
      throw new Error(
        "Unauthorized access: You are not authorized to access this service."
      );
    }

    if (data?.error) {
      throw new Error(
        `Failed to fetch data: ${data?.error || "Unknown error occurred"}`
      );
    }

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data: ${response?.status} ${response?.statusText}`
      );
    }
    return data;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Function used to register a vehicle
 * @param ENDPOINT endpoint URL
 * @param token token string returned after user registration
 * @param payload vehicle registration payload
 * @returns data fetch promise
 */
export const handleRegisterVehicle = async (
  ENDPOINT: string,
  token: string,
  payload: PayloadT
) => {
  const authHeaderValue = `Bearer ${token}`;
  try {
    const url = SERVER_URL + ENDPOINT;

    const response = await fetch(url, {
      method: "POST",
      cache: "no-cache",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeaderValue,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (response.status === 401) {
      throw new Error(
        "Unauthorized access: You are not authorized to access this service."
      );
    }

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data: ${response?.status} ${response?.statusText}`
      );
    }
    return data;
  } catch (error: any) {
    throw error;
  }
};

/**
 * AUTH ENDPOINTS
 */
/**
 * @param national_identifier national identifier
 * @param password password
 * @param user_type user type
 * @returns login response
 */

export const loginSubmitHandler = async ({
  national_identifier,
  password,
  user_type,
}: LoginPayload) => {
  const response = await fetch(SERVER_URL + LOGIN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      national_identifier: national_identifier,
      password: password,
      user_type: user_type,
    }),
  })
    .then((resp) => resp.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err;
    });
  return response;
};

/**
 *
 * @returns list of specified data
 */
export const getData = async (
  ENDPOINT: string,
  requiresAuth: boolean = true
) => {
  try {
    const url = SERVER_URL + ENDPOINT;
    return await apiHandler(url, requiresAuth);
  } catch (error) {
    return { results: [] };
  }
};

/**
 *
 * @returns list of specified data to support react query data fetch
 */
export async function getDataRq<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

/**
 * Function that handles post requests
 * @returns post request response
 */
export const postData = async (
  ENDPOINT: string,
  payload: PayloadT,
  method: string = "POST"
) => {
  try {
    const requiresAuth = true;
    return await postHandler(ENDPOINT, requiresAuth, payload, method);
  } catch (error) {
    return {};
  }
};
