"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Vehicle } from "@/types/data";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Car, CheckCircle2, Eye, ShieldOff } from "lucide-react";
import Link from "next/link";

type Props = {
  vehicle: Vehicle;
};

export function VehicleCard({ vehicle }: Props) {
  const router = useRouter();

  const {
    make,
    model,
    registration_number,
    body_type,
    seating_capacity,
    tonnage,
    vehicle_value,
    year_of_manufacture,
    purpose,
    active_policy,
  } = vehicle;

  const isInsured = !!active_policy;

  const handleCarSelection = () => {
    // Store the selected date in localStorage
    localStorage.setItem("vehicleRegistrationNumber", registration_number);
    router.push("/cover-type");
  };

  return (
    <Card className="border border-[#d7e8ee] shadow-md hover:shadow-xl transition-shadow duration-200 rounded-2xl overflow-hidden">
      {/* Status bar */}
      <div
        className={`h-1.5 w-full ${isInsured ? "bg-emerald-500" : "bg-amber-400"}`}
      />

      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <Car className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-[#1e3a5f] leading-tight">
                {year_of_manufacture} {make} {model}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {registration_number}
              </p>
            </div>
          </div>

          {isInsured ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Insured
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full shrink-0">
              <ShieldOff className="w-3.5 h-3.5" />
              Uninsured
            </span>
          )}
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm border-t border-[#d7e8ee] pt-4 mb-5">
          <Detail label="Body Type" value={body_type} />
          <Detail
            label="Seating"
            value={seating_capacity ? `${seating_capacity} seats` : undefined}
          />
          {tonnage && <Detail label="Tonnage" value={`${tonnage} T`} />}
          {purpose && <Detail label="Purpose" value={purpose} />}
          <Detail
            label="Value"
            value={`KES ${vehicle_value.toLocaleString()}`}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/dashboard/vehicle/${encodeURIComponent(registration_number)}`}
            className="flex-1"
          >
            <Button variant="outline" className="w-full gap-1.5">
              <Eye className="w-4 h-4" />
              View
            </Button>
          </Link>
          {!isInsured && (
            <Button
              onClick={handleCarSelection}
              className="flex-1 text-white"
            >
              Insure this Vehicle
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">
        {label}
      </p>
      <p className="font-medium text-[#1e3a5f]">{value || "—"}</p>
    </div>
  );
}
