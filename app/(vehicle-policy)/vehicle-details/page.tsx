import FlowStepHeader from "@/components/layout/FlowStepHeader";
import VehicleDetails from "@/components/VehicleDetails";
import { axiosServer } from "@/utilities/axios-server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enter Vehicle Details",
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

  const step = product_type === "COMPREHENSIVE" ? 4 : 3;
  const totalSteps = product_type === "COMPREHENSIVE" ? 5 : 4;

  const makeModelMapResponse = await axiosServer.get("/vehicle/make-model-map");

  return (
    <>
      <FlowStepHeader
        step={step}
        totalSteps={totalSteps}
        title="Vehicle Details"
        subtitle="Search by registration or enter your vehicle details manually."
      />
      <div className="bg-[#f0f6f9] flex-1 px-4 md:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <VehicleDetails
            modelMakeMap={makeModelMapResponse.data}
            product_type={product_type}
            motor_type={motor_type}
          />
        </div>
      </div>
    </>
  );
}
