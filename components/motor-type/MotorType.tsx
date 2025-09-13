"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "../layout/Footer";

interface MotorType {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

const SelectMotorType: React.FC = () => {
  const [motorTypes, setMotorTypes] = useState<MotorType[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/motor-type`;

  useEffect(() => {
    const fetchMotorTypes = async () => {
      try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (!response.ok)
          throw new Error(result.message || "Failed to load motor types");

        setMotorTypes(result.motor_types || []);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
      }
    };

    fetchMotorTypes();
  }, [API_URL]);

  const handleSelect = (type: MotorType) => {
    // Store the selected motor type in localStorage or state management
    localStorage.setItem("selectedMotorType", JSON.stringify(type));
    router.push("/value");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 text-white shadow-md z-50 bg-[#397397]">
        <div className="flex items-center justify-between px-4 md:px-16 h-16">
          <button
            onClick={() => router.back()}
            className="text-white hover:underline font-medium"
          >
            ← Go Back
          </button>
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-center">
            Step One: Choose a Motor Type
          </h1>
          <div className="w-24" />
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 px-4 py-6 md:px-16 flex-grow">
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {motorTypes.map((type) => (
            <div
              key={type.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-200 hover:border-[#397397] transition-transform transform hover:-translate-y-1 duration-300 flex flex-col overflow-hidden"
            >
              <div className="h-48 w-full overflow-hidden bg-white relative">
                <Image
                  src={type.image_url}
                  alt={type.name}
                  fill
                  className="object-contain p-4"
                />
              </div>

              <div className="px-5 py-4 flex flex-col justify-between flex-grow">
                <div>
                  <h2 className="text-lg font-bold uppercase tracking-wide text-[#397397]">
                    {type.name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {type.description}
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => handleSelect(type)}
                    className="w-full text-white py-2 rounded-lg font-medium bg-[#397397] hover:bg-[#2e5e74] transition duration-200"
                  >
                    Select
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SelectMotorType;
