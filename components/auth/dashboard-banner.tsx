import React from "react";

type Props = {
  name: string;
  vehicleCount: number;
  policyCount: number;
};
const DashboardBanner = ({ name, vehicleCount, policyCount }: Props) => {
  return (
    <>
      <div className="border border-border rounded-lg p-4 bg-background/50">
        <p className="text-sm text-foreground mb-3">Welcome back, {name}</p>
        <p className="text-xs text-muted-foreground mb-4">
          Manage your vehicles and insurance policies all in one place.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="border border-border rounded p-2 text-center">
          <p className="text-xs text-muted-foreground">Total Vehicles</p>
          <p className="text-sm font-semibold text-foreground mt-1">
            {vehicleCount}
          </p>
        </div>
        <div className="border border-border rounded p-2 text-center">
          <p className="text-xs text-muted-foreground">Active Policies</p>
          <p className="text-sm font-semibold text-foreground mt-1">
            {policyCount}
          </p>
        </div>
        <div className="border border-border rounded p-2 text-center">
          <p className="text-xs text-muted-foreground">Expiring Soon</p>
          <p className="text-sm font-semibold text-foreground mt-1">1</p>
        </div>
      </div>
      <div className="space-y-2 border border-border rounded-lg p-4 bg-background/50">
        <p className="text-xs font-semibold text-foreground">Quick Actions</p>
        <div className="flex gap-2">
          <button className="text-xs border border-border rounded px-3 py-1.5 text-foreground hover:bg-muted transition">
            Add New Vehicle
          </button>
          <button className="text-xs border border-border rounded px-3 py-1.5 text-foreground hover:bg-muted transition">
            View All Policies
          </button>
        </div>
      </div>
    </>
  );
};

export default DashboardBanner;
