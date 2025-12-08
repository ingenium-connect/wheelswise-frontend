import { PageBreadCrumb } from "@/components/PageBreadCrumb";
import VehicleDetails from "@/components/VehicleDetails";
import { retrieve } from "@/utilities/api-client";

export const dynamic = "force-dynamic"; // Force dynamic rendering at page level

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ motor_type?: string; product_type: string }>;
}) {
  const params = await searchParams;
  const motor_type = params?.motor_type || "PRIVATE";
  const product_type = params.product_type || "COMPREHENSIVE";

  const pages = [
    { name: "Home", href: "/", isActive: false },
    { name: "Cover Type", href: "/cover-type", isActive: false },
    {
      name: "Motor Type",
      href: `/motor-type/${product_type}`,
      isActive: false,
    },
    ...(product_type === "COMPREHENSIVE"
      ? [
          {
            name: "Vehicle Value",
            href: `/motor-subtype?product_type=${product_type}&motor_type=${motor_type}`,
            isActive: false,
          },
        ]
      : []),
    {
      name: "Vehicle Details",
      href: "/vehicle-details",
      isActive: true,
    },
  ];

  const makeModelMapResponse = await retrieve("/vehicle/make-model-map", false);

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#d7e8ee] via-white to-[#e5f0f3] py-12 px-4">
      <PageBreadCrumb pages={pages} />
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold text-[#2e5e74]">Step Four</h2>
        <p className="text-muted-foreground mt-2">Enter Vehicle Details</p>
      </div>
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <VehicleDetails
            modelMakeMap={makeModelMapResponse.data}
            product_type={product_type}
            motor_type={motor_type}
          />
        </div>
      </div>
    </section>
  );
}
