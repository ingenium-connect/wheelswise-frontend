/**
 * Client-side axios instances
 *
 * IMPORTANT: With httpOnly tokens, client-side code cannot access the access token.
 * All authenticated requests MUST go through /api/proxy/* which adds the token server-side.
 *
 * Use the api-proxy.ts helpers instead of these axios instances for authenticated requests.
 */

import axios from "axios";

/**
 * axios instance for client components (public/unauthenticated requests only)
 * For authenticated requests, use the proxy helpers from utilities/api-proxy.ts
 */
const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to logout which will clear cookies and redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/api/logout";
      }
    }
    return Promise.reject(error);
  },
);

/**
 * @deprecated Use api-proxy.ts helpers instead for authenticated requests
 * This instance is kept for backwards compatibility but should not be used
 * for new code with httpOnly tokens.
 */
const axiosAuthClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosAuthClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to logout
      if (typeof window !== "undefined") {
        window.location.href = "/api/logout";
      }
    }
    return Promise.reject(error);
  },
);

export { axiosClient, axiosAuthClient };
