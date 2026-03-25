"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MotorType, MotorTypesResponse, TpoOption } from "@/types/data";
import { useInsuranceStore } from "@/stores/insuranceStore";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { axiosClient } from "@/utilities/axios-client";
import { useVehicleStore } from "@/stores/vehicleStore";
import { useUserStore } from "@/stores/userStore";
import { ACCESS_TOKEN } from "@/utilities/constants";
import { useOtp } from "@/hooks/useOtp";
import { Bike } from "lucide-react";
import { toast } from "sonner";

type Props = {
  data: MotorTypesResponse;
};

const SelectMotorType = ({ data }: Props) => {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    undefined,
  );
  const [vehicleTonnage, setVehicleTonnage] = useState<number>(0);
  const { sending: sendingOtp, sendOtp } = useOtp();
  const [commercialOptions, setCommercialOptions] = useState<
    { description: string; code: string }[]
  >([]);

  const selectedCover = useInsuranceStore((state) => state.cover);
  const setMotorType = useInsuranceStore((state) => state.setMotorType);
  const setCoverStep = useInsuranceStore((state) => state.setCoverStep);
  const setTpoOption = useInsuranceStore((state) => state.setTpoOption);
  const setTonnage = useVehicleStore((state) => state.setTonnage);

  const initialProfile = useUserStore((state) => state.profile);
  const resetProfile = useUserStore((state) => state.resetProfile);
  const [hasAuthToken, setHasAuthToken] = useState<boolean>(false);

  useEffect(() => {
    // Check cookie for access token; if missing, clear persisted profile
    try {
      const cookies = document.cookie.split("; ").map((c) => c.trim());
      const tokenCookie = cookies.find((c) => c.startsWith(`${ACCESS_TOKEN}=`));
      const present = Boolean(tokenCookie && tokenCookie.split("=")[1]);
      setHasAuthToken(present);
      if (!present) {
        resetProfile();
      }
    } catch (_err) {
      // ignore
    }
  }, [resetProfile]);

  useEffect(() => {
    const getCommercialOptions = () => {
      axiosClient
        .get("policies/products/tpo-commercial-subcategories")
        .then((res) => {
          setCommercialOptions(res.data);
        })
        .catch(() => {
          toast.error("Could not load commercial categories. Please refresh the page.");
        });
    };
    setCoverStep(1);
    getCommercialOptions();
  }, [setCoverStep]);

  /**
   * sets the vehicle tonnage var
   */
  const handleTonnageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setVehicleTonnage(Number(value));
    setTonnage(Number(value));
  };
  const handleSelect = async (type: MotorType) => {
    setMotorType(type);

    // Only treat as authenticated when we have a profile and an auth token
    if (initialProfile && hasAuthToken) {
      // use hook to send OTP (dedupe + session persistence)
      const res = await sendOtp(initialProfile.id_number);
      if (res.ok || res.reason === "recently-sent") {
        router.push(
          `/otp-verify?product_type=${selectedCover}&motor_type=${type.name}`,
        );
      }
    } else {
      router.push(
        `/vehicle-value?product_type=${selectedCover}&motor_type=${type.name}`,
      );
    }
  };

  const handleTPO = async (category: string) => {
    const tpoCategory = category as TpoOption;
    let motorTypeName: string;
    if (tpoCategory === "PRIVATE") {
      setMotorType({ id: "1", name: "PRIVATE", description: "", image_url: "" });
      motorTypeName = "PRIVATE";
    } else if (tpoCategory === "MOTORBIKE") {
      setMotorType({ id: "3", name: "MOTORBIKE", description: "", image_url: "" });
      motorTypeName = "MOTORBIKE";
    } else {
      setMotorType({ id: "2", name: "COMMERCIAL", description: "", image_url: "" });
      motorTypeName = "COMMERCIAL";
    }
    setTpoOption(tpoCategory);
    if (initialProfile && hasAuthToken) {
      const res = await sendOtp(initialProfile.id_number);
      if (res.ok || res.reason === "recently-sent") {
        router.push(
          `/otp-verify?product_type=${selectedCover}&motor_type=${motorTypeName}`,
        );
      }
    } else {
      router.push(
        `/vehicle-value?product_type=${selectedCover}&motor_type=${motorTypeName}`,
      );
    }
  };

  // removed inline OTP implementation in favor of `useOtp` hook

  const handleSelectComOption = (value: string) => {
    if (value && value !== "") {
      setSelectedOption(value);
      return;
    }
    setSelectedOption(undefined);
  };

  const motorbikeImageUrl =
    data?.motor_types?.find((t) => t.name.toUpperCase() === "MOTORBIKE")
      ?.image_url ?? null;

  return (
    <>
      {sendingOtp && <p className="text-gray-800 text-lg">Sending OTP...</p>}
      {selectedCover === "THIRD_PARTY" && (
        <div className="flex flex-col gap-5 max-w-3xl mx-auto w-full">
          {/* Private card */}
          <Card className="group border border-[#d7e8ee] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl">
            <div className="flex flex-col sm:flex-row">
              {/* Image */}
              <div className="relative sm:w-56 h-48 sm:h-auto shrink-0 overflow-hidden bg-[#f0f6f9]">
                <Image
                  src="https://wheelwise-files.s3.amazonaws.com/motortype@c7ef95d2-2413-4271-845a-806700a446e3"
                  alt="Private Motor"
                  fill
                  className="object-contain p-5 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-[#1e3a5f] text-white px-2.5 py-1 rounded-full">
                    TPO
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-6 gap-4">
                <div>
                  <h3 className="text-xl font-bold text-[#1e3a5f]">
                    PRIVATE CARS
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Saloons, SUVs, hatchbacks & personal vehicles
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {[
                    "Covers third-party bodily injury",
                    "Covers third-party property damage",
                    "Meets Kenya's legal road requirements",
                  ].map((point) => (
                    <div key={point} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="text-xs text-muted-foreground">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handleTPO("PRIVATE")}
                  disabled={sendingOtp}
                  className="bg-[#1e3a5f] hover:bg-[#397397] text-white gap-2 mt-auto self-start px-6"
                >
                  {sendingOtp ? (
                    "Sending…"
                  ) : (
                    <>
                      Select Private <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Commercial card */}
          <Card className="group border border-[#d7e8ee] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl">
            <div className="flex flex-col sm:flex-row">
              {/* Image */}
              <div className="relative sm:w-56 h-48 sm:h-auto shrink-0 overflow-hidden bg-[#f0f6f9]">
                <Image
                  src="https://wheelwise-files.s3.amazonaws.com/motortype@c0e45828-06f2-44fa-a491-df12d50063e5"
                  alt="Commercial"
                  fill
                  className="object-contain p-5 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-[#1e3a5f] text-white px-2.5 py-1 rounded-full">
                    TPO
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-6 gap-4">
                <div>
                  <h3 className="text-xl font-bold text-[#1e3a5f]">
                    COMMERCIAL VEHICLES
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Trucks, vans, pickups & goods vehicles
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <Select
                    onValueChange={handleSelectComOption}
                    value={selectedOption}
                  >
                    <SelectTrigger className="w-full border-[#d7e8ee] bg-white text-sm">
                      <SelectValue placeholder="Select commercial category" />
                    </SelectTrigger>
                    <SelectContent>
                      {commercialOptions.map((option) => (
                        <SelectItem key={option.code} value={option.code}>
                          {option.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedOption && (
                    <>
                      <Field>
                        <FieldLabel htmlFor="tonnage">
                          Vehicle Tonnage (tonnes)
                        </FieldLabel>
                        <Input
                          id="tonnage"
                          name="tonnage"
                          required
                          min={0}
                          type="number"
                          placeholder="e.g. 5"
                          onChange={handleTonnageChange}
                        />
                      </Field>
                      {(!vehicleTonnage || vehicleTonnage <= 0) && (
                        <p className="text-red-500 text-xs">
                          Please enter a valid tonnage.
                        </p>
                      )}
                    </>
                  )}
                </div>

                <Button
                  onClick={() => handleTPO(selectedOption ?? "")}
                  disabled={
                    sendingOtp ||
                    !selectedOption ||
                    !vehicleTonnage ||
                    vehicleTonnage <= 0
                  }
                  className="bg-[#1e3a5f] hover:bg-[#397397] text-white gap-2 mt-auto self-start px-6"
                >
                  {sendingOtp ? (
                    "Sending…"
                  ) : (
                    <>
                      Continue <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Motorbike card */}
          <Card className="group border border-[#d7e8ee] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl">
            <div className="flex flex-col sm:flex-row">
              {/* Image / icon panel */}
              <div className="relative sm:w-56 h-48 sm:h-auto shrink-0 overflow-hidden bg-[#f0f6f9] flex items-center justify-center">
                {motorbikeImageUrl ? (
                  <Image
                    src={motorbikeImageUrl}
                    alt="Motorbike"
                    fill
                    className="object-contain p-5 group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <Bike className="w-24 h-24 text-[#397397] group-hover:scale-105 transition-transform duration-500" />
                )}
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-[#1e3a5f] text-white px-2.5 py-1 rounded-full">
                    TPO
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-6 gap-4">
                <div>
                  <h3 className="text-xl font-bold text-[#1e3a5f]">
                    MOTORBIKES
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Motorcycles, boda bodas & two-wheelers
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {[
                    "Covers third-party bodily injury",
                    "Covers third-party property damage",
                    "Meets Kenya's legal road requirements",
                  ].map((point) => (
                    <div key={point} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="text-xs text-muted-foreground">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handleTPO("MOTORBIKE")}
                  disabled={sendingOtp}
                  className="bg-[#1e3a5f] hover:bg-[#397397] text-white gap-2 mt-auto self-start px-6"
                >
                  {sendingOtp ? (
                    "Sending…"
                  ) : (
                    <>
                      Select Motorbike <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {selectedCover === "COMPREHENSIVE" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {(data?.motor_types ?? []).map((type) => (
            <Card
              key={type.id}
              className="group border border-[#d7e8ee] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col rounded-2xl cursor-pointer"
              onClick={() => !sendingOtp && handleSelect(type)}
            >
              <div className="relative h-52 w-full overflow-hidden bg-[#f0f6f9] shrink-0">
                <Image
                  src={type.image_url}
                  alt={type.name}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="px-5 pt-4 pb-1">
                <h2 className="text-lg font-bold text-[#1e3a5f] capitalize">
                  {type.name.charAt(0) + type.name.slice(1).toLowerCase()}
                </h2>
              </div>

              <div className="px-5 pb-5 flex flex-col flex-grow">
                <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                  {type.description}
                </p>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(type);
                  }}
                  disabled={sendingOtp}
                  className="w-full bg-[#1e3a5f] hover:bg-[#397397] text-white mt-4 gap-2"
                >
                  {sendingOtp ? (
                    "Sending…"
                  ) : (
                    <>
                      Select <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default SelectMotorType;
