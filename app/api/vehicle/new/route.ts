import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@/utilities/constants";
import { REGISTER_VEHICLE_ENDPOINT, SERVER_URL } from "@/utilities/endpoints";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ACCESS_TOKEN)?.value ?? "";

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await req.json();

    const response = await fetch(`${SERVER_URL}${REGISTER_VEHICLE_ENDPOINT}`, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error ?? "Failed to add vehicle" },
        { status: response.status },
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message ?? "Internal server error" },
      { status: 500 },
    );
  }
}
