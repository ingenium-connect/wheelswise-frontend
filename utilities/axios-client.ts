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
      forceLogout();
    }
    return Promise.reject(error);
  },
);

/**
 * Clears cached client state and redirects to the server logout route.
 * The server route clears httpOnly auth cookies and sets a
 * `clear_client_state` cookie that <ClearClientState /> picks up to wipe
 * persisted Zustand stores on the next page render.
 */
function forceLogout() {
  if (typeof window === "undefined") return;
  try {
    // Wipe persisted Zustand stores and any ad-hoc auth-related keys.
    const keysToClear = [
      "motor-insurance-details",
      "vehicle-info-store",
      "personal-details-store",
      "user-profile-store",
      "payment_method_id",
      "policy_start_date",
      "vehicleRegistrationNumber",
    ];
    keysToClear.forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {
        // ignore quota / access errors
      }
    });
    try {
      sessionStorage.clear();
    } catch {
      // ignore
    }
  } finally {
    window.location.href = "/api/logout";
  }
}

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
      forceLogout();
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);

export { axiosClient, axiosAuthClient };
