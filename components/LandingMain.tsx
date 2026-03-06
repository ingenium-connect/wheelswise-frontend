"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Car, HeartPulse, ShieldCheck, Zap, Users, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

const cars = ["/car.jpeg", "/lorry.jpeg", "/psv.jpeg"];

const features = [
  {
    icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    title: "Comprehensive Cover",
    description: "Motor, personal accident, and health insurance all in one platform.",
  },
  {
    icon: <Zap className="w-6 h-6 text-primary" />,
    title: "Instant Quotes",
    description: "Get competitive quotes from top underwriters in seconds.",
  },
  {
    icon: <Users className="w-6 h-6 text-primary" />,
    title: "Trusted by Thousands",
    description: "Join Kenyans who trust for reliable cover.",
  },
  {
    icon: <BadgeCheck className="w-6 h-6 text-primary" />,
    title: "IRA Compliant",
    description: "All policies are fully compliant with Kenya's Insurance Act.",
  },
];

const coverTypes = [
  {
    icon: <Car className="w-8 h-8 text-primary" />,
    label: "Motor Insurance",
    description:
      "Protect your vehicle with comprehensive or third party cover. From selecting your plan to paying and receiving your insurance sticker — everything is done right here.",
    isMotor: true,
  },
  {
    icon: <HeartPulse className="w-8 h-8 text-primary" />,
    label: "Medical Insurance",
    description:
      "Health, maternity, cancer and accident protection plans tailored to keep you and your loved ones secure. Application entirely online.",
    isMotor: false,
  },
];

const LandingMain: React.FC = () => {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((prev) => (prev + 1) % cars.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="flex-1 px-4 md:px-16 py-10 md:py-16 flex flex-col md:flex-row items-center justify-between gap-10 bg-gradient-to-br from-[#d7e8ee] via-white to-[#e5f0f3] overflow-hidden">
        <motion.div
          className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            Motor &amp; Medical Insurance
          </span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 text-[#1e3a5f]">
            Your Insurance.{" "}
            <span className="text-primary">Simplified.</span>
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-md">
            At{" "}
            <strong className="text-primary">MEDGEN</strong>, we bring you
            reliable motor and personal accident insurance — tailored to keep you,
            your family, and your vehicle protected at every step.
          </p>
        </motion.div>

        {/* Car Slider */}
        <motion.div
          className="w-full md:w-1/2 flex flex-col items-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          <div className="w-full aspect-[4/3] md:aspect-auto md:h-72 lg:h-80 relative overflow-hidden">
            {cars.map((src, index) => (
              <motion.div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === slide ? "opacity-100" : "opacity-0"
                }`}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Image
                  src={src}
                  alt={`Vehicle ${index + 1}`}
                  fill
                  className="object-contain p-4"
                />
              </motion.div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            {cars.map((_, index) => (
              <button
                key={index}
                onClick={() => setSlide(index)}
                className={`w-3 h-3 rounded-full transition ${
                  index === slide ? "bg-primary" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* What We Cover */}
      <section className="bg-white px-4 md:px-16 py-14 border-y border-[#d7e8ee]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-2xl font-bold text-[#1e3a5f] mb-2">
            What We Cover
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-10">
            Choose the type of cover that suits your needs.
          </p>
          <div className="grid sm:grid-cols-2 gap-8">
            {coverTypes.map((ct, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full flex flex-col shadow-md border border-[#d7e8ee] hover:shadow-xl hover:border-primary transition-all duration-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-3 rounded-full bg-primary/10 shrink-0">
                        {ct.icon}
                      </div>
                      <h3 className="font-semibold text-lg text-[#1e3a5f]">
                        {ct.label}
                      </h3>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-gray-500">{ct.description}</p>
                  </CardContent>
                  <CardFooter className="pt-4 flex gap-3">
                    {ct.isMotor ? (
                      <>
                        <Button asChild className="flex-1 text-white">
                          <Link href="/cover-type">Get Started</Link>
                        </Button>
                        <Button asChild variant="outline" className="flex-1">
                          <Link href="/login">Login</Link>
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="flex-1 text-white"
                        onClick={() =>
                          toast.info("Coming Soon", {
                            description:
                              "Medical insurance is on its way. Stay tuned!",
                          })
                        }
                      >
                        Get Started
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Medgen */}
      <section className="bg-gradient-to-br from-white to-[#e5f0f3] px-4 md:px-16 py-14">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-2xl font-bold text-[#1e3a5f] mb-2">
            Why MedGen?
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-10">
            Built for Kenyans who want smart, hassle-free insurance.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center text-center p-5 rounded-xl bg-white border border-[#d7e8ee] shadow-sm hover:shadow-md hover:border-primary transition-all duration-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="p-3 rounded-full bg-primary/10 mb-3">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-[#1e3a5f] mb-1 text-sm">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-500">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingMain;
