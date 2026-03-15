import SupportForm from "@/components/auth/SupportForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Support",
  description:
    "Need help with your motor insurance? Submit a support request and our team will respond within 24 hours. Available for policy queries, claims guidance, payment issues, and more.",
  alternates: { canonical: "/support" },
};

export default function SupportPage() {
  return (
    <>
      <div className="px-4 md:px-8 pt-6 pb-2 bg-[#f0f6f9]">
        <div className="max-w-2xl mx-auto bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74] rounded-2xl px-6 md:px-10 py-8 shadow-lg">
          <p className="text-white/70 text-sm mb-1">We are here to help</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Support</h1>
          <p className="text-white/60 text-sm mt-1">
            Submit a request and our team will respond within 24 hours.
          </p>
        </div>
      </div>
      <div className="bg-[#f0f6f9] flex-1 px-4 md:px-8 py-6">
        <SupportForm />
      </div>
    </>
  );
}
