"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";

const Landing: React.FC = () => {
  const [slide, setSlide] = useState(0);
  const cars = ["/car.jpeg", "/lorry.jpeg", "/psv.jpeg"];
  const primary = "#397397";
  const primaryDark = "#2e5e74";

  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((prev) => (prev + 1) % cars.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [cars.length]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-[#d7e8ee] via-white to-white">
      {/* Header */}
      <header className="px-4 md:px-16 py-6 flex justify-start items-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={80}
          height={80}
          className="h-14 md:h-20 w-auto"
        />
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-16 py-6 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden">
        {/* Text Section */}
        <motion.div
          className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="mb-6">
            <h1
              className="text-3xl md:text-4xl font-bold leading-tight mb-4"
              style={{ color: "#1e3a5f" }}
            >
              Drive with <span style={{ color: primary }}>Confidence</span>.
              <br />
              Insure with <span style={{ color: primary }}>Ease</span>.
            </h1>
            <p className="text-gray-700 text-base md:text-lg mb-4">
              At{" "}
              <strong>
                <span style={{ color: primary }}>Wheelswise</span>
              </strong>
              , we provide <span style={{ color: primary }}>reliable</span> and{" "}
              <span style={{ color: primary }}>affordable</span> motor insurance
              tailored to keep you and your vehicle protected on every journey.
              Get the coverage you need with simple,{" "}
              <span style={{ color: primary }}>transparent plans</span> designed
              just for you.
            </p>
            <p style={{ color: primary }} className="font-medium italic">
              Ready to protect your ride?
            </p>
          </div>

          <div className="flex gap-3 mt-4">
            <Link
              href="/motor-type"
              className="text-white px-6 py-2 rounded-xl transition"
              style={{ backgroundColor: primary }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.backgroundColor = primaryDark;
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.backgroundColor = primary;
              }}
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="bg-white px-5 py-2 rounded-xl border transition"
              style={{
                color: primary,
                borderColor: primary,
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.backgroundColor = "#edf5f8";
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.backgroundColor = "white";
              }}
            >
              Login
            </Link>
          </div>
        </motion.div>

        {/* Car Slider Section */}
        <motion.div
          className="md:w-1/2 flex flex-col items-center relative"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="w-full h-60 md:h-72 lg:h-80 relative overflow-hidden">
            {cars.map((src, index) => (
              <motion.div
                key={index}
                className={`absolute inset-0 mx-auto transition-opacity duration-1000 ease-in-out h-full ${
                  index === slide ? "opacity-100" : "opacity-0"
                }`}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Image
                  src={src}
                  alt={`Car ${index}`}
                  fill
                  className="object-contain"
                />
              </motion.div>
            ))}
          </div>

          {/* Slider Dots */}
          <div className="mt-4 flex gap-2">
            {cars.map((_, index) => (
              <button
                key={index}
                onClick={() => setSlide(index)}
                className={`w-3 h-3 rounded-full transition ${
                  index === slide ? "bg-[#397397]" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
