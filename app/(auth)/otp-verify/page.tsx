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
      href: `/vehicle-details?product_type=${product_type}&motor_type=${motor_type}`,
      isActive: false,
    },
    {
      name: "Personal Details",
      href: `/personal-details?product_type=${product_type}&motor_type=${motor_type}`,
      isActive: false,
    },
    {
      name: "Sign Up",
      href: `/signup?product_type=${product_type}&motor_type=${motor_type}`,
      isActive: false,
    },
    {
      name: "OTP Verify",
      href: `/otp-verify?product_type=${product_type}&motor_type=${motor_type}`,
      isActive: true,
    },
  ];
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
