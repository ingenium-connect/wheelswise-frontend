import SelectMotorType from "@/components/motor-type/MotorType";
import { PageBreadCrumb } from "@/components/PageBreadCrumb";
import { MotorType, MotorTypesResponse } from "@/types/data";
import { retrieve } from "@/utilities/api-client";
import { MOTOR_TYPES_ENDPOINT } from "@/utilities/endpoints";

export const dynamic = "force-dynamic";

export default async function MotorTypePage({
  params,
}: {
  params: { product_type?: string };
}) {
  const response = await retrieve<MotorTypesResponse>(
    MOTOR_TYPES_ENDPOINT,
    false
  );

  if (response.error || !response.data) {
    return <div>Failed to load motor types.</div>;
  }

  const paramsValues = await params;
  const product_type = paramsValues.product_type || "COMPREHENSIVE";

  // Filter motor types if THIRD_PARTY
  const filteredResponse: MotorTypesResponse =
    product_type === "THIRD_PARTY"
      ? {
          ...response.data,
          motor_types: response.data.motor_types.filter((mt: MotorType) =>
            ["PRIVATE", "COMMERCIAL"].includes(mt.name.toUpperCase())
          ),
        }
      : response.data;

  const pages = [
    { name: "Home", href: "/", isActive: false },
    { name: "Cover Type", href: "/cover-type", isActive: false },
    { name: "Motor Type", href: "/motor-type", isActive: true },
  ];

  return (
    <>
      <section className="min-h-screen bg-gradient-to-br from-[#d7e8ee] via-white to-[#e5f0f3] py-12 px-4">
        <PageBreadCrumb pages={pages} />
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-[#2e5e74]">Step One</h2>
          <p className="text-muted-foreground mt-2">Choose a Motor Type</p>
        </div>
        <SelectMotorType data={filteredResponse} product_type={product_type} />
      </section>
    </>
  );
}
