"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MotorType, MotorTypesResponse } from "@/types/data";
import { useInsuranceStore } from "@/store/store";
import { Select } from "../ui/select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";

type Props = {
  data: MotorTypesResponse;
};

const SelectMotorType = ({ data }: Props) => {
  const router = useRouter();
  const selectedCover = useInsuranceStore((state) => state.cover);
  const setMotorType = useInsuranceStore((state) => state.setMotorType);
  
  const commercialOptions = [
    'Own goods',
    'General cartage',
    'General cartage tankers',
    'Motor Advantage',
    'Special types',
    'Psv private hire',
    'Psv taxis',
    'Contigent liability',
    'Institutional vehicles',
    'Driving school vehicles'
  ]
  const handleSelect = (type: MotorType) => {
    // Store the selected motor type in localStorage or state management
    setMotorType(type);
    router.push("/vehicle-value");
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
        {selectedCover === "THIRD_PARTY" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-center p-4 bg-primary text-white font-bold border border-gray-300 shadow-md rounded-md">
              PRIVATE
            </div>
            <div className="text-primary font-bold">
              <Select onValueChange={(value) => console.log(value)}>
                <SelectTrigger className="border border-primary w-full p-4 rounded-md">
                  <SelectValue placeholder="COMMERCIAL" />
                </SelectTrigger>
                <SelectContent className="shadow-md border w-full text-white bg-primary">
                  {
                    commercialOptions.map((option) => (
                      <SelectItem className="hover:bg-accent hover:text-primary px-4 py-2 cursor-pointer" key={option} value={option}>{option}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        {selectedCover === "COMPREHENSIVE" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {(data?.motor_types ?? []).map((type) => (
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
        )}
      </div>
    </>
  );
};

export default SelectMotorType;
