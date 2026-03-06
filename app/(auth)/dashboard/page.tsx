import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InsurancePolicy, UserProfile, Vehicle } from "@/types/data";
import { PolicyCard } from "@/components/policy/policy-card";
import { AccountCard } from "@/components/auth/profile-card";
import { VehicleCard } from "@/components/vehicle/vehicle-card";
import {
  PROFILE_ENDPOINT,
  USER_POLICIES_ENDPOINT,
  USER_VEHICLES_ENDPOINT,
} from "@/utilities/endpoints";
import { getData } from "@/utilities/api";
import { axiosServer } from "@/utilities/axios-server";
import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@/utilities/constants";
import DashboardBanner from "@/components/auth/dashboard-banner";
import StoreUserClient from "@/components/auth/StoreUserClient";
import { Car, FileText, Home, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Page() {
  let policies: InsurancePolicy[] | undefined = undefined;
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
    policies = policiesRes.status === "fulfilled" ? policiesRes.value : undefined;

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
          <Tabs defaultValue="home" className="w-full">
            <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:inline-flex bg-white border border-[#d7e8ee] shadow-sm rounded-xl mb-8 p-1 h-auto">
              <TabsTrigger
                value="home"
                className="flex items-center gap-1.5 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg py-2"
              >
                <Home className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Home</span>
              </TabsTrigger>
              <TabsTrigger
                value="vehicle"
                className="flex items-center gap-1.5 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg py-2"
              >
                <Car className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Vehicles</span>
                {(vehicles?.length ?? 0) > 0 && (
                  <span className="ml-1 bg-primary/20 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {vehicles?.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="policies"
                className="flex items-center gap-1.5 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg py-2"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Policies</span>
                {(policies?.length ?? 0) > 0 && (
                  <span className="ml-1 bg-primary/20 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {policies?.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="flex items-center gap-1.5 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg py-2"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
            </TabsList>

            {/* Home */}
            <TabsContent value="home">
              <DashboardBanner
                name={firstName}
                vehicleCount={vehicles?.length ?? 0}
                policyCount={policies?.length ?? 0}
              />
            </TabsContent>

            {/* Vehicles */}
            <TabsContent value="vehicle">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-[#1e3a5f]">
                    My Vehicles
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {vehicles?.length ?? 0} vehicle
                    {(vehicles?.length ?? 0) !== 1 ? "s" : ""} registered
                  </p>
                </div>
                <Button asChild className="text-white">
                  <Link href="/cover-type">+ Add Vehicle</Link>
                </Button>
              </div>

              {!Array.isArray(vehicles) || vehicles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="p-5 bg-primary/10 rounded-full mb-4">
                    <Car className="w-10 h-10 text-primary" />
                  </div>
                  <p className="font-medium text-[#1e3a5f] mb-1">
                    No vehicles yet
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add your first vehicle to get insured.
                  </p>
                  <Button asChild className="text-white">
                    <Link href="/cover-type">Get Started</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vehicles.map((vehicle: Vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Policies */}
            <TabsContent value="policies">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-[#1e3a5f]">
                    Insurance Policies
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {policies?.length ?? 0} active polic
                    {(policies?.length ?? 0) !== 1 ? "ies" : "y"}
                  </p>
                </div>
              </div>

              {!Array.isArray(policies) || policies.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="p-5 bg-primary/10 rounded-full mb-4">
                    <FileText className="w-10 h-10 text-primary" />
                  </div>
                  <p className="font-medium text-[#1e3a5f] mb-1">
                    No policies found
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Purchase a policy to protect your vehicle.
                  </p>
                  <Button asChild className="text-white">
                    <Link href="/cover-type">Get Insured</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {policies.map((policy) => (
                    <PolicyCard key={policy.id} policy={policy} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Profile */}
            {profile && (
              <TabsContent value="profile">
                <AccountCard user={profile} />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </>
  );
}
