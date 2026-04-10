"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Vehicle } from "@/types/data";
import { useInsuranceStore } from "@/stores/insuranceStore";
import { useVehicleStore } from "@/stores/vehicleStore";

export function InsureVehicleButton({ vehicle }: { vehicle: Vehicle }) {
  const router = useRouter();
  const setInsuranceVehicleValue = useInsuranceStore((s) => s.setVehicleValue);
  const { setVehicleValue, setSeatingCapacity, setTonnage, setVehicleDetails } = useVehicleStore();

  const handleClick = () => {
    localStorage.setItem("vehicleRegistrationNumber", vehicle.registration_number);
    localStorage.setItem("insure_existing_vehicle", "true");

    // Pre-populate stores so vehicle-value and vehicle-details pages can be skipped
    setInsuranceVehicleValue(vehicle.vehicle_value);
    setVehicleValue(String(vehicle.vehicle_value));
    setSeatingCapacity(vehicle.seating_capacity ? String(vehicle.seating_capacity) : "");
    setTonnage(vehicle.tonnage ?? 0);
    setVehicleDetails({
      vehicleNumber: vehicle.registration_number,
      vehicleValue: vehicle.vehicle_value,
      chassisNumber: vehicle.chassis_number ?? "",
      make: vehicle.make ?? "",
      model: vehicle.model ?? "",
      year: String(vehicle.year_of_manufacture),
      bodyType: vehicle.body_type ?? "",
      vehiclePurpose: vehicle.purpose ?? "",
      engineCapacity: vehicle.engine_capacity ? String(vehicle.engine_capacity) : "",
      engineNumber: vehicle.engine_number ?? "",
    });

    router.push("/cover-type");
  };

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex-shrink-0 p-2 bg-amber-100 rounded-xl">
          <ShieldCheck className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <p className="font-semibold text-[#1e3a5f] text-sm">
            This vehicle is not insured
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Protect your vehicle with comprehensive or third-party insurance
            coverage.
          </p>
        </div>
      </div>
      <Button
        onClick={handleClick}
        className="text-white shrink-0 sm:ml-auto"
      >
        Insure this Vehicle
      </Button>
    </div>
  );
}
