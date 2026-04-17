/**
 * Client-side API proxy helpers
 * All authenticated API calls from the client should use these functions
 * They route through /api/proxy/* which adds the httpOnly token server-side
 */

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ProxyRequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
}

/**
 * Makes an authenticated API request through the proxy
 * @param endpoint - The backend endpoint path (e.g., "users/profile")
 * @param options - Request options
 * @returns The response data
 */
export async function proxyRequest<T = unknown>(
  endpoint: string,
  options: ProxyRequestOptions = {},
): Promise<T> {
  const { method = "GET", body, headers = {}, params } = options;

  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith("/")
    ? endpoint.substring(1)
    : endpoint;

  // Build proxy URL
  let url = `/api/proxy/${cleanEndpoint}`;

  // Add query parameters
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include", // Include cookies
  };

  // Add body for non-GET requests
  if (body && method !== "GET") {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url, fetchOptions);

  // Handle errors
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ProxyError(
      errorData.error || `Request failed with status ${response.status}`,
      response.status,
      errorData,
    );
  }

  return response.json();
}

/**
 * GET request through proxy
 */
export async function proxyGet<T = unknown>(
  endpoint: string,
  params?: Record<string, string | number | boolean>,
): Promise<T> {
  return proxyRequest<T>(endpoint, { method: "GET", params });
}

/**
 * POST request through proxy
 */
export async function proxyPost<T = unknown>(
  endpoint: string,
  body?: unknown,
): Promise<T> {
  return proxyRequest<T>(endpoint, { method: "POST", body });
}

/**
 * PUT request through proxy
 */
export async function proxyPut<T = unknown>(
  endpoint: string,
  body?: unknown,
): Promise<T> {
  return proxyRequest<T>(endpoint, { method: "PUT", body });
}

/**
 * PATCH request through proxy
 */
export async function proxyPatch<T = unknown>(
  endpoint: string,
  body?: unknown,
): Promise<T> {
  return proxyRequest<T>(endpoint, { method: "PATCH", body });
}

/**
 * DELETE request through proxy
 */
export async function proxyDelete<T = unknown>(
  endpoint: string,
): Promise<T> {
  return proxyRequest<T>(endpoint, { method: "DELETE" });
}

/**
 * Custom error class for proxy requests
 */
export class ProxyError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = "ProxyError";
  }

  /**
   * Check if error is an authentication error (401)
   */
  isAuthError(): boolean {
    return this.status === 401;
  }

  /**
   * Check if error is a client error (4xx)
   */
  isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  /**
   * Check if error is a server error (5xx)
   */
  isServerError(): boolean {
    return this.status >= 500;
  }
}

/**
 * Type guard to check if error is a ProxyError
 */
export function isProxyError(error: unknown): error is ProxyError {
  return error instanceof ProxyError;
}
