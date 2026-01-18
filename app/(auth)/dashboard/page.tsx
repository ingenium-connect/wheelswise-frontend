import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/vehicle/vehicle-card";
import { InsurancePolicy, UserProfile, Vehicle } from "@/types/data";
import { PolicyCard } from "@/components/policy/policy-card";
import { AccountCard } from "@/components/auth/profile-card";
import { isAxiosError } from "axios";
import {
  PROFILE_ENDPOINT,
  USER_POLICIES_ENDPOINT,
  USER_VEHICLES_ENDPOINT,
} from "@/utilities/endpoints";

import { getData } from "@/utilities/api";
import DashboardBanner from "@/components/auth/dashboard-banner";

export const dynamic = "force-dynamic";

export default async function Page() {
  let policies: InsurancePolicy[] | undefined = undefined;
  let profile: UserProfile | undefined = undefined;
  let vehicles: Vehicle[] | undefined = undefined;

  let errorMsg: string = "Failed to load data.";

  try {
    const results = await Promise.allSettled([
      getData(PROFILE_ENDPOINT),
      getData(`${USER_POLICIES_ENDPOINT}?page=1&page_size=10`),
      getData(`${USER_VEHICLES_ENDPOINT}?page=1&page_size=10`),
    ]);

    const [profileRes, policiesRes, vehiclesRes] = results.map((res) =>
      res.status === "fulfilled" ? res?.value : null,
    );

    profile = profileRes;
    policies = policiesRes;
    vehicles = vehiclesRes;
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      if (err?.response?.status === 404) {
        errorMsg = "Page not found";
      }
    }
  }

  return (
    <>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <h1 className="text-4xl font-bold text-center mb-12 text-foreground tracking-wide">
            Welcome
          </h1>

          <div className="gap-6 mb-8">
            <Card className="border border-border bg-card">
              <CardContent>
                <Tabs defaultValue="home" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-4 bg-muted">
                    <TabsTrigger value="home" className="text-xs">
                      Home
                    </TabsTrigger>
                    <TabsTrigger value="vehicle" className="text-xs">
                      Vehicle
                    </TabsTrigger>
                    <TabsTrigger value="policies" className="text-xs">
                      Policies
                    </TabsTrigger>
                    <TabsTrigger value="profile" className="text-xs">
                      Profile
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="home" className="space-y-4">
                    <DashboardBanner
                      name={profile?.name ?? "-"}
                      vehicleCount={vehicles?.length ?? 0}
                      policyCount={policies?.length ?? 0}
                    />
                  </TabsContent>

                  <TabsContent value="vehicle">
                    <section className="min-h-screen px-6 py-8 text-black">
                      <div className="flex items-center justify-between mb-8">
                        <h1 className="text-xl font-semibold tracking-wide">
                          {`${profile?.name}'s Vehicles`}
                        </h1>

                        <Button
                          variant="outline"
                          className="border-black text-black hover:bg-white/10"
                        >
                          Add Vehicle
                        </Button>
                      </div>

                      {/* Grid */}
                      {!Array.isArray(vehicles) || vehicles?.length === 0 ? (
                        <p className="text-center text-gray-500">
                          No vehicles found. Please add a vehicle.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
                          {(vehicles ?? []).map((vehicle: Vehicle) => (
                            <VehicleCard key={vehicle.id} vehicle={vehicle} />
                          ))}
                        </div>
                      )}
                    </section>
                  </TabsContent>

                  <TabsContent value="policies">
                    <section className="min-h-screen px-6 py-8 text-black">
                      <h1 className="mb-6 text-xl font-semibold tracking-wide">
                        Insurance Policies
                      </h1>

                      {!Array.isArray(policies) || policies?.length === 0 ? (
                        <p className="text-center text-gray-500">
                          No policies found. Please add a policy.
                        </p>
                      ) : (
                        <div className="space-y-6 max-w-6xl">
                          {(policies ?? []).map((policy) => (
                            <PolicyCard key={policy.id} policy={policy} />
                          ))}
                        </div>
                      )}
                    </section>
                  </TabsContent>

                  {profile && (
                    <TabsContent value="profile">
                      <AccountCard user={profile} />
                    </TabsContent>
                  )}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
