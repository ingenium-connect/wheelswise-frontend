import FlowStepHeader from "@/components/layout/FlowStepHeader";
import VehicleSearch from "@/components/dashboard/VehicleSearch";

export default function AddVehiclePage() {
  return (
    <>
      <FlowStepHeader
        title="Add Vehicle"
        subtitle="Search your vehicle by registration number to get started."
      />
      <div className="bg-[#f0f6f9] flex-1 px-4 md:px-8 py-8">
        <VehicleSearch />
      </div>
    </>
  );
}
