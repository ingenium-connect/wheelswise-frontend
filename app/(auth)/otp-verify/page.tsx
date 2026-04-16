import { Suspense } from "react";
import OtpVerify from "@/components/Otpverify";
import FlowStepHeader from "@/components/layout/FlowStepHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Your Phone Number",
  robots: { index: false, follow: false },
};

export default async function Page() {
  return (
    <>
      <FlowStepHeader
        title="Verify Your Phone"
        subtitle="Enter the 6-digit code sent to your phone number."
      />
      <div className="bg-[#f0f6f9] flex-1 px-4 md:px-8 py-8">
        <Suspense>
          <OtpVerify />
        </Suspense>
      </div>
    </>
  );
}
