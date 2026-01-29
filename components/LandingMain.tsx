"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

const LandingMain: React.FC = () => {
  const [slide, setSlide] = useState(0);
  const cars = ["/car.jpeg", "/lorry.jpeg", "/psv.jpeg"];

  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((prev) => (prev + 1) % cars.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [cars.length]);

  return (
    <>
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
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4 text-[#1e3a5f]">
              Drive with <span className="text-primary">Confidence</span>.
              <br />
              Insure with <span className="text-primary">Ease</span>.
            </h1>
            <p className="text-gray-700 text-base md:text-lg mb-4">
              At{" "}
              <strong>
                <span className="text-primary">Wheelswise</span>
              </strong>
              , we provide <span className="text-primary">reliable</span> and{" "}
              <span className="text-primary">affordable</span> motor insurance
              tailored to keep you and your vehicle protected on every journey.
              Get the coverage you need with simple,{" "}
              <span className="text-primary">transparent plans</span> designed
              just for you.
            </p>
            <p className="font-medium italic text-primary">
              Ready to protect your ride?
            </p>
          </div>

          <div className="flex gap-3 mt-4">
            <Button asChild className="text-white transition">
              <Link href="/cover-type">Get Started</Link>
            </Button>
            <Button asChild variant="outline" className="transition">
              <Link href="/login">Login</Link>
            </Button>
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
                  className="object-contain w-full"
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
    </>
  );
};

export default LandingMain;
