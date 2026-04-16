import MotorSubtype from "@/components/motor-type/MotorSubType";
import FlowStepHeader from "@/components/layout/FlowStepHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Select Insurance Plan",
  robots: { index: false, follow: true },
};

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ motor_type?: string; product_type: string }>;
}) {
  const params = await searchParams;
  const motor_type = params?.motor_type || "PRIVATE";
  const product_type = params.product_type || "COMPREHENSIVE";

  const step = product_type === "COMPREHENSIVE" ? 3 : 2;
  const totalSteps = product_type === "COMPREHENSIVE" ? 5 : 4;

  return (
    <>
      <FlowStepHeader
        step={step}
        totalSteps={totalSteps}
        title="Choose Your Plan"
        subtitle="Select an underwriter plan that fits your budget."
      />
      <div className="bg-[#f0f6f9] flex-1 px-4 md:px-8 py-8">
        <div className="max-w-6xl">
          <MotorSubtype product_type={product_type} motor_type={motor_type} />
        </div>
      </div>
    </>
  );
}
