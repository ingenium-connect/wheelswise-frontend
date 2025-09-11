import Footer from "@/components/layout/Footer";
import VehicleValue from "@/components/value/VehicleValue";

export default function Value() {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-[#edf4f7] to-[#f4f9fb]">
        <VehicleValue />
        <div className="mt-10">
          <Footer />
        </div>{" "}
      </div>
    </>
  );
}
