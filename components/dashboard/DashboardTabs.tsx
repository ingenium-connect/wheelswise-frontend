"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, FileText, Home, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  policyResponse,
  UserProfile,
  Vehicle,
} from "@/types/data";
import { PolicyCard } from "@/components/policy/policy-card";
import { AccountCard } from "@/components/auth/profile-card";
import { VehicleCard } from "@/components/vehicle/vehicle-card";
import DashboardBanner from "@/components/auth/dashboard-banner";

const VALID_TABS = ["home", "vehicle", "policies", "profile"] as const;
type Tab = (typeof VALID_TABS)[number];

type Props = {
  firstName: string;
  vehicles: Vehicle[] | undefined;
  policyPayload: policyResponse | undefined;
  profile: UserProfile | undefined;
  token: string;
};

export default function DashboardTabs({
  firstName,
  vehicles,
  policyPayload,
  profile,
  token,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paramTab = searchParams.get("tab") as Tab | null;
  const [activeTab, setActiveTab] = useState<Tab>(
    VALID_TABS.includes(paramTab as Tab) ? (paramTab as Tab) : "home",
  );

  // Sync tab when URL param changes (e.g. link from another page)
  useEffect(() => {
    if (paramTab && VALID_TABS.includes(paramTab as Tab)) {
      setActiveTab(paramTab as Tab);
    }
  }, [paramTab]);

  const handleTabChange = (value: string) => {
    const tab = value as Tab;
    setActiveTab(tab);
    router.replace(`/dashboard?tab=${tab}`, { scroll: false });
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
          {(policyPayload?.policies?.length ?? 0) > 0 && (
            <span className="ml-1 bg-primary/20 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {policyPayload?.policies?.length}
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
          policyCount={policyPayload?.policies?.length ?? 0}
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
            <Link href="/dashboard/add-vehicle">+ Add Vehicle</Link>
          </Button>
        </div>

        {!Array.isArray(vehicles) || vehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-5 bg-primary/10 rounded-full mb-4">
              <Car className="w-10 h-10 text-primary" />
            </div>
            <p className="font-medium text-[#1e3a5f] mb-1">No vehicles yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Add your first vehicle to get insured.
            </p>
            <Button asChild className="text-white">
              <Link href="/dashboard/add-vehicle">Get Started</Link>
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
              {policyPayload?.policies?.length ?? 0} polic
              {(policyPayload?.policies?.length ?? 0) !== 1 ? "ies" : "y"}
            </p>
          </div>
        </div>

        {!policyPayload?.policies?.length ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-5 bg-primary/10 rounded-full mb-4">
              <FileText className="w-10 h-10 text-primary" />
            </div>
            <p className="font-medium text-[#1e3a5f] mb-1">No policies found</p>
            <p className="text-sm text-muted-foreground mb-4">
              Purchase a policy to protect your vehicle.
            </p>
            <Button asChild className="text-white">
              <Link href="/cover-type">Get Insured</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {policyPayload?.policies?.map((policy) => (
              <PolicyCard key={policy.id} policy={policy} token={token} />
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
  );
}
