"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Car,
  ShieldCheck,
  Zap,
  BadgeCheck,
  ArrowRight,
  CheckCircle2,
  Star,
  Clock,
  FileText,
  CreditCard,
  Shield,
  Truck,
  Users,
  Bike,
} from "lucide-react";
import { useInsuranceStore } from "@/stores/insuranceStore";

const cars = ["/car.jpeg", "/lorry.jpeg", "/psv.jpeg"];
const carLabels = ["Private Vehicle", "Commercial", "PSV"];

const stats = [
  { value: "2 min", label: "To Get Covered" },
  { value: "100%", label: "Digital Process" },
  { value: "IRA", label: "Compliant" },
  { value: "24/7", label: "Support" },
];

const steps = [
  { icon: ShieldCheck, label: "Choose Cover", desc: "Comprehensive or TPO" },
  { icon: FileText, label: "Select Plan", desc: "Compare & pick your plan" },
  { icon: Car, label: "Enter Details", desc: "Vehicle & personal info" },
  { icon: CreditCard, label: "Pay & Done", desc: "Certificate issued instantly" },
];

const coverOptions = [
  {
    coverTypeKey: "COMPREHENSIVE",
    icon: ShieldCheck,
    title: "Comprehensive",
    tag: "Most Popular",
    tagBg: "bg-emerald-100",
    tagText: "text-emerald-700",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    bandBg: "bg-gradient-to-r from-emerald-500 to-teal-500",
    btnBg: "bg-emerald-600 hover:bg-emerald-700",
    btnText: "text-white",
    desc: "Full protection for your vehicle — covers accidents, fire, theft, and third-party liability.",
    bullets: [
      "Own damage & theft",
      "Third-party bodily injury & property damage",
      "Fire & natural perils",
      "Optional extras (excess protector, political violence & more)",
    ],
  },
  {
    coverTypeKey: "THIRD_PARTY",
    icon: Shield,
    title: "Third Party Only (TPO)",
    tag: "Legal Minimum",
    tagBg: "bg-blue-100",
    tagText: "text-blue-700",
    color: "text-primary",
    bg: "bg-primary/10",
    bandBg: "bg-gradient-to-r from-[#1e3a5f] to-[#397397]",
    btnBg: "bg-[#1e3a5f] hover:bg-[#2e5e74]",
    btnText: "text-white",
    desc: "The minimum legal requirement in Kenya. Covers your liability to third parties only.",
    bullets: [
      "Third-party bodily injury",
      "Third-party property damage",
      "Meets legal road requirements",
      "Most affordable cover option",
    ],
  },
];

const vehicleTypes = [
  { icon: Car, label: "Private", desc: "Saloons, SUVs, hatchbacks" },
  { icon: Truck, label: "Commercial", desc: "Light & heavy goods vehicles" },
  { icon: Users, label: "PSV", desc: "Matatus, buses, taxis" },
  { icon: Bike, label: "Motorcycle", desc: "Boda bodas & motorbikes" },
];

const features = [
  {
    icon: Zap,
    title: "Instant Quotes",
    description: "Compare quotes from multiple underwriters in seconds — no waiting, no back-and-forth.",
  },
  {
    icon: ShieldCheck,
    title: "All Vehicle Types",
    description: "Private cars, commercial trucks, PSVs — we cover every type of motor vehicle.",
  },
  {
    icon: BadgeCheck,
    title: "IRA Compliant",
    description: "All policies are issued by licensed underwriters, fully compliant with Kenya's Insurance Act.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Our team is always available to help you with quotes, claims, or any insurance queries.",
  },
];

const LandingMain: React.FC = () => {
  const [slide, setSlide] = useState(0);
  const selectCover = useInsuranceStore((state) => state.selectCover);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((prev) => (prev + 1) % cars.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <section className="relative bg-[#1e3a5f] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#397397_0%,_transparent_60%)] opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_#2e5e74_0%,_transparent_50%)] opacity-30" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
          {/* Left */}
          <motion.div
            className="flex-1 text-center md:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block bg-white/10 text-white/90 text-xs font-semibold px-3 py-1 rounded-full mb-5 uppercase tracking-widest border border-white/20">
              Motor Insurance · Kenya
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
              Your Motor Insurance.{" "}
              <span className="text-[#8bbfd8]">Simplified.</span>
            </h1>
            <p className="text-white/70 text-base md:text-lg max-w-lg mb-8 leading-relaxed">
              Kenya&apos;s fastest motor insurance platform. Compare plans from top underwriters, insure any vehicle, and get your certificate in minutes — entirely online.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <a
                href="#cover-types"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#397397] hover:bg-[#2e5e74] text-white font-semibold rounded-xl transition-colors shadow-lg"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-4 gap-4 max-w-sm md:max-w-none">
              {stats.map((s) => (
                <div key={s.label} className="text-center md:text-left">
                  <p className="text-xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-white/50 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — slider */}
          <motion.div
            className="flex-1 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#0f2035]">
                {cars.map((src, i) => (
                  <motion.div
                    key={i}
                    className={`absolute inset-0 transition-opacity duration-1000 ${i === slide ? "opacity-100" : "opacity-0"}`}
                  >
                    <Image
                      src={src}
                      alt={carLabels[i]}
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 text-white text-xs font-medium bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {carLabels[i]}
                    </span>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-center gap-2 mt-3">
                {cars.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlide(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === slide ? "bg-white w-6" : "bg-white/30 w-1.5"}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Cover Types ── */}
      <section id="cover-types" className="bg-[#f0f6f9] px-4 md:px-8 py-14 scroll-mt-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs uppercase tracking-widest text-primary font-semibold mb-2">
            What We Cover
          </p>
          <h2 className="text-center text-2xl md:text-3xl font-bold text-[#1e3a5f] mb-3">
            Choose Your Cover Type
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-10 max-w-md mx-auto">
            Pick the cover that suits your vehicle and budget — then compare plans from top underwriters.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {coverOptions.map((opt, i) => {
              const Icon = opt.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow flex flex-col bg-white border-2 border-transparent hover:border-primary/20"
                >
                  {/* coloured top band */}
                  <div className={`h-2 w-full ${opt.bandBg}`} />
                  {/* icon badge */}
                  <div className="px-7 pt-7 pb-2 flex items-start gap-4">
                    <div className={`p-4 rounded-2xl ${opt.bg} shrink-0`}>
                      <Icon className={`w-8 h-8 ${opt.color}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#1e3a5f] leading-tight">{opt.title}</h3>
                      {opt.tag && (
                        <span className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${opt.tagBg} ${opt.tagText}`}>
                          {opt.tag}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="px-7 pb-7 flex flex-col flex-1">
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                      {opt.desc}
                    </p>
                    <ul className="space-y-2.5 mb-7 flex-1">
                      {opt.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-2.5 text-sm text-[#334e68]">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 ${opt.color}`} />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => {
                        selectCover(opt.coverTypeKey);
                        router.push(`/motor-type/${opt.coverTypeKey}`);
                      }}
                      className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-colors ${opt.btnBg} ${opt.btnText}`}
                    >
                      Get Started <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Log in to manage your policies
            </Link>
          </p>
        </div>
      </section>

      {/* ── Vehicle Types ── */}
      <section className="bg-white border-y border-[#d7e8ee] px-4 md:px-8 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs uppercase tracking-widest text-primary font-semibold mb-6">
            We Cover All Vehicle Types
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {vehicleTypes.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex flex-col items-center text-center bg-[#f0f6f9] border border-[#d7e8ee] rounded-2xl p-5 shadow-sm hover:border-primary/30 hover:bg-primary/5 transition-colors"
                >
                  <div className="p-3 bg-primary/10 rounded-xl mb-3">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-semibold text-[#1e3a5f] text-sm">{v.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-[#f0f6f9] px-4 md:px-8 py-14">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs uppercase tracking-widest text-primary font-semibold mb-2">
            How It Works
          </p>
          <h2 className="text-center text-2xl md:text-3xl font-bold text-[#1e3a5f] mb-10">
            Insured in Four Steps
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative flex flex-col items-center text-center bg-white border border-[#d7e8ee] rounded-2xl p-5 shadow-sm"
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shadow">
                    {i + 1}
                  </div>
                  <div className="p-3 bg-primary/10 rounded-xl mb-3 mt-2">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm font-semibold text-[#1e3a5f]">{step.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why MedGen ── */}
      <section className="bg-[#f0f6f9] px-4 md:px-8 py-14">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs uppercase tracking-widest text-primary font-semibold mb-2">
            Why MedGen
          </p>
          <h2 className="text-center text-2xl md:text-3xl font-bold text-[#1e3a5f] mb-3">
            Built for Kenyan Motorists
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-10 max-w-md mx-auto">
            Smart, fast, and fully regulated insurance — designed around your needs.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="bg-white border border-[#d7e8ee] rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
                >
                  <div className="p-2.5 bg-primary/10 rounded-xl w-fit mb-4">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-[#1e3a5f] mb-2 text-sm">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Trust Strip ── */}
      <section className="bg-white border-y border-[#d7e8ee] px-4 md:px-8 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-1 justify-center md:justify-start mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <p className="text-[#1e3a5f] font-semibold text-lg">
              Trusted by Kenyan motorists
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              Fast, transparent, and reliable — just like insurance should be.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <Image src="/mpesa.png" alt="M-Pesa" width={80} height={40} className="h-8 w-auto mx-auto object-contain" />
              <p className="text-xs text-muted-foreground mt-1">M-Pesa Payments</p>
            </div>
            <div className="h-10 w-px bg-[#d7e8ee]" />
            <div className="text-center">
              <p className="text-lg font-bold text-primary">IRA</p>
              <p className="text-xs text-muted-foreground mt-1">Regulated</p>
            </div>
            <div className="h-10 w-px bg-[#d7e8ee]" />
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-[#1e3a5f] px-4 md:px-8 py-16">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to get covered?
          </h2>
          <p className="text-white/60 text-base mb-8 max-w-md mx-auto">
            Get a motor insurance quote in under 2 minutes. No agents, no paperwork.
          </p>
          <Link
            href="/cover-type"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#397397] hover:bg-[#2e5e74] text-white font-semibold rounded-xl transition-colors shadow-lg"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

    </div>
  );
};

export default LandingMain;
