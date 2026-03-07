import OtpVerify from "@/components/Otpverify";
import FlowStepHeader from "@/components/layout/FlowStepHeader";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ motor_type?: string; product_type: string }>;
}) {
  const params = await searchParams;
  const motor_type = params?.motor_type || "PRIVATE";
  const product_type = params.product_type || "COMPREHENSIVE";

  void motor_type;
  void product_type;

  return (
    <>
      <FlowStepHeader
        title="Verify Your Phone"
        subtitle="Enter the 6-digit code sent to your phone number."
      />
      <div className="bg-[#f0f6f9] flex-1 px-4 md:px-8 py-8">
        <OtpVerify />
      </div>
    </>
  );
}
