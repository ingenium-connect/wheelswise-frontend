import { PageBreadCrumb } from "@/components/PageBreadCrumb";
import PaymentMethod from "@/components/PaymentMethod";

export default function Page() {
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
      <section className="min-h-screen bg-gradient-to-br from-[#d7e8ee] via-white to-[#e5f0f3] py-12 px-4">
        <PageBreadCrumb pages={pages} />

        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-[#2e5e74]">Payment Methods</h2>
          <p className="text-red-600 mt-2">
            Select your convenient payment method.
          </p>
        </div>
        <PaymentMethod />
      </section>
    </>
  );
}
