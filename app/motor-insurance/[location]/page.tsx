import {
  Shield,
  ShieldAlert,
  CheckCircle2,
  Award,
  Zap,
  CreditCard,
  Clock,
  Info,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://motor.medgeninsurance.com";

const LOCATIONS = [
  {
    slug: "nairobi",
    name: "Nairobi",
    description:
      "Kenya's capital and largest city. High vehicle density makes comprehensive cover especially valuable.",
    fact: "Nairobi has one of the highest vehicle registration rates in East Africa.",
  },
  {
    slug: "mombasa",
    name: "Mombasa",
    description:
      "Kenya's coastal city and major port. Humid conditions and high traffic make reliable cover essential.",
    fact: "Mombasa's coastal climate and busy port roads mean vehicles face unique risks.",
  },
  {
    slug: "kisumu",
    name: "Kisumu",
    description:
      "The third-largest city, located on Lake Victoria. A growing commercial hub in western Kenya.",
    fact: "Kisumu is a major transit hub connecting Kenya, Uganda, and Tanzania.",
  },
  {
    slug: "nakuru",
    name: "Nakuru",
    description:
      "A major agricultural and industrial hub in the Rift Valley. Home to many commercial fleet operators.",
    fact: "Nakuru is one of Kenya's fastest-growing cities with a booming transport sector.",
  },
  {
    slug: "eldoret",
    name: "Eldoret",
    description:
      "A major commercial centre in the North Rift. Key hub for agricultural produce transport.",
    fact: "Eldoret is a critical logistics hub for northern and western Kenya.",
  },
  {
    slug: "thika",
    name: "Thika",
    description:
      "An industrial town northeast of Nairobi. Many businesses and commercial vehicles operate here.",
    fact: "Thika is known as the 'Blue City' and is a major industrial area near Nairobi.",
  },
  {
    slug: "malindi",
    name: "Malindi",
    description:
      "A coastal tourism town. Vehicles serving the hospitality and tourism sector need reliable cover.",
    fact: "Malindi attracts thousands of tourists annually, supporting a large transport industry.",
  },
  {
    slug: "kitale",
    name: "Kitale",
    description:
      "An agricultural town in Trans Nzoia. Many farm vehicles and commercial transporters operate here.",
    fact: "Kitale is one of Kenya's most productive agricultural regions, relying heavily on commercial transport.",
  },
];

export function generateStaticParams() {
  return LOCATIONS.map((l) => ({ location: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ location: string }>;
}): Promise<Metadata> {
  const { location } = await params;
  const loc = LOCATIONS.find((l) => l.slug === location);
  if (!loc) return { title: "Motor Insurance Kenya" };
  return {
    title: `Motor Insurance in ${loc.name} — Buy Online`,
    description: `Get motor insurance in ${loc.name}, Kenya. Compare comprehensive and TPO cover from IRA-licensed underwriters. Instant quotes and M-Pesa payment. ${loc.description}`,
    alternates: { canonical: `/motor-insurance/${loc.slug}` },
    openGraph: {
      title: `Motor Insurance in ${loc.name}, Kenya — Wheelswise`,
      description: `Buy motor insurance online in ${loc.name}. Compare quotes from top underwriters. Pay via M-Pesa and get your certificate instantly.`,
      url: `/motor-insurance/${loc.slug}`,
    },
  };
}

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

export default async function LocationPage({
  params,
}: {
  params: Promise<{ location: string }>;
}) {
  const { location } = await params;
  const loc = LOCATIONS.find((l) => l.slug === location);

  if (!loc) {
    notFound();
  }

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Motor Insurance in ${loc.name}, Kenya`,
    serviceType: "Motor Vehicle Insurance",
    provider: {
      "@type": "InsuranceAgency",
      name: "MedGen Insurance Agency",
      url: BASE_URL,
    },
    areaServed: {
      "@type": "City",
      name: loc.name,
      containedInPlace: { "@type": "Country", name: "Kenya" },
    },
    description: `Motor insurance for motorists in ${loc.name}, Kenya. Comprehensive and TPO cover from IRA-licensed underwriters.`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Motor Insurance",
        item: `${BASE_URL}/motor-insurance`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `Motor Insurance in ${loc.name}`,
        item: `${BASE_URL}/motor-insurance/${loc.slug}`,
      },
    ],
  };

  return (
    <div className="bg-[#f0f6f9] flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <div className="px-4 md:px-8 pt-6 pb-2">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74] rounded-2xl px-6 md:px-12 py-12 shadow-lg">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="text-white/50 text-xs mb-4 flex items-center gap-1.5"
          >
            <Link href="/" className="hover:text-white/80 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/motor-insurance"
              className="hover:text-white/80 transition-colors"
            >
              Motor Insurance
            </Link>
            <span>/</span>
            <span className="text-white/70">{loc.name}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight max-w-2xl">
            Motor Insurance in {loc.name}, Kenya
          </h1>
          <p className="text-white/70 text-base mt-4 max-w-xl leading-relaxed">
            {loc.description}
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
              All Locations
            </Link>
          </div>
        </div>
      </div>

      {/* Fact Callout */}
      <div className="px-4 md:px-8 py-4">
        <div className="max-w-5xl mx-auto">
          <Card className="border border-blue-200 bg-blue-50/50 shadow-sm">
            <CardContent className="p-5 flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-xl shrink-0">
                <Info className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-[#334e68] leading-relaxed">
                {loc.fact}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cover Options */}
      <div className="px-4 md:px-8 py-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
            Cover Options
          </p>
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">
            Cover Options Available in {loc.name}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Comprehensive */}
            <Card className="border border-[#d7e8ee] shadow-sm overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1e3a5f]">
                    Comprehensive Cover
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Full protection for motorists in {loc.name}. Covers your own
                  vehicle damage, fire, theft, and third-party liability —
                  giving you complete peace of mind on {loc.name}&apos;s roads.
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
                  <Link href="/cover-type">Get Comprehensive Quote</Link>
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
                  <h3 className="text-lg font-bold text-[#1e3a5f]">
                    Third Party Only (TPO)
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Kenya&apos;s legal minimum insurance for drivers in {loc.name}
                  . Covers third-party bodily injury and property damage at an
                  affordable rate.
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
                  <Link href="/cover-type">Get TPO Quote</Link>
                </Button>
              </CardContent>
            </Card>
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
            The Smarter Way to Get Insured in {loc.name}
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

      {/* Local Tip */}
      <div className="px-4 md:px-8 py-4">
        <div className="max-w-5xl mx-auto">
          <Card className="border border-[#d7e8ee] shadow-sm overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />
            <CardContent className="p-6 md:p-8">
              <p className="text-sm text-[#334e68] leading-relaxed">
                Whether you&apos;re insuring a private car, commercial vehicle,
                or PSV in {loc.name}, Wheelswise connects you with IRA-licensed
                underwriters at competitive rates. Compare plans, pay via
                M-Pesa, and get your insurance certificate instantly — all
                without visiting an agent&apos;s office.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 md:px-8 py-6 pb-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74] rounded-2xl px-6 md:px-10 py-10 text-center shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Ready to Get Insured in {loc.name}?
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
