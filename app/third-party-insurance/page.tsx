import { Users, Banknote, Car, AlertTriangle, Scale } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://motor.medgeninsurance.com";

export const metadata: Metadata = {
  title: "Third Party Insurance Kenya — TPO Cover Online",
  description:
    "Buy third party only (TPO) motor insurance online in Kenya. Kenya's legal minimum insurance requirement. Affordable cover for third-party bodily injury and property damage. Pay via M-Pesa.",
  alternates: { canonical: "/third-party-insurance" },
  openGraph: {
    title: "Third Party Insurance Kenya (TPO) — Wheelswise",
    description:
      "Buy Kenya's minimum legal motor insurance online. Third party only cover at affordable rates. Instant certificate via M-Pesa.",
    url: "/third-party-insurance",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Third Party Only (TPO) Motor Insurance Kenya",
  serviceType: "Third Party Motor Vehicle Insurance",
  provider: {
    "@type": "InsuranceAgency",
    name: "MedGen Insurance Agency",
    url: BASE_URL,
  },
  areaServed: { "@type": "Country", name: "Kenya" },
  description:
    "Third party only (TPO) motor insurance in Kenya. The legal minimum cover for third-party bodily injury and property damage. Buy online and pay via M-Pesa.",
};

const tpoCovers = [
  {
    icon: Users,
    title: "Third-Party Bodily Injury",
    desc: "Covers medical expenses and compensation for injuries you cause to other people in an accident.",
  },
  {
    icon: Banknote,
    title: "Third-Party Property Damage",
    desc: "Covers damage you cause to other people's property — vehicles, buildings, infrastructure, and other assets.",
  },
];

const tpoDoesNotCover = [
  {
    icon: Car,
    title: "Own Vehicle Damage",
    desc: "If your car is damaged in an accident — whether you are at fault or not — you pay for repairs yourself.",
  },
  {
    icon: AlertTriangle,
    title: "Theft of Your Vehicle",
    desc: "If your vehicle is stolen, TPO provides no compensation. You bear the full replacement cost.",
  },
  {
    icon: AlertTriangle,
    title: "Fire Damage to Your Vehicle",
    desc: "If your vehicle is damaged by fire or explosion, TPO does not cover the repair or replacement cost.",
  },
];

const scenarios = [
  {
    title: "Older Vehicles",
    desc: "If your vehicle is 8+ years old with a lower market value, the annual cost of comprehensive cover may approach or exceed the vehicle's value. TPO keeps you legally compliant at a fraction of the cost.",
  },
  {
    title: "Budget-Conscious Motorists",
    desc: "If you are on a tight budget and need to meet Kenya's legal insurance requirement at the lowest possible cost, TPO is the most affordable option available.",
  },
  {
    title: "Low-Value Vehicles",
    desc: "For vehicles where the market value is low enough that you could reasonably absorb the cost of repairs or replacement, TPO provides the legal minimum cover without paying for protection you may not need.",
  },
];

export default function ThirdPartyInsurancePage() {
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
            Third Party Cover
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight max-w-2xl">
            Third Party Only (TPO) Insurance in Kenya
          </h1>
          <p className="text-white/70 text-base mt-4 max-w-xl leading-relaxed">
            Kenya&apos;s legal minimum motor insurance. Affordable cover for
            third-party bodily injury and property damage.
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

      {/* What is TPO */}
      <div className="px-4 md:px-8 py-6">
        <div className="max-w-5xl mx-auto">
          <Card className="border border-[#d7e8ee] shadow-sm overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />
            <CardContent className="p-6 md:p-10">
              <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">
                Understanding TPO
              </p>
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-4 leading-snug">
                What is Third Party Insurance?
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Third Party Only (TPO) insurance is the minimum level of motor
                insurance required by law in Kenya. It covers your legal
                liability to other people — specifically, bodily injuries and
                property damage you cause to third parties while operating your
                vehicle.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                TPO does not cover any damage to your own vehicle. If your car
                is stolen, damaged in an accident, or destroyed by fire, you
                bear the full financial cost yourself. For this reason, TPO is
                best suited for older, lower-value vehicles where the cost of
                comprehensive cover may not be economically justified.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* What TPO Covers / Does Not Cover */}
      <div className="px-4 md:px-8 py-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Covers */}
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
              Included
            </p>
            <h2 className="text-xl font-bold text-[#1e3a5f] mb-4">
              What TPO Covers
            </h2>
            <div className="space-y-4">
              {tpoCovers.map((item) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={item.title}
                    className="border border-[#d7e8ee] shadow-sm"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 bg-green-50 rounded-xl">
                          <Icon className="w-5 h-5 text-green-600" />
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

          {/* Does Not Cover */}
          <div>
            <p className="text-xs uppercase tracking-widest text-red-500 font-semibold mb-2">
              Not Included
            </p>
            <h2 className="text-xl font-bold text-[#1e3a5f] mb-4">
              What TPO Does NOT Cover
            </h2>
            <div className="space-y-4">
              {tpoDoesNotCover.map((item) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={item.title}
                    className="border border-[#d7e8ee] shadow-sm"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 bg-red-50 rounded-xl">
                          <Icon className="w-5 h-5 text-red-400" />
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
      </div>

      {/* Is TPO Right for You */}
      <div className="px-4 md:px-8 py-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
            Is TPO Right for You?
          </p>
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">
            When Third Party Insurance Makes Sense
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {scenarios.map((s) => (
              <Card
                key={s.title}
                className="border border-[#d7e8ee] shadow-sm overflow-hidden"
              >
                <div className="h-1 w-full bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />
                <CardContent className="p-5">
                  <h3 className="text-sm font-bold text-[#1e3a5f] mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {s.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Legal Requirement */}
      <div className="px-4 md:px-8 py-6">
        <div className="max-w-5xl mx-auto">
          <Card className="border border-amber-200 bg-amber-50/50 shadow-sm overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-amber-100 rounded-xl shrink-0">
                  <Scale className="w-6 h-6 text-amber-700" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#1e3a5f] mb-2">
                    Legal Requirement in Kenya
                  </h2>
                  <p className="text-sm text-[#334e68] leading-relaxed">
                    In Kenya, Section 4 of the Insurance (Motor Vehicle Third
                    Party Risks) Act (Cap 405) makes it a legal requirement to
                    have at minimum Third Party bodily injury and property
                    damage cover before operating a motor vehicle on public
                    roads. Driving without valid insurance is a criminal offence
                    that can result in fines, vehicle impoundment, or
                    imprisonment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 md:px-8 py-6 pb-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74] rounded-2xl px-6 md:px-10 py-10 text-center shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Get TPO Cover in Minutes
            </h2>
            <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">
              Meet Kenya&apos;s legal insurance requirement quickly and
              affordably. Compare TPO plans and pay via M-Pesa.
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
