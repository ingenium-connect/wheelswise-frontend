import FlowStepHeader from "@/components/layout/FlowStepHeader";
import PersonalDetails from "@/components/PersonalDetails";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ motor_type?: string; product_type: string }>;
}) {
  const params = await searchParams;
  const motor_type = params?.motor_type || "PRIVATE";
  const product_type = params.product_type || "COMPREHENSIVE";

  const step = product_type === "COMPREHENSIVE" ? 5 : 4;
  const totalSteps = product_type === "COMPREHENSIVE" ? 5 : 4;

  return (
    <>
      <FlowStepHeader
        step={step}
        totalSteps={totalSteps}
        title="Personal Details"
        subtitle="Tell us a bit about yourself to complete your profile."
      />
      <div className="bg-[#f0f6f9] flex-1 px-4 md:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <PersonalDetails
            product_type={product_type}
            motor_type={motor_type}
          />
        </div>
      </div>
    </>
  );
}
