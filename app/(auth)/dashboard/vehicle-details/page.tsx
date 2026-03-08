import FlowStepHeader from "@/components/layout/FlowStepHeader";
import DashboardVehicleDetails from "@/components/dashboard/DashboardVehicleDetails";
import { axiosServer } from "@/utilities/axios-server";

export const dynamic = "force-dynamic";

export default async function DashboardVehicleDetailsPage() {
  const makeModelMapResponse = await axiosServer.get("/vehicle/make-model-map");

  return (
    <>
      <FlowStepHeader
        title="Vehicle Details"
        subtitle="Review and complete your vehicle information."
      />
      <div className="bg-[#f0f6f9] flex-1 px-4 md:px-8 py-8">
        <DashboardVehicleDetails modelMakeMap={makeModelMapResponse.data} />
      </div>
    </>
  );
}
