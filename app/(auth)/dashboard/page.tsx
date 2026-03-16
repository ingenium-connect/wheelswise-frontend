import {
  policyResponse,
  UserProfile,
  Vehicle,
} from "@/types/data";
import {
  PROFILE_ENDPOINT,
  USER_POLICIES_ENDPOINT,
  USER_VEHICLES_ENDPOINT,
} from "@/utilities/endpoints";
import { getData } from "@/utilities/api";
import { axiosServer } from "@/utilities/axios-server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@/utilities/constants";
import StoreUserClient from "@/components/auth/StoreUserClient";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import { Suspense } from "react";
import StorePersonalDetailsClient from "@/components/auth/StorePersonalDetailsClient";

import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Dashboard",
  robots: { index: false, follow: false },
};

export default async function Page() {
  let policies: policyResponse | undefined = undefined;
  let profile: UserProfile | undefined = undefined;
  let vehicles: Vehicle[] | undefined = undefined;

  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN)?.value ?? "";

  try {
    const results = await Promise.allSettled([
      getData(PROFILE_ENDPOINT),
      getData(`${USER_POLICIES_ENDPOINT}?page=1&page_size=10`),
      axiosServer.get(`${USER_VEHICLES_ENDPOINT}?page=1&page_size=10`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const [profileRes, policiesRes, vehiclesRes] = results;

    profile = profileRes.status === "fulfilled" ? profileRes.value : undefined;
    policies =
      policiesRes.status === "fulfilled" ? policiesRes.value : undefined;

    if (vehiclesRes.status === "fulfilled") {
      const data = vehiclesRes.value.data;
      vehicles = Array.isArray(data) ? data : undefined;
    }
  } catch (_err: unknown) {
    // silently handle fetch errors; pages gracefully show empty states
  }

  const firstName = profile?.name?.split(" ")[0] ?? "there";

  return (
    <>
      {profile && <StoreUserClient user={profile} />}
      {profile && <StorePersonalDetailsClient user={profile} />}

      {/* Page gradient header */}
      <div className="px-4 md:px-8 pt-6 pb-2 bg-[#f0f6f9]">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74] rounded-2xl px-6 md:px-10 py-8 shadow-lg">
          <p className="text-white/70 text-sm mb-1">Welcome back</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {profile?.name ?? "—"}
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Manage your vehicles and insurance policies
          </p>
        </div>
      </div>

      <div className="bg-[#f0f6f9] flex-1 px-4 md:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <Suspense>
            <DashboardTabs
              firstName={firstName}
              vehicles={vehicles}
              policyPayload={policies}
              profile={profile}
              token={token}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
}
