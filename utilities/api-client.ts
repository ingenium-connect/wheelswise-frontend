"use server";

import { cookies } from "next/headers";

// Types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

export interface ApiOptions {
  requiresAuth?: boolean;
  cache?: RequestCache;
  method?: string;
  headers?: Record<string, string>;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
/**
 * handles authentication headers for endpoints that require authentication
 * @param requiresAuth whether the endpoint requres an authenticated user]
 * @returns headers object
 */
async function getAuthHeaders(
  requiresAuth: boolean
): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (requiresAuth) {
    const cookieStore = await cookies();
    const token = cookieStore.get("ACCESS_TOKEN")?.value;

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
}

/**
 * handles api response
 * @param response response from a fetch api call
 * @returns response data and status code
 */
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  let data;

  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (response.status === 401) {
    await handleUnauthorized();
  }

  if (!response.ok) {
    return {
      error: data?.message || `Request failed with status ${response.status}`,
      status: response.status,
    };
  }

  return {
    data,
    status: response.status,
  };
}

/**
 * handles 401 unauthorized api responses
 *
 */
async function handleUnauthorized(): Promise<void> {
  // Clear authentication cookies
  const cookieNames = ["ACCESS_TOKEN"];

  const cookieStore = await cookies();
  cookieNames.forEach((cookieName) => {});

  throw new Error("Unauthorized access");
}

/**
 * handles the fetch call
 * @param endpoint api endpoint string
 * @param options request headers options
 * @returns api response data
 */
async function request<T>(
  endpoint: string,
  options: ApiOptions = {},
  payload?: any
): Promise<ApiResponse<T>> {
  const {
    requiresAuth = true,
    cache = "no-cache",
    method = "GET",
    headers = {},
  } = options;

  try {
    const url = `${BASE_URL}${endpoint}`;
    const authHeaders = await getAuthHeaders(requiresAuth);

    const response = await fetch(url, {
      method,
      cache,
      credentials: "include",
      headers: {
        ...authHeaders,
        ...headers,
      },
      body: payload,
    });

    return await handleResponse<T>(response);
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);

    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
      status: 500,
    };
  }
}

/**
 * handles the GET api call
 * @param endpoint api endpoint string
 * @param requiresAuth whether the request requires authentication
 * @returns api response data
 */
async function retrieve<T>(
  endpoint: string,
  requiresAuth: boolean = true
): Promise<any> {
  return request<T>(endpoint, {
    requiresAuth,
    method: "GET",
  });
}

/**
 * handles the POST api call
 * @param endpoint api endpoint string
 * @param data request payload
 * @param requiresAuth whether the request requires authentication
 * @returns api response data
 */
async function create<T>(
  endpoint: string,
  data?: any,
  requiresAuth: boolean = true
): Promise<any> {
  return request<T>(
    endpoint,
    {
      requiresAuth,
      method: "POST",
      headers: data ? { "Content-Type": "application/json" } : {},
    },
    data ? JSON.stringify(data) : undefined
  );
}

/**
 * handles the PUT api call
 * @param endpoint api endpoint string
 * @param data request payload data
 * @param requiresAuth whether the endpoint requires authentication
 * @returns api response data
 */
async function update<T>(
  endpoint: string,
  data?: any,
  requiresAuth: boolean = true
): Promise<ApiResponse<T>> {
  return request<T>(
    endpoint,
    {
      requiresAuth,
      method: "PUT",
      headers: data ? { "Content-Type": "application/json" } : {},
    },
    data ? JSON.stringify(data) : undefined
  );
}

/**
 * handles the PATCH api call
 * @param endpoint api endpoint string
 * @param requiresAuth whether the endpoint requires authentication
 * @returns api response data
 */
async function updatePartial<T>(
  endpoint: string,
  data: any,
  requiresAuth: boolean = true
): Promise<ApiResponse<T>> {
  return request<T>(
    endpoint,
    {
      requiresAuth,
      method: "PATCH",
    },
    data ? JSON.stringify(data) : undefined
  );
}

/**
 * handles the DELETE api call
 * @param endpoint api endpoint string
 * @param requiresAuth whether the endpoint requires authentication
 * @returns api response data
 */
async function destroy<T>(
  endpoint: string,
  requiresAuth: boolean = true
): Promise<ApiResponse<T>> {
  return request<T>(endpoint, {
    requiresAuth,
    method: "DELETE",
  });
}

export { destroy, update, retrieve, updatePartial, create };
