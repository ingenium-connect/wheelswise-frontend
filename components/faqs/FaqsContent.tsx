"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Faq = { q: string; a: React.ReactNode };

type Category = {
  id: string;
  label: string;
  emoji: string;
  faqs: Faq[];
};

const CATEGORIES: Category[] = [
  {
    id: "getting-started",
    label: "Getting Started",
    emoji: "",
    faqs: [
      {
        q: "What is Wheelswise?",
        a: "Wheelswise is a product of MedGen Insurance, a licensed digital insurance intermediary regulated by the Insurance Regulatory Authority (IRA) of Kenya. We connect motorists with reputable underwriters, making it easy to compare, purchase, and manage motor insurance policies entirely online — no agents, no paperwork.",
      },
      {
        q: "How do I get a motor insurance quote?",
        a: (
          <>
            Getting a quote is fast and free. Simply:
            <ol className="list-decimal ml-5 mt-2 space-y-1 text-sm">
              <li>
                Select your cover type (Comprehensive or Third Party Only)
              </li>
              <li>Choose your motor type and enter your vehicle value</li>
              <li>Browse plans from multiple underwriters</li>
              <li>Enter your vehicle and personal details</li>
              <li>Create an account and complete payment</li>
            </ol>
            The entire process takes under 5 minutes.
          </>
        ),
      },
      {
        q: "Do I need to create an account to get a quote?",
        a: "You can browse cover types and plans without an account. However, you will need to create an account to finalise your policy purchase and access your insurance certificate.",
      },
      {
        q: "Who is eligible to purchase motor insurance through Wheelswise?",
        a: "Any individual or entity with a registered motor vehicle in Kenya is eligible. This includes private car owners, commercial vehicle operators, PSV operators, and fleet owners. You will need a valid national ID or passport and a Kenyan phone number.",
      },
      {
        q: "Is Wheelswise licensed and regulated?",
        a: "Yes. Wheelswise is a product of MedGen Insurance Agency, a licensed digital insurance intermediary regulated by the Insurance Regulatory Authority (IRA) of Kenya. We operate strictly as an insurance intermediary — we facilitate transactions between you and licensed underwriters but do not underwrite policies ourselves.",
      },
    ],
  },
  {
    id: "insurance-products",
    label: "Insurance Products",
    emoji: "🛡️",
    faqs: [
      {
        q: "What is the difference between Comprehensive and Third Party Only (TPO) insurance?",
        a: (
          <div className="space-y-3">
            <div className="rounded-lg border border-[#d7e8ee] p-3">
              <p className="font-semibold text-[#1e3a5f] text-sm mb-1">
                Comprehensive Cover
              </p>
              <p className="text-sm text-muted-foreground">
                Covers damage to your own vehicle (from accidents, fire, theft,
                natural disasters), as well as third-party liability for bodily
                injury and property damage. Ideal for newer or higher-value
                vehicles.
              </p>
            </div>
            <div className="rounded-lg border border-[#d7e8ee] p-3">
              <p className="font-semibold text-[#1e3a5f] text-sm mb-1">
                Third Party Only (TPO)
              </p>
              <p className="text-sm text-muted-foreground">
                Covers liability to third parties only — bodily injury and
                property damage caused to others. It does not cover damage to
                your own vehicle. This is the minimum legal requirement in
                Kenya.
              </p>
            </div>
          </div>
        ),
      },
      {
        q: "What types of vehicles can I insure?",
        a: (
          <>
            We support a range of vehicle categories including:
            <ul className="list-disc ml-5 mt-2 space-y-1 text-sm">
              <li>Private passenger vehicles</li>
              <li>Commercial vehicles (light and heavy)</li>
              <li>Public Service Vehicles (PSV)</li>
              <li>Motorcycles (where supported by underwriters)</li>
            </ul>
            The available plans will be displayed based on your selected motor
            type.
          </>
        ),
      },
      {
        q: "What factors affect my premium?",
        a: (
          <>
            Your motor insurance premium is calculated based on several factors:
            <ul className="list-disc ml-5 mt-2 space-y-1 text-sm">
              <li>Vehicle value (for Comprehensive)</li>
              <li>Motor type (private, commercial, PSV)</li>
              <li>Year of manufacture</li>
              <li>Seating capacity or tonnage (where applicable)</li>
              <li>Underwriter product and rate</li>
              <li>Any additional benefits selected</li>
            </ul>
          </>
        ),
      },
      {
        q: "Can I add extra benefits to my policy?",
        a: "Yes. When selecting a plan, you will see optional additional benefits offered by the underwriter — such as excess protector, political violence cover, and more. These are displayed with their costs and can be added to your policy before checkout.",
      },
      {
        q: "What is an excess?",
        a: "An excess (or deductible) is the amount you contribute towards a claim before the insurer pays the remainder. For example, if your excess is 5% of the claim amount with a minimum of KES 7,500, you would pay KES 7,500 on a KES 100,000 claim and the insurer would cover KES 92,500. Excesses vary by underwriter and product.",
      },
    ],
  },
  {
    id: "policy-claims",
    label: "Policy & Claims",
    emoji: "📄",
    faqs: [
      {
        q: "How and when do I receive my insurance certificate?",
        a: "Your insurance certificate is generated immediately upon successful payment confirmation. You can download it directly from your dashboard under the Policies tab. A copy will also be sent to your registered email address.",
      },
      {
        q: "When does my cover start?",
        a: "You select your cover start date during the payment summary step. Your policy becomes active from 00:00 on the selected start date, provided payment has been confirmed. Same-day cover is available if payment is made before midnight.",
      },
      {
        q: "How long is the cover period?",
        a: "The standard cover period is 365 days (12 months) from the selected start date. The exact period in days is shown on each plan card. Short-term or partial-year covers may be available depending on the underwriter.",
      },
      {
        q: "How do I make a claim?",
        a: (
          <>
            In the event of an incident:
            <ol className="list-decimal ml-5 mt-2 space-y-1 text-sm">
              <li>
                Notify the underwriter directly using the contact details on
                your certificate as soon as possible
              </li>
              <li>
                Do not admit liability or make any offers to third parties at
                the scene
              </li>
              <li>
                Gather evidence — photos, witness contacts, police abstract (for
                accidents)
              </li>
              <li>
                Contact our support team via the Support page for guidance on
                your specific claim
              </li>
            </ol>
            <p className="mt-2 text-sm text-muted-foreground">
              Claims are handled directly by the underwriter. MedGen can assist
              you in liaising with them.
            </p>
          </>
        ),
      },
      {
        q: "Can I cancel my policy?",
        a: "Policy cancellation terms vary by underwriter. Generally, you may request cancellation before the policy start date for a full refund. Post-commencement cancellations may be subject to the underwriter's short-rate table and administrative fees. Please contact our support team to initiate a cancellation request.",
      },
      {
        q: "Can I renew my policy through MedGen?",
        a: "Yes. When your policy is approaching expiry, you will receive a renewal reminder. You can renew directly from your dashboard — your vehicle details will be pre-filled and you can compare the latest plans available.",
      },
    ],
  },
  {
    id: "account-payments",
    label: "Account & Payments",
    emoji: "💳",
    faqs: [
      {
        q: "What payment methods are accepted?",
        a: "We currently support M-Pesa (via STK Push) for seamless mobile payments. Card payment support is coming soon. All transactions are secured and processed through certified payment gateways.",
      },
      {
        q: "How do I view my policies and vehicles on my dashboard?",
        a: "Log in to your account and navigate to the Dashboard. Use the tabs to switch between Home, Vehicles, Policies, and Profile. Your active policies and registered vehicles are listed with all relevant details.",
      },
      {
        q: "Can I update my personal information?",
        a: "You can view your profile information in the Profile tab on your dashboard. To update sensitive information such as your ID number or contact details, please contact our support team for verification and assistance.",
      },
      {
        q: "Is my payment information stored securely?",
        a: "MedGen does not store your M-Pesa PIN or card details. Payments are processed via secure, PCI-compliant gateways. We only retain transaction metadata (amount, reference, date) for policy and audit purposes.",
      },
      {
        q: "What happens if my M-Pesa payment times out?",
        a: "If the STK Push times out or you close it without entering your PIN, the payment will not be deducted and your policy will not be issued. Simply retry the payment from your dashboard. If an amount was deducted but no policy was issued, contact our support team immediately with your M-Pesa transaction code.",
      },
    ],
  },
  {
    id: "technical",
    label: "Technical",
    emoji: "⚙️",
    faqs: [
      {
        q: "My vehicle was not found in the search section. What should I do?",
        a: "If your vehicle is not found via our search service, you can proceed to enter your vehicle details manually on the same page. All fields — registration number, chassis number, make, model, year of manufacture, and body type — can be filled in manually. Ensure accuracy as this information appears on your certificate.",
      },
      {
        q: "I did not receive my OTP. What should I do?",
        a: (
          <>
            If you did not receive your OTP:
            <ul className="list-disc ml-5 mt-2 space-y-1 text-sm">
              <li>Ensure the phone number entered is correct and active</li>
              <li>Wait up to 60 seconds — network delays may occur</li>
              <li>
                Use the &ldquo;Resend OTP&rdquo; option after the timer expires
              </li>
              <li>
                Check that your phone has network coverage and is not in Do Not
                Disturb mode
              </li>
              <li>
                If the issue persists, contact our support team with your
                registered phone number
              </li>
            </ul>
          </>
        ),
      },
      {
        q: "How secure is my personal data?",
        a: "Your data is protected using industry-standard encryption (TLS in transit, AES at rest). We follow strict data handling policies in line with Kenyan data protection law and our Privacy Policy. We never sell your personal data to third parties. Authentication tokens expire after one hour and are stored as HTTP-only cookies.",
      },
      {
        q: "Why does the platform require valid vehicle data?",
        a: "We have integrated search capabilities to help auto-fill accurate vehicle details, reducing manual entry errors and speeding up your application. This also helps underwriters accurately assess risk and issue a valid policy. The data retrieved is used solely for your insurance application.",
      },
      {
        q: "Which browsers and devices are supported?",
        a: "Wheelswise is fully responsive and works on all modern browsers (Chrome, Firefox, Safari, Edge) on desktop, tablet, and mobile devices. For the best experience, we recommend keeping your browser up to date. Internet Explorer is not supported.",
      },
    ],
  },
];

function AccordionItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: Faq;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "border-b border-[#d7e8ee] last:border-0 transition-colors",
        isOpen && "bg-primary/5 rounded-xl mb-1",
      )}
    >
      <button
        className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left"
        onClick={onToggle}
      >
        <span
          className={cn(
            "text-sm font-semibold leading-snug transition-colors",
            isOpen ? "text-primary" : "text-[#1e3a5f]",
          )}
        >
          {faq.q}
        </span>
        <span className="shrink-0 mt-0.5">
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-primary" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </span>
      </button>
      {isOpen && (
        <div className="px-5 pb-4 text-sm text-[#334e68] leading-relaxed">
          {faq.a}
        </div>
      )}
    </div>
  );
}

export default function FaqsContent() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const category = CATEGORIES.find((c) => c.id === activeCategory)!;

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    setOpenIndex(0);
  };

  return (
    <div className="space-y-6">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors border",
              activeCategory === cat.id
                ? "bg-primary text-white border-primary shadow-sm"
                : "bg-white text-[#1e3a5f] border-[#d7e8ee] hover:bg-[#f0f6f9]",
            )}
          >
            {cat.emoji && <span>{cat.emoji}</span>}
            {cat.label}
          </button>
        ))}
      </div>

      {/* FAQ accordion */}
      <Card className="border border-[#d7e8ee] shadow-sm overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />
        <CardContent className="p-0">
          <div className="px-2 py-2">
            {category.faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                faq={faq}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Still have questions CTA */}
      <div className="bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74] rounded-2xl px-6 py-8 text-center shadow-md">
        <p className="text-white font-bold text-lg mb-1">
          Still have questions?
        </p>
        <p className="text-white/70 text-sm mb-5">
          Our support team is available 24/7 to help you.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            asChild
            className="bg-white text-primary hover:bg-white/90 font-semibold"
          >
            <Link href="/support">Submit a Request</Link>
          </Button>
          <a
            href="tel:+254717227690"
            className="inline-flex items-center justify-center rounded-md border border-white/50 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
          >
            Call Us
          </a>
        </div>
      </div>
    </div>
  );
}
