import PaymentSummary from "@/components/payment-summary/PaymentSummary";

export default function PaymentSummaryPage() {
  return (
    <>
      {/* Page gradient header */}
      <div className="px-4 md:px-8 pt-6 pb-2 bg-[#f0f6f9]">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74] rounded-2xl px-6 md:px-10 py-8 shadow-lg">
          <p className="text-white/70 text-sm mb-1">Review before paying</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Payment Summary
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Confirm your plan details and select a cover start date
          </p>
        </div>
      </div>

      <div className="bg-[#f0f6f9] flex-1 px-4 md:px-8 py-6">
        <PaymentSummary />
      </div>
    </>
  );
}
