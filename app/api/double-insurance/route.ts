import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN } from "@/utilities/constants";
import { SERVER_URL } from "@/utilities/endpoints";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN)?.value ?? "";
  const body = await request.json();

  try {
    const res = await fetch(`${SERVER_URL}/policy/double-insurance`, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to reach insurance check service" },
      { status: 502 },
    );
  }
}
