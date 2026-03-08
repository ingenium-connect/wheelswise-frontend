import FaqsContent from "@/components/faqs/FaqsContent";

export const metadata = {
  title: "FAQs | MedGen",
  description:
    "Frequently asked questions about MedGen motor insurance — coverage, claims, payments, and more.",
};

export default function FaqsPage() {
  return (
    <div className="bg-[#f0f6f9] flex-1">
      <div className="px-4 md:px-8 pt-6 pb-2">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74] rounded-2xl px-6 md:px-10 py-8 shadow-lg">
          <p className="text-white/70 text-sm mb-1 uppercase tracking-widest font-medium">
            Help Centre
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Everything you need to know about motor insurance on MedGen.
          </p>
        </div>
      </div>
      <div className="px-4 md:px-8 py-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <FaqsContent />
        </div>
      </div>
    </div>
  );
}
