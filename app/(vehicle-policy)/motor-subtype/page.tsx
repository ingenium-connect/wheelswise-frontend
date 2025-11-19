import MotorSubtype from "@/components/motor-type/MotorSubType";
import { PageBreadCrumb } from "@/components/PageBreadCrumb";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: { product_type?: string; motor_type?: string };
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
    ...(product_type === "COMPREHENSIVE"
      ? [
          {
            name: "Vehicle Value",
            href: `/vehicle-value?product_type=${product_type}&motor_type=${motor_type}`,
            isActive: false,
          },
        ]
      : []),
    { name: "Motor Subtype", href: "/vehicle-value", isActive: true },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#d7e8ee] via-white to-[#e5f0f3] py-12 px-4">
      <PageBreadCrumb pages={pages} />
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold text-[#2e5e74]">Step Three</h2>
        <p className="text-muted-foreground mt-2">Choose Motor Subtype</p>
      </div>
      <MotorSubtype product_type={product_type} motor_type={motor_type} />
    </section>
  );
}
