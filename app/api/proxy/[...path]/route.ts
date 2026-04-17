import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, refreshAccessToken } from "@/utilities/auth-helpers";
import { SERVER_URL } from "@/utilities/endpoints";

/**
 * API Proxy Route - Handles all authenticated client-side API requests
 *
 * This proxy:
 * 1. Extracts the access token from httpOnly cookies (client can't access it)
 * 2. Forwards the request to the backend with Bearer token
 * 3. Handles 401 responses by refreshing the token and retrying
 * 4. Returns the response to the client
 *
 * Usage from client:
 *   fetch('/api/proxy/users/profile') → proxies to {SERVER_URL}/users/profile
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return handleProxyRequest(request, "GET", params);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return handleProxyRequest(request, "POST", params);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return handleProxyRequest(request, "PUT", params);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return handleProxyRequest(request, "PATCH", params);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return handleProxyRequest(request, "DELETE", params);
}

async function handleProxyRequest(
  request: NextRequest,
  method: string,
  params: Promise<{ path: string[] }>,
) {
  try {
    const { path } = await params;
    const targetPath = path.join("/");

    // Get auth token from httpOnly cookie
    let token = await getAuthToken();

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token" },
        { status: 401 },
      );
    }

    // Build target URL
    // Ensure base ends with "/" so relative path resolution keeps all segments
    // e.g. new URL("payment-method", "https://host/api/v1/") → "https://host/api/v1/payment-method"
    // Without the trailing slash, new URL() strips the last base segment (standard URL resolution)
    const baseUrl = SERVER_URL!.endsWith("/") ? SERVER_URL! : `${SERVER_URL}/`;
    const url = new URL(targetPath, baseUrl);

    // Forward query parameters
    const searchParams = request.nextUrl.searchParams;
    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    // Prepare headers
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    // Forward specific headers if needed
    const forwardHeaders = ["accept", "accept-language"];
    forwardHeaders.forEach((header) => {
      const value = request.headers.get(header);
      if (value) headers[header] = value;
    });

    // Prepare request body for non-GET requests
    let body: string | undefined;
    if (method !== "GET" && method !== "HEAD") {
      try {
        const requestBody = await request.json();
        body = JSON.stringify(requestBody);
      } catch {
        // No body or invalid JSON
        body = undefined;
      }
    }

    // Make the request to backend
    let response = await fetch(url.toString(), {
      method,
      headers,
      body,
      cache: "no-store",
    });

    // Handle 401 - try to refresh token and retry once
    if (response.status === 401) {
      const newToken = await refreshAccessToken();

      if (newToken) {
        // Retry with new token
        headers.Authorization = `Bearer ${newToken}`;
        response = await fetch(url.toString(), {
          method,
          headers,
          body,
          cache: "no-store",
        });
      } else {
        // Refresh failed - return 401
        return NextResponse.json(
          { error: "Unauthorized - Token refresh failed" },
          { status: 401 },
        );
      }
    }

    // Parse response
    const contentType = response.headers.get("content-type");
    let responseData;

    if (contentType?.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    // Return response with same status code
    return NextResponse.json(responseData, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      {
        error: "Proxy request failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
