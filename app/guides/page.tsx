import { BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Motor Insurance Guides & Resources — Kenya",
  description:
    "Free motor insurance guides for Kenyan motorists. Learn about comprehensive vs third party cover, how claims work, what affects your premium, and how to buy insurance online.",
  alternates: { canonical: "/guides" },
};

const guides = [
  {
    slug: "comprehensive-vs-third-party",
    title: "Comprehensive vs Third Party Insurance — Which Should You Choose?",
    description:
      "Understand the key differences between comprehensive and third party only (TPO) motor insurance in Kenya, and learn which option is right for your vehicle and budget.",
  },
  {
    slug: "how-motor-insurance-works",
    title: "How Motor Insurance Works in Kenya",
    description:
      "A complete beginner's guide to motor insurance. Understand premiums, policies, excesses, claims, and what cover you need by law.",
  },
  {
    slug: "what-is-an-excess",
    title: "What is an Insurance Excess?",
    description:
      "Learn how insurance excesses (deductibles) work in Kenya, how they affect your claims, and how to choose the right level for your policy.",
  },
  {
    slug: "how-to-buy-insurance-online",
    title: "How to Buy Motor Insurance Online in Kenya",
    description:
      "A step-by-step guide to getting your motor insurance entirely online — from choosing your cover to paying via M-Pesa and downloading your certificate.",
  },
  {
    slug: "motor-insurance-for-new-drivers",
    title: "Motor Insurance for New Drivers in Kenya",
    description:
      "Everything a first-time driver needs to know about motor insurance in Kenya — cover types, costs, and practical tips for getting insured.",
  },
  {
    slug: "insurance-certificate-explained",
    title: "Understanding Your Insurance Certificate",
    description:
      "What your motor insurance certificate is, what it contains, why it matters, and how to download or replace it.",
  },
];

export default function GuidesPage() {
  return (
    <div className="bg-[#f0f6f9] flex-1">
      {/* Hero */}
      <div className="px-4 md:px-8 pt-6 pb-2">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74] rounded-2xl px-6 md:px-12 py-12 shadow-lg">
          <p className="text-white/70 text-sm mb-2 uppercase tracking-widest font-medium">
            Resources
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight max-w-2xl">
            Motor Insurance Guides & Resources
          </h1>
          <p className="text-white/70 text-base mt-4 max-w-xl leading-relaxed">
            Free, plain-language guides to help Kenyan motorists understand motor
            insurance — from choosing the right cover to making a claim.
          </p>
        </div>
      </div>

      {/* Guide Cards */}
      <div className="px-4 md:px-8 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {guides.map((guide) => (
              <Card
                key={guide.slug}
                className="border border-[#d7e8ee] shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-1 w-full bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="p-2.5 bg-primary/10 rounded-xl w-fit mb-3">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-sm font-bold text-[#1e3a5f] mb-2 leading-snug">
                    {guide.title}
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">
                    {guide.description}
                  </p>
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="text-sm font-semibold text-primary hover:text-primary/80 inline-flex items-center gap-1.5 transition-colors"
                  >
                    Read Guide
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 md:px-8 py-6 pb-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74] rounded-2xl px-6 md:px-10 py-10 text-center shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Ready to Get Insured?
            </h2>
            <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">
              Now that you understand your options, get a personalised quote in
              under 2 minutes.
            </p>
            <Button
              asChild
              className="bg-white text-primary hover:bg-white/90 font-semibold px-8"
            >
              <Link href="/cover-type">Get a Quote</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
