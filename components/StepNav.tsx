"use client";

import { useRouter, usePathname } from "next/navigation";

interface Step {
  path: string;
  label: string;
}

const steps: Step[] = [
  { path: "/date", label: "Select Policy Start Date" },
  { path: "/payment-summary", label: "Payment Summary" },
  { path: "/final-step", label: "Confirmation" },
];

const StepNav: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const currentStepIndex = steps.findIndex((step) => step.path === pathname);
  const stepNumber = currentStepIndex + 1;
  const totalSteps = steps.length;
  const stepLabel = steps[currentStepIndex]?.label || "Unknown Step";

  return (
    <div className="w-full sticky top-0 z-50 text-white text-lg font-semibold py-4 shadow-md px-4 bg-[#397397]">
      <div className="flex items-center justify-between">
        {/* Back button left */}
        <button
          onClick={() => router.back()}
          className="text-sm bg-white text-gray-700 px-3 py-1 rounded-lg shadow"
        >
          Back
        </button>

        {/* Centered step info */}
        <span className="flex-1 text-center">
          Step {stepNumber} of {totalSteps}: {stepLabel}
        </span>

        {/* Empty spacer to center the middle text */}
        <div className="w-[64px]"></div>
      </div>
    </div>
  );
};

export default StepNav;
