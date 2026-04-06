"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

export function InsureVehicleButton({
  registrationNumber,
}: {
  registrationNumber: string;
}) {
  const router = useRouter();

  const handleClick = () => {
    localStorage.setItem("vehicleRegistrationNumber", registrationNumber);
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
