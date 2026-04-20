import PaymentSuccess from "@/components/PaymentSuccess";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Successful",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <section className="flex-1 bg-gradient-to-br from-[#d7e8ee] via-white to-[#e5f0f3] py-12 px-4">
        <PaymentSuccess />
      </section>
    </>
  );
}
