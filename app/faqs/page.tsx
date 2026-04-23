import FaqsContent from "@/components/faqs/FaqsContent";
import type { Metadata } from "next";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "FAQs — Motor Insurance Questions Answered",
  description:
    "Answers to frequently asked questions about motor insurance in Kenya — comprehensive cover, TPO, claims, M-Pesa payments, insurance certificates, and more.",
  alternates: { canonical: "/faqs" },
  openGraph: {
    title: "Motor Insurance FAQs — Wheelswise Kenya",
    description:
      "Everything you need to know about buying motor insurance online in Kenya — coverage types, claims process, payments, and policy management.",
    url: "/faqs",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Wheelswise?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Wheelswise is a product of Med-Gen Insurance, a licensed digital insurance intermediary regulated by the Insurance Regulatory Authority (IRA) of Kenya. We connect motorists with reputable underwriters, making it easy to compare, purchase, and manage motor insurance policies entirely online — no agents, no paperwork.",
      },
    },
    {
      "@type": "Question",
      name: "How do I get a motor insurance quote?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Getting a quote is fast and free. Select your cover type (Comprehensive or Third Party Only), choose your motor type and enter your vehicle value, browse plans from multiple underwriters, enter your vehicle and personal details, create an account and complete payment. The entire process takes under 5 minutes.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to create an account to get a quote?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can browse cover types and plans without an account. However, you will need to create an account to finalise your policy purchase and access your insurance certificate.",
      },
    },
    {
      "@type": "Question",
      name: "Is Wheelswise licensed and regulated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Wheelswise is a product of Med-Gen Insurance Agency, a licensed digital insurance intermediary regulated by the Insurance Regulatory Authority (IRA) of Kenya. We operate strictly as an insurance intermediary — we facilitate transactions between you and licensed underwriters but do not underwrite policies ourselves.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between Comprehensive and Third Party Only (TPO) insurance?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Comprehensive Cover covers damage to your own vehicle (from accidents, fire, theft, natural disasters), as well as third-party liability for bodily injury and property damage. Ideal for newer or higher-value vehicles. Third Party Only (TPO) covers liability to third parties only — bodily injury and property damage caused to others. It does not cover damage to your own vehicle. This is the minimum legal requirement in Kenya.",
      },
    },
    {
      "@type": "Question",
      name: "What types of vehicles can I insure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We support private passenger vehicles, commercial vehicles (light and heavy), Public Service Vehicles (PSV), and motorcycles (where supported by underwriters).",
      },
    },
    {
      "@type": "Question",
      name: "What factors affect my premium?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your motor insurance premium is calculated based on: vehicle value (for Comprehensive), motor type (private, commercial, PSV), year of manufacture, seating capacity or tonnage (where applicable), underwriter product and rate, and any additional benefits selected.",
      },
    },
    {
      "@type": "Question",
      name: "What is an excess?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An excess (or deductible) is the amount you contribute towards a claim before the insurer pays the remainder. For example, if your excess is 5% of the claim amount with a minimum of KES 7,500, you would pay KES 7,500 on a KES 100,000 claim and the insurer would cover KES 92,500. Excesses vary by underwriter and product.",
      },
    },
    {
      "@type": "Question",
      name: "How and when do I receive my insurance certificate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your insurance certificate is generated immediately upon successful payment confirmation. You can download it directly from your dashboard under the Policies tab. A copy will also be sent to your registered email address.",
      },
    },
    {
      "@type": "Question",
      name: "What payment methods are accepted?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We currently support M-Pesa (via STK Push) for seamless mobile payments. Card payment support is coming soon. All transactions are secured and processed through certified payment gateways.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if my M-Pesa payment times out?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If the STK Push times out or you close it without entering your PIN, the payment will not be deducted and your policy will not be issued. Simply retry the payment from your dashboard. If an amount was deducted but no policy was issued, contact our support team immediately with your M-Pesa transaction code.",
      },
    },
    {
      "@type": "Question",
      name: "How secure is my personal data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your data is protected using industry-standard encryption (TLS in transit, AES at rest). We follow strict data handling policies in line with Kenyan data protection law and our Privacy Policy. We never sell your personal data to third parties.",
      },
    },
  ],
};

export default function FaqsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "FAQs", href: "/faqs" },
        ]}
      />
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
              Everything you need to know about motor insurance on Med-Gen.
            </p>
          </div>
        </div>
        <div className="px-4 md:px-8 py-6 pb-12">
          <div className="max-w-4xl mx-auto">
            <FaqsContent />
          </div>
        </div>
      </div>
    </>
  );
}
