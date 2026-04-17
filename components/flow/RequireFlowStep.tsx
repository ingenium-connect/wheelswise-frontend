"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useInsuranceStore } from "@/stores/insuranceStore";
import { Loader2 } from "lucide-react";

interface RequireFlowStepProps {
  children: ReactNode;
  requiredStep: number;
  productType?: "COMPREHENSIVE" | "THIRD_PARTY";
}

/**
 * RequireFlowStep - Validates user has completed previous steps
 *
 * Prevents users from skipping steps in the insurance purchase flow
 * by checking the coverStep state and redirecting if needed.
 *
 * Usage:
 * ```tsx
 * <RequireFlowStep requiredStep={3}>
 *   <VehicleDetailsForm />
 * </RequireFlowStep>
 * ```
 */
export function RequireFlowStep({
  children,
  requiredStep,
  productType,
}: RequireFlowStepProps) {
  const router = useRouter();
  const { coverStep, cover } = useInsuranceStore();

  useEffect(() => {
    // If no cover type selected, redirect to start
    if (!cover) {
      router.push("/cover-type");
      return;
    }

    // If user hasn't reached this step yet, redirect to current step
    if (coverStep < requiredStep) {
      // Redirect to the appropriate step based on cover step
      const redirectMap: Record<number, string> = {
        0: "/cover-type",
        1: `/motor-type/${cover}`,
        2: "/vehicle-value",
        3: "/motor-subtype",
        4: "/vehicle-details",
        5: "/personal-details",
      };

      const redirectPath = redirectMap[coverStep] || "/cover-type";
      router.push(redirectPath);
    }
  }, [coverStep, cover, requiredStep, router]);

  // Show loading while checking
  if (!cover || coverStep < requiredStep) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Validating flow...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
