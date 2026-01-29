"use client";

import { useInsuranceStore } from "@/store/store";
import { useRouter } from "next/navigation";

export default function StepHeader() {
  const router = useRouter();
  // get step from local storage store
  const step = useInsuranceStore((state) => state.coverStep);
  const stepsHeaders = [
    "Step One: Choose a Motor Type",
    "Step Two: Enter Motor Vehicle Value",
    "Step Three: Choose a Motor Sub Type",
    "Step Four: Enter Vehicle Details",
    "Step Five: Enter personal details",
  ];
  const handleBack = () => {
    router.back();
  };
  return (
    <>
      {step > 0 && (
        <nav className="fixed top-0 left-0 right-0 text-white shadow-md z-50 bg-[#397397]">
          <div className="flex items-center justify-between px-4 md:px-16 h-16">
            <button
              onClick={handleBack}
              className="text-white hover:underline font-medium"
            >
              ← Go Back
            </button>
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-center">
              {stepsHeaders[step - 1]}
            </h1>
            <div className="w-24" />
          </div>
        </nav>
      )}
    </>
  );
}
