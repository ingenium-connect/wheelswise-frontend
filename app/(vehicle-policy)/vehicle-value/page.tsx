import { PageBreadCrumb } from "@/components/PageBreadCrumb";
import VehicleValue from "@/components/value/VehicleValue";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ product_type?: string; motor_type?: string }>;
}) {
  const params = await searchParams;
  const product_type = params?.product_type || "COMPREHENSIVE";
  const motor_type = params?.motor_type || "PRIVATE";

  const pages = [
    { name: "Home", href: "/", isActive: false },
    { name: "Cover Type", href: "/cover-type", isActive: false },
    {
      name: "Motor Type",
      href: `/motor-type/${product_type}`,
      isActive: false,
    },
    { name: "Vehicle Value", href: "/vehicle-value", isActive: true },
  ];
  return (
    <>
      <section className="min-h-screen bg-gradient-to-br from-[#d7e8ee] via-white to-[#e5f0f3] py-12 px-4">
        <PageBreadCrumb pages={pages} />
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-[#2e5e74]">Step Two</h2>
          <p className="text-muted-foreground mt-2">
            Enter Motor Vehicle Value
          </p>
        </div>
        <VehicleValue product_type={product_type} motor_type={motor_type} />
      </section>
    </>
  );
}
