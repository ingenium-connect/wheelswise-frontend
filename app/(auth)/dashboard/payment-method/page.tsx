import PaymentMethod from "@/components/PaymentMethod";
import { ACCESS_TOKEN } from "@/utilities/constants";
import { cookies } from "next/headers";

export default async function Page() {
  const cookiesData = await cookies();

  const token = cookiesData.get(ACCESS_TOKEN)?.value;

  const pages = [
    { name: "Dashboard", href: "/dashboard", isActive: false },
    {
      name: "Payment Summary",
      href: "/dashboard/payment-summary",
      isActive: false,
    },
    {
      name: "Payment Method",
      href: "/dashboard/payment-method",
      isActive: true,
    },
  ];
  return (
    <>
      {/* Page gradient header */}
      <div className="px-4 md:px-8 pt-6 pb-2 bg-[#f0f6f9]">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74] rounded-2xl px-6 md:px-10 py-8 shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Payment Method
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Select your preferred method to complete your purchase
          </p>
        </div>
      </div>

      <div className="bg-[#f0f6f9] flex-1 px-4 md:px-8 py-6">
        <PaymentMethod token={token} />
      </div>
    </>
  );
}
