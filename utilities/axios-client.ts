import axios from "axios";
import { parseCookies } from "nookies";
import { ACCESS_TOKEN } from "./constants";

/**
 * axios instance for client components (public/unauthenticated requests)
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
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

/**
 * Pending requests waiting for a token refresh to complete
 */
type RefreshCallback = (token: string) => void;
let isRefreshing = false;
let pendingQueue: RefreshCallback[] = [];

function processQueue(newToken: string) {
  pendingQueue.forEach((cb) => cb(newToken));
  pendingQueue = [];
}

/**
 * axios instance for authenticated client components.
 * Automatically injects the Authorization header and handles 401 by refreshing the token.
 */
const axiosAuthClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Inject the current access token before every request
axiosAuthClient.interceptors.request.use((config) => {
  const token = parseCookies()[ACCESS_TOKEN];
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401: refresh token then retry; if refresh fails, redirect to login
axiosAuthClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retried) {
      return Promise.reject(error);
    }

    original._retried = true;

    if (isRefreshing) {
      // Queue this request until the ongoing refresh completes
      return new Promise((resolve) => {
        pendingQueue.push((newToken) => {
          original.headers.Authorization = `Bearer ${newToken}`;
          resolve(axiosAuthClient(original));
        });
      });
    }

    isRefreshing = true;

    try {
      const { data } = await axios.post<{ idToken: string }>(
        "/api/refresh",
        {},
        { withCredentials: true },
      );

      const newToken = data.idToken;
      processQueue(newToken);

      original.headers.Authorization = `Bearer ${newToken}`;
      return axiosAuthClient(original);
    } catch {
      pendingQueue = [];
      window.location.href = "/login";
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);

export { axiosClient, axiosAuthClient };
