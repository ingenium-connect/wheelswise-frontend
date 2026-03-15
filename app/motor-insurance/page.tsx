import {
  Shield,
  ShieldAlert,
  Car,
  Truck,
  Bus,
  CheckCircle2,
  Zap,
  Clock,
  CreditCard,
  Award,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://motor.medgeninsurance.com";

export const metadata: Metadata = {
  title: "Motor Insurance Kenya — Compare & Buy Online",
  description:
    "Get the best motor insurance in Kenya. Compare comprehensive and third party (TPO) cover from IRA-licensed underwriters. Instant quotes, M-Pesa payment, instant certificate issuance.",
  alternates: { canonical: "/motor-insurance" },
  openGraph: {
    title: "Motor Insurance Kenya — Wheelswise",
    description:
      "Compare and buy motor insurance online in Kenya. Comprehensive and TPO cover for private, commercial & PSV vehicles.",
    url: "/motor-insurance",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Motor Insurance Kenya",
  serviceType: "Motor Vehicle Insurance",
  provider: {
    "@type": "InsuranceAgency",
    name: "MedGen Insurance Agency",
    url: BASE_URL,
  },
  areaServed: { "@type": "Country", name: "Kenya" },
  description:
    "Comprehensive and third party motor vehicle insurance in Kenya. Compare quotes from IRA-licensed underwriters.",
  offers: [
    {
      "@type": "Offer",
      name: "Comprehensive Motor Insurance",
      description:
        "Full coverage including own damage, theft, fire, and third-party liability",
    },
    {
      "@type": "Offer",
      name: "Third Party Only (TPO) Insurance",
      description:
        "Minimum legal cover — third party bodily injury and property damage",
    },
  ],
};

const comprehensiveBenefits = [
  "Own damage from accidents",
  "Fire & theft",
  "Third-party bodily injury",
  "Third-party property damage",
  "Natural disaster damage",
];

const tpoBenefits = [
  "Third-party bodily injury",
  "Third-party property damage",
  "Legal compliance",
  "Affordable premiums",
];

const vehicleTypes = [
  {
    icon: Car,
    title: "Private Vehicles",
    desc: "Private passenger cars, hatchbacks, saloons, SUVs",
  },
  {
    icon: Truck,
    title: "Commercial Vehicles",
    desc: "Light and heavy commercial vehicles, pick-ups, lorries",
  },
  {
    icon: Bus,
    title: "Public Service Vehicles",
    desc: "Public service vehicles, matatus, buses, taxis",
  },
];

const features = [
  {
    icon: Award,
    title: "10+ Underwriters",
    desc: "Compare plans side-by-side from Kenya's top licensed insurers",
  },
  {
    icon: Zap,
    title: "2-Min Quotes",
    desc: "Get an instant quote without speaking to an agent",
  },
  {
    icon: CreditCard,
    title: "M-Pesa Payment",
    desc: "Pay securely via M-Pesa STK Push",
  },
  {
    icon: Clock,
    title: "Instant Certificate",
    desc: "Your insurance certificate is issued immediately on payment",
  },
];

export default function MotorInsurancePage() {
  return (
    <div className="bg-[#f0f6f9] flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <div className="px-4 md:px-8 pt-6 pb-2">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74] rounded-2xl px-6 md:px-12 py-12 shadow-lg">
          <p className="text-white/70 text-sm mb-2 uppercase tracking-widest font-medium">
            Motor Insurance
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight max-w-2xl">
            Motor Insurance in Kenya
          </h1>
          <p className="text-white/70 text-base mt-4 max-w-xl leading-relaxed">
            Compare comprehensive and TPO cover from Kenya&apos;s top
            underwriters. Get a quote in under 2 minutes.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Button
              asChild
              className="bg-white text-primary hover:bg-white/90 font-semibold"
            >
              <Link href="/cover-type">Get a Quote</Link>
            </Button>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-md border border-white/50 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Product Cards */}
      <div className="px-4 md:px-8 py-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Comprehensive */}
          <Card className="border border-[#d7e8ee] shadow-sm overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-[#1e3a5f]">
                  Comprehensive Cover
                </h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                The most complete protection for your vehicle. Covers your own
                vehicle damage from accidents, fire, theft, and natural
                disasters — plus full third-party liability. Ideal for newer
                vehicles and higher-value cars.
              </p>
              <ul className="space-y-2 mb-6">
                {comprehensiveBenefits.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-[#334e68]">{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full">
                <Link href="/comprehensive-insurance">
                  Learn About Comprehensive
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* TPO */}
          <Card className="border border-[#d7e8ee] shadow-sm overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <ShieldAlert className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-[#1e3a5f]">
                  Third Party Only (TPO)
                </h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Kenya&apos;s minimum legal insurance requirement. Covers your
                liability to third parties — bodily injury and property damage
                you cause to others. The most affordable option for older or
                lower-value vehicles.
              </p>
              <ul className="space-y-2 mb-6">
                {tpoBenefits.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-[#334e68]">{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="w-full">
                <Link href="/third-party-insurance">Learn About TPO</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Vehicle Types */}
      <div className="px-4 md:px-8 py-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
            Vehicle Types
          </p>
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">
            Vehicles We Cover
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {vehicleTypes.map((vt) => {
              const Icon = vt.icon;
              return (
                <Card
                  key={vt.title}
                  className="border border-[#d7e8ee] shadow-sm"
                >
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 bg-primary/10 rounded-xl">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-sm font-bold text-[#1e3a5f]">
                        {vt.title}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {vt.desc}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Why Wheelswise */}
      <div className="px-4 md:px-8 py-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
            Why Wheelswise
          </p>
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">
            The Smarter Way to Get Insured
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <Card
                  key={f.title}
                  className="border border-[#d7e8ee] shadow-sm"
                >
                  <CardContent className="p-5">
                    <div className="p-2.5 bg-primary/10 rounded-xl w-fit mb-3">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-sm font-bold text-[#1e3a5f] mb-1.5">
                      {f.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {f.desc}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="px-4 md:px-8 py-6 pb-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74] rounded-2xl px-6 md:px-10 py-10 text-center shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Ready to Get Insured?
            </h2>
            <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">
              Get a personalised motor insurance quote in under 2 minutes. No
              agents, no paperwork — just simple, fast coverage.
            </p>
            <Button
              asChild
              className="bg-white text-primary hover:bg-white/90 font-semibold px-8"
            >
              <Link href="/cover-type">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
