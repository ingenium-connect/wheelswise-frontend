"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MotorType, MotorTypesResponse } from "@/types/data";
import { useInsuranceStore } from "@/store/store";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

type Props = {
  data: MotorTypesResponse;
};

const SelectMotorType = ({ data }: Props) => {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    undefined
  );
  const selectedCover = useInsuranceStore((state) => state.cover);
  const setMotorType = useInsuranceStore((state) => state.setMotorType);
  const setCoverStep = useInsuranceStore((state) => state.setCoverStep);
  const setTpoOption = useInsuranceStore((state) => state.setTpoOption);

  useEffect(() => {
    setCoverStep(1);
  }, []);

  const commercialOptions: { value: string; enum: string }[] = [
    { value: "Own goods", enum: "COMMERCIAL_OWN_GOODS" },
    { value: "General cartage", enum: "COMMERCIAL_GENERAL_CARTAGE" },
    { value: "General cartage tankers", enum: "GENERAL_CARTAGE_TANKERS" },
    { value: "Motor Advantage", enum: "MOTOR_ADVANTAGE" },
    { value: "Special types", enum: "COMMERCIAL_SPECIAL_TYPES" },
    { value: "Psv private hire", enum: "PSV_PRIVATE_HIRE" },
    { value: "Psv taxis", enum: "PSV_TAXIS" },
    { value: "Contigent liability", enum: "CONTINGENT_LIABILITY" },
    {
      value: "Institutional vehicles",
      enum: "COMMERCIAL_INSTITUTIONAL_VEHICLES",
    },
    {
      value: "Driving school vehicles",
      enum: "COMMERCIAL_DRIVING_SCHOOL_VEHICLES",
    },
  ];
  const handleSelect = (type: MotorType) => {
    setMotorType(type);
    router.push("/vehicle-value");
  };

  const handleTPO = (tpoCategory: string) => {
    setTpoOption(tpoCategory);
    router.push("/motor-subtype");
  };

  const handleSelectComOption = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value && value !== "") {
      setSelectedOption(value);
      return;
    }
    setSelectedOption(undefined)
  };

  return (
    <>
      {/* Main Content */}
      <div className="pt-20 px-4 py-6 md:px-16 flex-grow">
        {selectedCover === "THIRD_PARTY" && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,400px))] gap-4">
            <Card className="p-4">
              <p className="font-bold text-primary text-center">PRIVATE</p>
              <Image
                src="https://wheelwise-files.s3.amazonaws.com/motortype@c7ef95d2-2413-4271-845a-806700a446e3"
                alt="Private Motor"
                width={400}
                height={200}
                className="object-contain p-4"
              />
              <Button
                onClick={() => handleTPO("PRIVATE")}
                className="flex items-center justify-center p-4 bg-primary text-white font-bold border border-gray-300 shadow-md rounded-md"
              >
                Select
              </Button>
            </Card>

            <Card className="p-4">
              <p className="font-bold text-primary text-center">COMMERCIAL</p>
              <Image
                src="https://wheelwise-files.s3.amazonaws.com/motortype@c0e45828-06f2-44fa-a491-df12d50063e5"
                alt="Commercial option"
                width={400}
                height={200}
              ></Image>
              <select
                name="tpoCategory"
                onChange={handleSelectComOption}
                value={selectedOption}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2"
              >
                <option value="">Select commercial option</option>
                {commercialOptions.map((option) => (
                  <option key={option.enum} value={option.enum}>
                    {option.value}
                  </option>
                ))}
              </select>
              {selectedOption && (
                <Button
                  onClick={() => handleTPO(selectedOption)}
                  className="flex items-center justify-center p-4 bg-primary text-white font-bold border border-gray-300 shadow-md rounded-md"
                >
                  Continue
                </Button>
              )}
            </Card>
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
