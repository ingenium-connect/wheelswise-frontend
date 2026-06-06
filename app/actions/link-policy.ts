"use server";

import { LinkPolicyPayload } from "@/types/data";
import { LINK_POLICY_ENDPOINT, SERVER_URL } from "@/utilities/endpoints";
import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@/utilities/constants";
import { revalidatePath } from "next/cache";

export async function linkPolicyAction(payload: LinkPolicyPayload) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN)?.value ?? "";

  const url = SERVER_URL + LINK_POLICY_ENDPOINT;
  const response = await fetch(url, {
    method: "POST",
    cache: "no-cache",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || `Failed to link policy: ${response.status}`);
  }

  // Revalidate the dashboard page to fetch fresh policies data
  revalidatePath("/dashboard");

  return data;
}
