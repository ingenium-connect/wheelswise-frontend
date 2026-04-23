import {
  ShieldCheck,
  Zap,
  Users,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Car,
  FileText,
  CreditCard,
  Award,
  Globe,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "About Us — Kenya's Digital Motor Insurance Platform",
  description:
    "Wheelswise is a product of Med-Gen Insurance Agency, an IRA-licensed digital insurance intermediary in Kenya. We connect motorists with reputable underwriters for fast, transparent motor insurance.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Wheelswise — IRA-Licensed Motor Insurance in Kenya",
    description:
      "Learn about Wheelswise — Kenya's digital motor insurance platform. Regulated by the Insurance Regulatory Authority (IRA), we make motor insurance fast, fair, and fully online.",
    url: "/about",
  },
};

const values = [
  {
    icon: ShieldCheck,
    title: "Trust & Transparency",
    desc: "We provide clear, honest information so you can make informed decisions about your coverage.",
  },
  {
    icon: Zap,
    title: "Speed & Simplicity",
    desc: "From quote to certificate in minutes. No paperwork, no queues — just seamless digital insurance.",
  },
  {
    icon: Users,
    title: "Customer First",
    desc: "Every feature we build is driven by a single question: does this make life easier for our customers?",
  },
  {
    icon: Lock,
    title: "Security & Privacy",
    desc: "Your data is handled with the highest standards of security and regulatory compliance.",
  },
  {
    icon: Globe,
    title: "Inclusive Access",
    desc: "Designed to work for every Kenyan motorist, from private car owners to commercial fleet operators.",
  },
  {
    icon: Award,
    title: "Regulated & Compliant",
    desc: "We operate in compliance with the Insurance Regulatory Authority (IRA) of Kenya.",
  },
];

const steps = [
  {
    number: "01",
    icon: Car,
    title: "Choose Your Cover",
    desc: "Select between Comprehensive or Third Party Only (TPO) cover and pick the motor type that matches your vehicle.",
  },
  {
    number: "02",
    icon: FileText,
    title: "Select a Plan",
    desc: "Compare plans from multiple underwriters. View rates, benefits, and applicable excesses side by side.",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Enter Vehicle & Personal Details",
    desc: "Search your vehicle for auto-fill, or enter details manually. Provide your personal information to complete the application.",
  },
  {
    number: "04",
    icon: CreditCard,
    title: "Pay & Get Covered",
    desc: "Pay securely via M-Pesa or card. Your insurance certificate is issued immediately upon confirmation.",
  },
];

const stats = [
  { value: "10+", label: "Underwriter Partners" },
  { value: "2 min", label: "Average Quote Time" },
  { value: "100%", label: "Digital Process" },
  { value: "IRA", label: "Regulated & Licensed" },
];

export default function AboutPage() {
  return (
    <div className="bg-[#f0f6f9] flex-1">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "About Us", href: "/about" },
        ]}
      />
      {/* Hero */}
      <div className="px-4 md:px-8 pt-6 pb-2">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74] rounded-2xl px-6 md:px-12 py-12 shadow-lg">
          <p className="text-white/70 text-sm mb-2 uppercase tracking-widest font-medium">
            About Us
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight max-w-2xl">
            Reimagining Motor Insurance for Every Kenyan Car Owner
          </h1>
          <p className="text-white/70 text-base mt-4 max-w-xl leading-relaxed">
            Wheelswise is a digital insurance platform that connects motorists
            with licensed underwriters — making motor insurance fast, fair, and
            fully online.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Button
              asChild
              className="bg-white text-primary hover:bg-white/90 font-semibold"
            >
              <Link href="/cover-type">Get a Quote</Link>
            </Button>
            <Link
              href="/support"
              className="inline-flex items-center justify-center rounded-md border border-white/50 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="px-4 md:px-8 py-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.label} className="border border-[#d7e8ee] shadow-sm">
              <CardContent className="p-5 text-center">
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Who We Are */}
      <div className="px-4 md:px-8 py-4">
        <div className="max-w-5xl mx-auto">
          <Card className="border border-[#d7e8ee] shadow-sm overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />
            <CardContent className="p-6 md:p-10">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">
                    Who We Are
                  </p>
                  <h2 className="text-2xl font-bold text-[#1e3a5f] mb-4 leading-snug">
                    A Licensed Insurance Intermediary Built for the Digital Age
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Med-Gen Insurance Agency is a licensed intermediary regulated
                    by the Insurance Regulatory Authority (IRA) of Kenya. We act
                    as a bridge between motorists and reputable underwriters,
                    giving you access to competitive motor insurance products
                    through a single, intuitive digital platform.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We do not underwrite policies ourselves. Instead, we partner
                    with established insurers to bring you vetted products with
                    transparent pricing.
                  </p>
                </div>
                <div className="space-y-3">
                  {[
                    "Compare plans from multiple underwriters in one place",
                    "Integrated vehicle lookup for faster onboarding",
                    "Instant digital certificates upon payment",
                    "M-Pesa and card payment support",
                    "Dedicated support team based",
                    "Full compliance with IRA regulations",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-sm text-[#334e68]">{item}</p>
                    </div>
                  ))}
                </div>
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
            Insured in Four Simple Steps
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

      {/* Our Values */}
      <div className="px-4 md:px-8 py-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
            Our Values
          </p>
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">
            What Drives Us
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <Card
                  key={v.title}
                  className="border border-[#d7e8ee] shadow-sm"
                >
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 bg-primary/10 rounded-xl">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-sm font-bold text-[#1e3a5f]">
                        {v.title}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {v.desc}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contact & Location */}
      <div className="px-4 md:px-8 py-6">
        <div className="max-w-5xl mx-auto">
          <Card className="border border-[#d7e8ee] shadow-sm overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />
            <CardContent className="p-6 md:p-10">
              <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
                Get in Touch
              </p>
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-6">
                We&apos;re Here to Help
              </h2>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-xl shrink-0">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      Phone
                    </p>
                    <a
                      href="tel:+254717227690"
                      className="text-sm font-medium text-[#1e3a5f] hover:text-primary"
                    >
                      +254 717 227 690
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-xl shrink-0">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      Email
                    </p>
                    <a
                      href="mailto:support@medgeninsurance.com"
                      className="text-sm font-medium text-[#1e3a5f] hover:text-primary"
                    >
                      support@medgeninsurance.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-xl shrink-0">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      Address
                    </p>
                    <p className="text-sm font-medium text-[#1e3a5f]">
                      Ushirika Road, Karen
                      <br />
                      Nairobi, Kenya
                    </p>
                  </div>
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
