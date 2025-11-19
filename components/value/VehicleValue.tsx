"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useInsuranceStore } from "@/store/store";

const VehicleValue: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const selectedMotorType = useInsuranceStore((store) => store.motorType);
  const vehicleValue = useInsuranceStore((store) => store.vehicleValue);
  const setVehicleValue = useInsuranceStore((state) => state.setVehicleValue);
  const setCoverStep = useInsuranceStore((state) => state.setCoverStep);

  useEffect(() => {
    setCoverStep(2);
  }, []);

  const handleContinue = () => {
    let isValid = true;

    if (
      !vehicleValue ||
      isNaN(Number(vehicleValue)) ||
      Number(vehicleValue) <= 0
    ) {
      isValid = false;
      setError("Please enter a valid numeric value for your vehicle.");
    } 
    // else if (motor_type === "PSV" && (!seating_capacity || Number(seating_capacity) <= 0)) {
    //   isValid = false;
    //   setError("Please enter a valid seating capacity.");
    // } else if (
    //   motor_type === "COMMERCIAL" &&
    //   (!tonnage || Number(tonnage) <= 0)
    // ) {
    //   isValid = false;
    //   setError("Please enter a valid tonnage.");
    // }

    if (!isValid) return;

    setError("");

    router.push("/motor-subtype");
  };

  return (
    <>
      <div className="flex-grow flex justify-center items-center px-4">
        <div className="w-[384px] h-[192px] bg-white rounded-2xl shadow-md p-6 flex flex-col justify-center">
          {selectedMotorType && (
            <div className="text-center text-gray-700 text-sm mb-3">
              Selected: <strong>{selectedMotorType.name}</strong>
            </div>
          )}

          {/* Input Group */}
          <div className="flex flex-col items-center">
            <label className="text-sm text-gray-700 mb-2 font-medium">
              Enter your vehicle value
            </label>
            <input
              type="number"
              placeholder="e.g. 800000"
              defaultValue={vehicleValue}
              onChange={(e) => setVehicleValue(Number(e.target.value))}
              className="border rounded-lg px-4 py-2 w-full text-base focus:outline-none focus:ring-2 focus:ring-[#397397]"
            />
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}

            <button
              onClick={handleContinue}
              className="mt-4 bg-[#397397] hover:bg-[#2e5e74] text-white px-5 py-2 rounded-lg text-sm font-medium transition"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default VehicleValue;
