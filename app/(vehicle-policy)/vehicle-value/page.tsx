import FlowStepHeader from "@/components/layout/FlowStepHeader";
import VehicleValue from "@/components/value/VehicleValue";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enter Vehicle Value",
  robots: { index: false, follow: true },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ product_type?: string; motor_type?: string }>;
}) {
  const params = await searchParams;
  const product_type = params?.product_type || "COMPREHENSIVE";
  const motor_type = params?.motor_type || "PRIVATE";

  return (
    <>
      <FlowStepHeader
        step={2}
        totalSteps={5}
        title="Vehicle Value"
        subtitle="Enter your vehicle's current market value."
      />
      <div className="bg-[#f0f6f9] flex-1 px-4 md:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <VehicleValue product_type={product_type} motor_type={motor_type} />
        </div>
      </div>
    </>
  );
}
