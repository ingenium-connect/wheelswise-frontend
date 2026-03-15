import Signup from "@/components/auth/SignUp";
import FlowStepHeader from "@/components/layout/FlowStepHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Your Account — Get Insured in Minutes",
  description:
    "Create a free Wheelswise account to purchase motor insurance online in Kenya. Comprehensive and TPO cover. Pay via M-Pesa.",
  alternates: { canonical: "/signup" },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ motor_type?: string; product_type: string }>;
}) {
  const params = await searchParams;
  const motor_type = params?.motor_type || "PRIVATE";
  const product_type = params.product_type || "COMPREHENSIVE";

  return (
    <>
      <FlowStepHeader
        title="Create Account"
        subtitle="Set a password to secure your account."
      />
      <div className="bg-[#f0f6f9] flex-1 px-4 md:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <Signup product_type={product_type} motor_type={motor_type} />
        </div>
      </div>
    </>
  );
}
