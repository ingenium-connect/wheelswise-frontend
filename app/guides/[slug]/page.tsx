import { BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://motor.medgeninsurance.com";

type Guide = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  sections: { heading: string; body: string }[];
  keywords: string[];
};

const GUIDES: Guide[] = [
  {
    slug: "comprehensive-vs-third-party",
    title: "Comprehensive vs Third Party Insurance — Which Should You Choose?",
    metaTitle:
      "Comprehensive vs Third Party Insurance Kenya — Which is Right for You?",
    metaDescription:
      "Not sure whether to choose comprehensive or third party (TPO) motor insurance in Kenya? This guide explains the differences, costs, and which cover suits your needs.",
    intro:
      "Choosing between comprehensive and third party only (TPO) insurance is one of the most important decisions for any Kenyan motorist. The right choice depends on your vehicle's value, your budget, and your personal risk appetite.",
    keywords: [
      "comprehensive vs third party insurance",
      "difference between comprehensive and TPO",
      "which insurance to choose Kenya",
      "comprehensive insurance Kenya",
      "TPO insurance Kenya",
    ],
    sections: [
      {
        heading: "What is Comprehensive Insurance?",
        body: "Comprehensive motor insurance is the broadest level of cover available in Kenya. It protects your own vehicle against damage from accidents, fire, theft, and natural disasters — in addition to covering your liability to third parties.\n\nIf your car is involved in an accident, whether you are at fault or not, comprehensive insurance can cover the cost of repairs to your own vehicle. This makes it the preferred choice for newer, higher-value vehicles where repair costs would be significant.",
      },
      {
        heading: "What is Third Party Only (TPO) Insurance?",
        body: "Third Party Only (TPO) insurance is Kenya's minimum legal insurance requirement under the Insurance Act. It covers your liability to other people — their bodily injuries and property damage — if you cause an accident.\n\nTPO does not cover any damage to your own vehicle. If your car is stolen or damaged in an accident where you are at fault, you bear the full repair or replacement cost. However, it is significantly cheaper than comprehensive cover.",
      },
      {
        heading: "Key Differences at a Glance",
        body: "The fundamental difference is coverage scope:\n\nOwn vehicle damage in accident: Comprehensive covers this, TPO does not.\n\nFire damage to your vehicle: Comprehensive covers this, TPO does not.\n\nTheft of your vehicle: Comprehensive covers this, TPO does not.\n\nThird-party bodily injury: Both comprehensive and TPO cover this.\n\nThird-party property damage: Both comprehensive and TPO cover this.\n\nLegal compliance in Kenya: Both meet the legal requirement.\n\nPremium cost: Comprehensive premiums are higher; TPO premiums are lower.",
      },
      {
        heading: "When Should You Choose Comprehensive?",
        body: "Comprehensive insurance is recommended when:\n\nYour vehicle is less than 5-7 years old.\n\nYour vehicle's market value exceeds KES 500,000.\n\nYour vehicle is financed — most lenders require comprehensive cover.\n\nYou operate in high-risk areas with elevated theft rates.\n\nYou cannot afford to self-fund major repairs or replacement.",
      },
      {
        heading: "When is TPO Sufficient?",
        body: "Third party only insurance may be the right choice when:\n\nYour vehicle is older (typically 8+ years) with a lower market value.\n\nThe annual premium for comprehensive cover approaches the vehicle's value.\n\nYou have savings to cover potential repair costs.\n\nYou are on a tight budget and need legal compliance at minimum cost.",
      },
      {
        heading: "How to Decide",
        body: "A simple rule of thumb used by many financial advisors: if your annual comprehensive premium exceeds 10% of your vehicle's current market value, TPO may be more economically rational.\n\nHowever, always consider your personal financial resilience. If you cannot afford to replace your vehicle out-of-pocket in the event of theft or total loss, comprehensive cover provides crucial financial protection.",
      },
    ],
  },
  {
    slug: "how-motor-insurance-works",
    title: "How Motor Insurance Works in Kenya",
    metaTitle: "How Motor Insurance Works in Kenya — A Complete Guide",
    metaDescription:
      "A complete beginner's guide to motor insurance in Kenya. Understand how policies work, what premiums are, how claims are processed, and what cover you need by law.",
    intro:
      "Motor insurance can seem complex, but understanding its fundamentals helps you make better coverage decisions. This guide explains how motor insurance works in Kenya — from purchasing a policy to making a claim.",
    keywords: [
      "how motor insurance works",
      "motor insurance explained Kenya",
      "insurance policy Kenya",
      "how insurance claims work Kenya",
      "motor insurance beginners guide",
    ],
    sections: [
      {
        heading: "What is Motor Insurance?",
        body: "Motor insurance is a contract between you (the policyholder) and an insurance company (the underwriter). You pay a premium — a fixed amount — and in return, the insurer agrees to cover certain financial losses you may suffer as a result of owning or operating your vehicle.\n\nIn Kenya, motor vehicle insurance is regulated by the Insurance Regulatory Authority (IRA), which licenses all underwriters and intermediaries operating in the market.",
      },
      {
        heading: "The Key Parties Involved",
        body: "Understanding who does what in motor insurance:\n\nPolicyholder: You — the vehicle owner who purchases the insurance.\n\nUnderwriter: The licensed insurance company that assumes the financial risk.\n\nInsurance Intermediary: A licensed agent or digital platform (like Wheelswise) that connects you with underwriters.\n\nIRA: The Insurance Regulatory Authority of Kenya — the government body that regulates all parties.",
      },
      {
        heading: "What is a Premium?",
        body: "A premium is the amount you pay for your insurance cover. Motor insurance premiums in Kenya are calculated based on several factors:\n\nThe type of cover (comprehensive is higher than TPO).\n\nYour vehicle's value (higher value means a higher premium for comprehensive cover).\n\nMotor type (private, commercial, PSV).\n\nVehicle age and make/model.\n\nAny additional benefits selected.\n\nPremiums are typically paid annually, though some underwriters offer installment options.",
      },
      {
        heading: "What is an Excess (Deductible)?",
        body: "An excess is your contribution towards a claim before the insurer pays the remainder. For example, if your policy has a KES 7,500 excess and you make a KES 50,000 claim, you pay KES 7,500 and the insurer covers KES 42,500.\n\nExcesses are standard in comprehensive policies. They reduce the insurer's exposure to small claims and help keep premiums lower.",
      },
      {
        heading: "How Does a Claim Work?",
        body: "When you suffer an insured loss:\n\n1. Notify your underwriter immediately — delay can affect your claim.\n\n2. Do not admit liability at the scene of an accident.\n\n3. Gather evidence — photos, witness contacts, police abstract.\n\n4. Submit a formal claim to the underwriter with supporting documents.\n\n5. The underwriter assesses the claim and determines the payout.\n\n6. Payment is made directly to you or a repair facility.",
      },
      {
        heading: "What is an Insurance Certificate?",
        body: "Your insurance certificate is the official document proving you have valid motor insurance cover. It includes your policy number, vehicle registration, cover period, and the name of your underwriter.\n\nIn Kenya, you are legally required to carry your insurance certificate when operating a vehicle. On Wheelswise, your certificate is issued digitally and immediately upon payment confirmation.",
      },
    ],
  },
  {
    slug: "what-is-an-excess",
    title: "What is an Insurance Excess? A Guide for Kenyan Motorists",
    metaTitle:
      "What is an Insurance Excess? Motor Insurance Deductible Explained",
    metaDescription:
      "What is an insurance excess (deductible) in Kenya? Learn how excesses work in motor insurance policies, how they affect your claims, and how to choose the right level.",
    intro:
      "An insurance excess (also called a deductible) is one of the most misunderstood aspects of motor insurance. Understanding how excesses work helps you choose the right policy and avoid surprises when you make a claim.",
    keywords: [
      "insurance excess Kenya",
      "what is an excess insurance",
      "motor insurance deductible Kenya",
      "excess protector insurance",
      "insurance excess explained",
    ],
    sections: [
      {
        heading: "What is an Insurance Excess?",
        body: "An excess is the fixed amount or percentage of a claim that you agree to pay yourself before your insurer pays the remainder. It is your share of the risk under a comprehensive motor insurance policy.\n\nFor example: if your claim is for KES 80,000 and your policy excess is KES 7,500, you pay KES 7,500 and your insurer covers the remaining KES 72,500.",
      },
      {
        heading: "Types of Excess in Kenya",
        body: "Kenyan motor insurance policies typically use a percentage-based excess with a minimum floor amount:\n\nStandard excess: Often expressed as '5% minimum KES 7,500' — meaning 5% of the claim value, with a minimum payment of KES 7,500 regardless of claim size.\n\nBasic excess: A flat amount that applies to all claims.\n\nCompulsory excess: Mandatory excess set by the underwriter, usually non-negotiable.\n\nVoluntary excess: Additional excess you can choose to accept in exchange for a lower premium.",
      },
      {
        heading: "How Does an Excess Affect Your Premium?",
        body: "A higher excess generally means a lower premium, and vice versa. By agreeing to bear more of the risk yourself, the insurer reduces its exposure and passes some savings to you in the form of a lower annual premium.\n\nThis makes voluntary excess a useful tool if you are confident in your driving and want to reduce your annual insurance cost.",
      },
      {
        heading: "What is Excess Protector?",
        body: "Excess protector (or excess waiver) is an optional add-on benefit offered by many underwriters. When you make a claim, the excess protector covers your compulsory excess — meaning you effectively pay nothing out of pocket at claim time.\n\nOn Wheelswise, some underwriter plans include excess protector as an optional benefit you can add before checkout.",
      },
      {
        heading: "When Does Excess NOT Apply?",
        body: "Excesses typically apply to own-damage claims (damage to your vehicle). Third-party liability claims — where the insurer is paying another person for injury or property damage you caused — usually do not have a deductible. The insurer covers the full third-party claim on your behalf.",
      },
    ],
  },
  {
    slug: "how-to-buy-insurance-online",
    title: "How to Buy Motor Insurance Online in Kenya",
    metaTitle:
      "How to Buy Motor Insurance Online in Kenya — Step-by-Step Guide",
    metaDescription:
      "A step-by-step guide to buying motor insurance online in Kenya. Compare quotes, choose a plan, enter your vehicle details, and pay via M-Pesa in under 5 minutes.",
    intro:
      "Buying motor insurance online in Kenya has never been easier. This step-by-step guide walks you through exactly how to get a quote, compare plans, and get your insurance certificate — all without visiting an agent's office.",
    keywords: [
      "buy motor insurance online Kenya",
      "how to buy car insurance Kenya",
      "online motor insurance Kenya",
      "insurance quote Kenya",
      "motor insurance Mpesa",
    ],
    sections: [
      {
        heading: "Step 1: Choose Your Cover Type",
        body: "Your first decision is the type of cover you need: Comprehensive or Third Party Only (TPO).\n\nComprehensive cover protects your vehicle and covers third-party liability. TPO is Kenya's legal minimum — it covers third-party injuries and property damage only.\n\nIf your vehicle is relatively new or high-value, comprehensive is typically the better choice.",
      },
      {
        heading: "Step 2: Select Your Motor Type",
        body: "Different motor types attract different insurance rates. You will choose between:\n\nPrivate passenger vehicles (personal use cars).\n\nCommercial vehicles (pick-ups, lorries, delivery vans).\n\nPublic Service Vehicles / PSV (matatus, taxis, buses).\n\nChoose the category that accurately reflects how your vehicle is used, as this affects your premium and policy validity.",
      },
      {
        heading: "Step 3: Enter Your Vehicle Value",
        body: "For comprehensive cover, you enter your vehicle's current market value. This is used to calculate your premium — generally a percentage of the vehicle's value.\n\nFor TPO, the vehicle value is less critical since the policy does not cover own-vehicle damage. Some plans also require seating capacity or tonnage for commercial and PSV vehicles.",
      },
      {
        heading: "Step 4: Compare Plans from Underwriters",
        body: "This is where Wheelswise delivers real value. You see multiple plans from different IRA-licensed underwriters side by side — including the annual premium, excess, cover period, and optional add-ons.\n\nReview the plans carefully, paying attention to the excess level and any included benefits like excess protector or emergency roadside assistance.",
      },
      {
        heading: "Step 5: Enter Your Vehicle Details",
        body: "You will need your vehicle's registration number, chassis number, make, model, and year of manufacture. Wheelswise has an integrated vehicle lookup that can auto-fill most of these details — just enter your registration number and the system retrieves the rest.\n\nIf your vehicle is not found in the registry, you can enter the details manually.",
      },
      {
        heading: "Step 6: Pay via M-Pesa and Get Your Certificate",
        body: "Once you have reviewed your policy details, you pay via M-Pesa STK Push — the payment prompt is sent directly to your phone. Enter your M-Pesa PIN to confirm, and upon payment verification, your insurance certificate is generated and available for immediate download from your dashboard.",
      },
    ],
  },
  {
    slug: "motor-insurance-for-new-drivers",
    title: "Motor Insurance for New Drivers in Kenya",
    metaTitle:
      "Motor Insurance for New Drivers in Kenya — What You Need to Know",
    metaDescription:
      "New driver in Kenya? Learn everything you need to know about motor insurance for first-time drivers. Cover types, costs, what affects your premium, and how to get insured fast.",
    intro:
      "Getting your first motor insurance policy as a new driver in Kenya can feel overwhelming. This guide breaks down everything a first-time driver needs to know — from choosing the right cover to understanding what affects your premium.",
    keywords: [
      "motor insurance new drivers Kenya",
      "first time driver insurance Kenya",
      "car insurance beginners Kenya",
      "new driver insurance Kenya",
      "cheap insurance new drivers Kenya",
    ],
    sections: [
      {
        heading: "Is Motor Insurance Mandatory for New Drivers in Kenya?",
        body: "Yes. Every motor vehicle operated on a public road in Kenya must have at minimum Third Party Only (TPO) insurance, regardless of whether the driver is new or experienced. Driving without valid insurance is a criminal offence under the Insurance Act and Traffic Act of Kenya.",
      },
      {
        heading: "What Type of Insurance Should a New Driver Get?",
        body: "As a new driver, your choice depends on your vehicle:\n\nIf you drive a newer or financed vehicle, comprehensive cover is strongly recommended. New drivers statistically have a higher risk of minor accidents, and comprehensive cover protects you from significant repair costs.\n\nIf you drive an older, lower-value vehicle, TPO may be sufficient and is more affordable — though you will bear all costs for damage to your own vehicle.",
      },
      {
        heading: "What Affects Insurance Costs for New Drivers?",
        body: "As a new driver, you can expect to pay more than experienced drivers for comprehensive cover. Factors that affect your premium include:\n\nYour vehicle's age and market value.\n\nMotor type (private, commercial, PSV).\n\nYour chosen underwriter and plan.\n\nOptional add-ons (excess protector, etc.).\n\nUnlike some markets, Kenyan motor insurance premiums are primarily vehicle-based rather than driver-profile based, which can work in your favour.",
      },
      {
        heading: "Tips for New Drivers Getting Insured",
        body: "Practical advice for first-time insurance buyers:\n\nCompare multiple underwriters — premiums vary significantly for the same vehicle.\n\nConsider excess protector if you are worried about accident costs.\n\nEnsure all vehicle details on your policy are accurate — errors can invalidate your cover.\n\nKeep your insurance certificate in your vehicle at all times.\n\nNote your underwriter's claims contact number before you need it.",
      },
      {
        heading: "How to Get Insured as a New Driver on Wheelswise",
        body: "Getting your first motor insurance policy takes under 5 minutes:\n\n1. Visit Wheelswise and click 'Get a Quote'.\n\n2. Select your cover type and motor category.\n\n3. Browse plans from multiple underwriters.\n\n4. Enter your vehicle and personal details.\n\n5. Create your account and pay via M-Pesa.\n\n6. Download your insurance certificate immediately.\n\nNo agents, no office visits, no paperwork.",
      },
    ],
  },
  {
    slug: "insurance-certificate-explained",
    title: "Understanding Your Insurance Certificate in Kenya",
    metaTitle:
      "Motor Insurance Certificate Kenya — What It Is and How to Get It",
    metaDescription:
      "What is a motor insurance certificate in Kenya? Learn what your insurance certificate contains, why it matters, how to download it, and what to do if you lose it.",
    intro:
      "Your motor insurance certificate is one of the most important documents you will carry as a Kenyan motorist. This guide explains exactly what it is, what information it contains, and how to obtain and manage yours.",
    keywords: [
      "insurance certificate Kenya",
      "motor insurance certificate download",
      "certificate of insurance Kenya",
      "insurance sticker Kenya",
      "proof of insurance Kenya",
    ],
    sections: [
      {
        heading: "What is a Motor Insurance Certificate?",
        body: "A motor insurance certificate (also known as an insurance certificate or policy certificate) is an official document issued by your underwriter confirming that your vehicle has valid insurance cover. It serves as legal proof that you comply with Kenya's mandatory motor insurance requirement.",
      },
      {
        heading: "What Information Does It Contain?",
        body: "Your insurance certificate includes:\n\nPolicy number — your unique policy identifier.\n\nCertificate number — the certificate's own reference.\n\nVehicle registration number.\n\nVehicle make and model.\n\nChassis/VIN number.\n\nPolicyholder name and ID number.\n\nType of cover (Comprehensive or TPO).\n\nCover period (start date and end date).\n\nName of the underwriter.\n\nDate of issue.",
      },
      {
        heading:
          "Is the Insurance Certificate the Same as the Policy Document?",
        body: "No. The insurance certificate is a summary document proving cover exists. The full policy document (policy wording) contains all the detailed terms and conditions, exclusions, and claims procedures.\n\nBoth are important: carry the certificate in your vehicle and keep the full policy document accessible for reference when making claims.",
      },
      {
        heading: "When Do You Receive Your Certificate?",
        body: "On Wheelswise, your insurance certificate is generated immediately upon successful payment confirmation. You can download it directly from your dashboard under the Policies tab. This is one of the key advantages of digital insurance — no waiting for physical documents to be couriered.",
      },
      {
        heading: "What Happens if You Lose Your Certificate?",
        body: "If you lose your certificate, log into your Wheelswise dashboard and navigate to the Policies tab. Your certificate is available for re-download at any time during the cover period. If you experience any issues, contact our support team.",
      },
    ],
  },
];

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) return { title: "Insurance Guide" };
  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    keywords: guide.keywords,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      url: `/guides/${guide.slug}`,
      type: "article",
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);

  if (!guide) {
    notFound();
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.metaDescription,
    author: {
      "@type": "Organization",
      name: "MedGen Insurance Agency",
    },
    publisher: {
      "@type": "Organization",
      name: "Wheelswise",
      url: BASE_URL,
    },
    url: `${BASE_URL}/guides/${guide.slug}`,
    keywords: guide.keywords.join(", "),
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
        name: "Guides",
        item: `${BASE_URL}/guides`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: guide.title,
        item: `${BASE_URL}/guides/${guide.slug}`,
      },
    ],
  };

  return (
    <div className="bg-[#f0f6f9] flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
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
              href="/guides"
              className="hover:text-white/80 transition-colors"
            >
              Guides
            </Link>
            <span>/</span>
            <span className="text-white/70 line-clamp-1">{guide.title}</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <p className="text-white/70 text-sm uppercase tracking-widest font-medium">
              Guide
            </p>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight max-w-3xl">
            {guide.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-8 py-6">
        <div className="max-w-3xl mx-auto">
          {/* Intro */}
          <Card className="border border-[#d7e8ee] shadow-sm overflow-hidden mb-6">
            <div className="h-1.5 w-full bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />
            <CardContent className="p-6 md:p-8">
              <p className="text-sm text-[#334e68] leading-relaxed">
                {guide.intro}
              </p>
            </CardContent>
          </Card>

          {/* Sections */}
          {guide.sections.map((section) => (
            <Card
              key={section.heading}
              className="border border-[#d7e8ee] shadow-sm mb-4"
            >
              <CardContent className="p-6 md:p-8">
                <h2 className="text-lg font-bold text-[#1e3a5f] mb-4">
                  {section.heading}
                </h2>
                <div className="space-y-3">
                  {section.body.split("\n\n").map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-sm text-muted-foreground leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Back to guides */}
          <div className="mt-6 mb-4">
            <Link
              href="/guides"
              className="text-sm font-semibold text-primary hover:text-primary/80 inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Guides
            </Link>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 md:px-8 py-6 pb-10">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74] rounded-2xl px-6 md:px-10 py-10 text-center shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Get Insured Today
            </h2>
            <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">
              Compare motor insurance plans from Kenya&apos;s top underwriters
              and get your certificate in minutes.
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
