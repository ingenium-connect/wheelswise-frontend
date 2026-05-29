import StandaloneSignup from "@/components/auth/standalone-signup/SignupForm";
import FlowStepHeader from "@/components/layout/FlowStepHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Your Account — Get Insured in Minutes",
  description:
    "Create a free Wheelswise account to purchase motor insurance online in Kenya. Comprehensive and TPO cover. Pay via M-Pesa.",
  alternates: { canonical: "/signup" },
};

export default async function Page() {
  return (
    <>
      <FlowStepHeader
        title="Create Account"
        subtitle="Set a password to secure your account."
      />
      <div className="bg-[#f0f6f9] flex-1 px-4 md:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <StandaloneSignup />
        </div>
      </div>
    </>
  );
}
