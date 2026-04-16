import {
  Car,
  FileText,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Flame,
  Lock,
  CloudRain,
  Users,
  Banknote,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://motor.medgeninsurance.com";

export const metadata: Metadata = {
  title: "Comprehensive Motor Insurance Kenya — Full Vehicle Cover",
  description:
    "Buy comprehensive motor insurance online in Kenya. Covers own damage, theft, fire, and third-party liability. Compare plans from IRA-licensed underwriters and pay via M-Pesa.",
  alternates: { canonical: "/comprehensive-insurance" },
  openGraph: {
    title: "Comprehensive Motor Insurance Kenya — Wheelswise",
    description:
      "Full vehicle protection in Kenya. Own damage, theft, fire & third-party cover. Instant quotes and M-Pesa payment.",
    url: "/comprehensive-insurance",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Comprehensive Motor Insurance Kenya",
  serviceType: "Comprehensive Motor Vehicle Insurance",
  provider: {
    "@type": "InsuranceAgency",
    name: "MedGen Insurance Agency",
    url: BASE_URL,
  },
  areaServed: { "@type": "Country", name: "Kenya" },
  description:
    "Comprehensive motor insurance in Kenya covering own vehicle damage, theft, fire, and third-party liability. Compare quotes and buy online.",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Comprehensive Motor Insurance Plans",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Private Comprehensive",
          description: "Comprehensive insurance for private passenger vehicles",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Commercial Comprehensive",
          description: "Comprehensive insurance for commercial vehicles",
        },
      },
    ],
  },
};

const coverageItems = [
  {
    icon: Car,
    title: "Own Vehicle Damage",
    desc: "Accidents, collisions, and impact damage to your vehicle",
  },
  {
    icon: Flame,
    title: "Fire & Explosion",
    desc: "Damage caused by fire, explosion, or self-ignition",
  },
  {
    icon: Lock,
    title: "Theft & Attempted Theft",
    desc: "Theft of or damage from attempted theft of your vehicle",
  },
  {
    icon: Users,
    title: "Third-Party Bodily Injury",
    desc: "Injury to other people caused by your vehicle",
  },
  {
    icon: Banknote,
    title: "Third-Party Property Damage",
    desc: "Damage to other people's property caused by your vehicle",
  },
  {
    icon: CloudRain,
    title: "Natural Perils",
    desc: "Floods, storms, hail, and other natural disasters",
  },
];

const whoShouldChoose = [
  {
    icon: Car,
    title: "New Vehicle Owners",
    desc: "For vehicles under 5 years old or high-value cars where repair or replacement costs would be significant. Comprehensive cover ensures you are not left out-of-pocket after an accident.",
  },
  {
    icon: Banknote,
    title: "Financed Vehicles",
    desc: "Most lenders and hire-purchase providers in Kenya require comprehensive insurance as a condition of the loan. It protects both you and the financier's interest in the vehicle.",
  },
  {
    icon: MapPin,
    title: "High-Risk Areas",
    desc: "If you operate in areas with elevated theft or accident rates, comprehensive cover provides essential protection. The peace of mind alone is worth the additional premium.",
  },
];

const comparisonRows = [
  { feature: "Own vehicle damage (accidents)", comp: true, tpo: false },
  { feature: "Fire damage to your vehicle", comp: true, tpo: false },
  { feature: "Theft of your vehicle", comp: true, tpo: false },
  { feature: "Third-party bodily injury", comp: true, tpo: true },
  { feature: "Third-party property damage", comp: true, tpo: true },
  { feature: "Natural disaster damage", comp: true, tpo: false },
  { feature: "Legal compliance in Kenya", comp: true, tpo: true },
];

const steps = [
  {
    number: "01",
    icon: ShieldCheck,
    title: "Choose Comprehensive Cover",
    desc: "Select Comprehensive as your cover type and pick your motor category (private, commercial, or PSV).",
  },
  {
    number: "02",
    icon: FileText,
    title: "Compare Plans",
    desc: "View plans from multiple underwriters side by side. Compare premiums, excesses, and included benefits.",
  },
  {
    number: "03",
    icon: Car,
    title: "Enter Your Details",
    desc: "Provide your vehicle registration for auto-fill, or enter details manually. Add your personal information.",
  },
  {
    number: "04",
    icon: CreditCard,
    title: "Pay & Get Covered",
    desc: "Pay via M-Pesa STK Push and receive your insurance certificate immediately.",
  },
];

export default function ComprehensiveInsurancePage() {
  return (
    <div className="bg-[#f0f6f9] flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Motor Insurance", href: "/motor-insurance" },
          { name: "Comprehensive Insurance", href: "/comprehensive-insurance" },
        ]}
      />

      {/* Hero */}
      <div className="px-4 md:px-8 pt-6 pb-2">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74] rounded-2xl px-6 md:px-12 py-12 shadow-lg">
          <p className="text-white/70 text-sm mb-2 uppercase tracking-widest font-medium">
            Comprehensive Cover
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight max-w-2xl">
            Comprehensive Motor Insurance in Kenya
          </h1>
          <p className="text-white/70 text-base mt-4 max-w-xl leading-relaxed">
            The most complete protection for your vehicle. Own damage, theft,
            fire, and full third-party liability — all in one policy.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Button
              asChild
              className="bg-white text-primary hover:bg-white/90 font-semibold"
            >
              <Link href="/cover-type">Get a Quote</Link>
            </Button>
            <Link
              href="/motor-insurance"
              className="inline-flex items-center justify-center rounded-md border border-white/50 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              All Cover Types
            </Link>
          </div>
        </div>
      </div>

      {/* What Does Comprehensive Cover Include */}
      <div className="px-4 md:px-8 py-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
            Coverage
          </p>
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">
            What Does Comprehensive Cover Include?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coverageItems.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.title}
                  className="border border-[#d7e8ee] shadow-sm"
                >
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 bg-primary/10 rounded-xl">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-sm font-bold text-[#1e3a5f]">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Who Should Choose Comprehensive */}
      <div className="px-4 md:px-8 py-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
            Is It Right for You?
          </p>
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">
            Who Should Choose Comprehensive?
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {whoShouldChoose.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.title}
                  className="border border-[#d7e8ee] shadow-sm overflow-hidden"
                >
                  <div className="h-1 w-full bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />
                  <CardContent className="p-5">
                    <div className="p-2.5 bg-primary/10 rounded-xl w-fit mb-3">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-sm font-bold text-[#1e3a5f] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="px-4 md:px-8 py-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
            Compare
          </p>
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">
            Comprehensive vs Third Party — Side by Side
          </h2>
          <Card className="border border-[#d7e8ee] shadow-sm overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#d7e8ee]">
                      <th className="text-left p-4 text-[#1e3a5f] font-semibold">
                        Coverage Feature
                      </th>
                      <th className="text-center p-4 text-[#1e3a5f] font-semibold">
                        Comprehensive
                      </th>
                      <th className="text-center p-4 text-[#1e3a5f] font-semibold">
                        Third Party
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row) => (
                      <tr
                        key={row.feature}
                        className="border-b border-[#d7e8ee] last:border-0"
                      >
                        <td className="p-4 text-[#334e68]">{row.feature}</td>
                        <td className="p-4 text-center">
                          {row.comp ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {row.tpo ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <div className="px-4 md:px-8 py-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
            How It Works
          </p>
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">
            Get Covered in Four Steps
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <Card
                  key={step.number}
                  className="border border-[#d7e8ee] shadow-sm overflow-hidden"
                >
                  <div className="h-1 w-full bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-3xl font-black text-primary/20 leading-none">
                        {step.number}
                      </span>
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-[#1e3a5f] mb-1.5">
                      {step.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 md:px-8 py-6 pb-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74] rounded-2xl px-6 md:px-10 py-10 text-center shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Protect Your Vehicle Today
            </h2>
            <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">
              Compare comprehensive motor insurance plans from Kenya&apos;s top
              underwriters. Get your quote in under 2 minutes.
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
