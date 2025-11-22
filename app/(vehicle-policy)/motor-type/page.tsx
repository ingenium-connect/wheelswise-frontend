import SelectMotorType from "@/components/motor-type/MotorType";
import { PageBreadCrumb } from "@/components/PageBreadCrumb";
import { MotorTypesResponse } from "@/types/data";
import { retrieve } from "@/utilities/api-client";
import { MOTOR_TYPES_ENDPOINT } from "@/utilities/endpoints";

export const dynamic = "force-dynamic";

export default async function MotorTypePage() {
  const response = await retrieve<MotorTypesResponse>(
    MOTOR_TYPES_ENDPOINT,
    false
  );

  if (response.error || !response.data) {
    return <div>Failed to load motor types.</div>;
  }

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
        <SelectMotorType data={response.data} />
      </section>
    </>
  );
}
