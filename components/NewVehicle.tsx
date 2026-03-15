"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { axiosClient } from "@/utilities/axios-client";
import {
  MOTOR_TYPES_ENDPOINT,
  REGISTER_VEHICLE_ENDPOINT,
} from "@/utilities/endpoints";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FinalVehiclePayload, MotorType, vehiclePayload } from "@/types/data";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { useInsuranceStore } from "@/stores/insuranceStore";
import { Card, CardContent } from "./ui/card";

type Props = {
  token?: string | undefined;
  modelMakeMap: { make: string; models: string[] }[];
};

const NewVehicle = ({ token, modelMakeMap }: Props) => {
  const [error, setError] = useState("");
  const router = useRouter();
  const [models, setModels] = useState<string[]>([]);
  const motorSubType = useInsuranceStore((s) => s.motorSubtype);
  const cover = useInsuranceStore((s) => s.cover);
  const [bodyTypes, setBodyTypes] = useState<string[]>([]);
  const [motorTypes, setMotorTypes] = useState<MotorType[]>([]);
  const [vehicleTonnage, setVehicleTonnage] = useState<number>(0);

  const currentYear = new Date().getFullYear();

  const [form, setForm] = useState({
    vehicleValue: 0,
    engineCapacity: "",
    vehicleNumber: "",
    chassisNumber: "",
    make: "",
    model: "",
    year: "",
    tonnage: 0,
    bodyType: "",
    vehicle_type: "",
    seating_capacity: 0,
    purpose: "",
  });

  const reset = () => {
    setForm({
      vehicleValue: 0,
      engineCapacity: "",
      vehicleNumber: "",
      chassisNumber: "",
      seating_capacity: 0,
      tonnage: 0,
      make: "",
      model: "",
      year: "",
      bodyType: "",
      vehicle_type: "",
      purpose: "",
    });
  };

  const cancelAction = () => {
    reset();
    router.back();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    // update model list when make changes
    if (e.target.name === "make") {
      const modelMake = modelMakeMap.find((m) => m.make === e.target.value);
      setModels(modelMake?.models ?? []);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    const syntheticEvent = {
      target: { name, value },
    } as React.ChangeEvent<HTMLSelectElement>;
    handleChange(syntheticEvent);
  };

  const validDetails = () => {
    return (
      form.vehicleValue > 0 &&
      form.engineCapacity &&
      form.vehicleNumber &&
      form.chassisNumber &&
      form.make &&
      form.model &&
      form.year &&
      form.bodyType &&
      form.vehicle_type
    );
  };

  const handleVehicleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const v = Object.fromEntries(formData) as Record<string, string>;
    if (!v) {
      setError("Please fill vehicle details before registering.");
      return;
    }

    const correctlyCasedBodyType =
      bodyTypes.find((bt) => bt.toLowerCase() === v.bodyType?.toLowerCase()) ||
      v.bodyType;

    // 1. Find the Make in your map using case-insensitive search
    const matchingMakeEntry = modelMakeMap.find(
      (m) => m.make.toLowerCase() === v.make?.toLowerCase(),
    );

    // 2. Determine the correctly cased Make and populate Model list
    const correctlyCasedMake = matchingMakeEntry
      ? matchingMakeEntry.make
      : v.make;

    const availableModels = matchingMakeEntry ? matchingMakeEntry.models : [];

    // Set the list of models for the dropdown options
    setModels(availableModels);

    const correctlyCasedModel =
      availableModels.find(
        (mod) => mod.toLowerCase() === v.model?.toLowerCase(),
      ) || v.model;

    const vehiclePayload: FinalVehiclePayload = {
      source: "",
      intended_policy_type: cover === "COMPREHENSIVE" ? "COMPREHENSIVE" : "THIRD_PARTY",
      vehicle: {
        chassis_number: (v.chassisNumber || "").trim(),
        registration_number: (v.vehicleNumber || "").trim(),
        make: correctlyCasedMake || "",
        model: correctlyCasedModel || "",
        engine_capacity: v.engineCapacity ? Number(v.engineCapacity) : null,
        body_type: correctlyCasedBodyType || "",
        purpose: v.purpose || "",
        tonnage:
          v.vehicle_type === "COMMERCIAL" && vehicleTonnage
            ? Number(vehicleTonnage)
            : undefined,
        purpose_type: v.purpose_type
          ? Number(v.purpose_type)
          : v.purpose === "COMMERCIAL"
            ? 1
            : 2,
        vehicle_value: Number.isFinite(+v.vehicleValue)
          ? +v.vehicleValue
          : null,
        seating_capacity: v.seating_capacity
          ? Number(v.seating_capacity)
          : null,
        vehicle_type: v.vehicle_type || "PRIVATE",
        year_of_manufacture: Number(v.year) || new Date().getFullYear(),
      },
    };

    try {
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await axiosClient.post(
        REGISTER_VEHICLE_ENDPOINT,
        vehiclePayload,
        {
          headers,
        },
      );

      const data = res?.data;

      if (data) {
        toast.success("Vehicle registration successful");
        router.push("/dashboard");
      } else {
        setError("Vehicle registration failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  /**
   * sets the vehicle tonnage var
   */
  const handleTonnageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setVehicleTonnage(Number(value));
  };

  useEffect(() => {
    axiosClient
      .get("vehicle/body-type")
      .then((res) => {
        setBodyTypes(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    axiosClient
      .get(MOTOR_TYPES_ENDPOINT)
      .then((res) => {
        setMotorTypes(res.data?.motor_types || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <>
      <div className="w-full">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error Occured</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="mx-auto mt-4 sm:mt-10 w-full bg-white/80 backdrop-blur-sm shadow-lg transition-all max-w-3xl">
          <CardContent>
            <form onSubmit={handleVehicleRegistration}>
              {/* Hidden fields so FormData captures Select-controlled values */}
              <input type="hidden" name="make" value={form.make} />
              <input type="hidden" name="model" value={form.model} />
              <input type="hidden" name="year" value={form.year} />
              <input type="hidden" name="bodyType" value={form.bodyType} />
              <input
                type="hidden"
                name="vehicle_type"
                value={form.vehicle_type}
              />
              <input type="hidden" name="purpose" value={form.purpose} />
              <input
                type="hidden"
                name="purpose_type"
                value={
                  form.purpose === "COMMERCIAL"
                    ? "1"
                    : form.purpose === "PRIVATE"
                      ? "2"
                      : ""
                }
              />
              <FieldGroup>
                <FieldSet>
                  <FieldLegend>Vehicle Details</FieldLegend>
                  <FieldDescription>
                    Please provide your vehicle details.
                  </FieldDescription>
                  <FieldGroup>
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="vehicleValue">
                          Vehicle Value
                        </FieldLabel>
                        <Input
                          id="vehicleValue"
                          name="vehicleValue"
                          value={form.vehicleValue}
                          onChange={handleChange}
                          type="number"
                          placeholder="Enter vehicle value e.g. 500000"
                          required
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="engineCapacity">
                          Engine Capacity
                        </FieldLabel>
                        <Input
                          id="engineCapacity"
                          type="text"
                          name="engineCapacity"
                          value={form.engineCapacity}
                          onChange={handleChange}
                          placeholder="Enter Engine cc e.g. 1800CC"
                          required
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="vehicleNumber">
                          Vehicle Number
                        </FieldLabel>
                        <Input
                          id="vehicleNumber"
                          name="vehicleNumber"
                          type="text"
                          onChange={handleChange}
                          value={form.vehicleNumber}
                          placeholder="Vehicle Number"
                          required
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="chassisNumber">
                          Chassis Number
                        </FieldLabel>
                        <Input
                          id="chassisNumber"
                          type="text"
                          name="chassisNumber"
                          value={form.chassisNumber}
                          onChange={handleChange}
                          placeholder="Chassis Number"
                          required
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="vehicleMake">
                          Select Make
                        </FieldLabel>
                        <Select
                          onValueChange={(v) => handleSelectChange("make", v)}
                          value={form.make}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Make" />
                          </SelectTrigger>
                          <SelectContent>
                            {modelMakeMap.map((m) => (
                              <SelectItem key={m.make} value={m.make}>
                                {m.make}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="vehicleModel">
                          Vehicle Model
                        </FieldLabel>
                        <Select
                          onValueChange={(v) => handleSelectChange("model", v)}
                          value={form.model}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Model" />
                          </SelectTrigger>
                          <SelectContent>
                            {models.map((model) => (
                              <SelectItem key={model} value={model}>
                                {model}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="yearOfManufacture">
                          Year of Manufacture
                        </FieldLabel>
                        <Select
                          onValueChange={(v) => handleSelectChange("year", v)}
                          value={form.year}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Year of manufacture" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from(
                              {
                                length:
                                  motorSubType?.underwriter_product.yom_range ??
                                  0,
                              },
                              (_, i) => {
                                const year = currentYear - i;
                                return (
                                  <SelectItem
                                    key={year}
                                    value={year.toString()}
                                  >
                                    {year}
                                  </SelectItem>
                                );
                              },
                            )}
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="bodyType">Body Type</FieldLabel>
                        <Select
                          onValueChange={(v) =>
                            handleSelectChange("bodyType", v)
                          }
                          value={form.bodyType}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select body type" />
                          </SelectTrigger>
                          <SelectContent>
                            {bodyTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="vehicleType">
                          Vehicle Type
                        </FieldLabel>
                        <Select
                          onValueChange={(v) =>
                            handleSelectChange("vehicle_type", v)
                          }
                          value={form.vehicle_type}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select vehicle type" />
                          </SelectTrigger>
                          <SelectContent>
                            {(motorTypes ?? []).map((type: MotorType) => (
                              <SelectItem key={type.id} value={type.name}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="purpose">Purpose</FieldLabel>
                        <Select
                          onValueChange={(v) =>
                            handleSelectChange("purpose", v)
                          }
                          value={form.purpose}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select purpose" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="COMMERCIAL">
                              COMMERCIAL
                            </SelectItem>
                            <SelectItem value="PRIVATE">PRIVATE</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="seatingCapacity">
                          Seating Capacity
                        </FieldLabel>
                        <Input
                          id="seatingCapacity"
                          type="number"
                          min={1}
                          placeholder="e.g. 14"
                          value={form.seating_capacity}
                          onChange={handleChange}
                          required
                        />
                      </Field>
                      {form.vehicle_type === "COMMERCIAL" && (
                        <>
                          <Field>
                            <FieldLabel htmlFor="tonnage">Tonnage</FieldLabel>
                            <Input
                              id="tonnage"
                              name="tonnage"
                              required
                              min={0}
                              type="number"
                              onChange={handleTonnageChange}
                            />
                          </Field>
                          {!vehicleTonnage ||
                            (vehicleTonnage <= 0 && (
                              <p className="text-red-600 text-sm mt-1">
                                Please enter a valid tonnage for the selected
                                vehicle.
                              </p>
                            ))}
                        </>
                      )}
                    </div>
                    <Field orientation="horizontal">
                      <Button type="submit" disabled={!validDetails()}>
                        Submit
                      </Button>
                      <Button
                        variant="outline"
                        type="button"
                        onClick={cancelAction}
                      >
                        Cancel
                      </Button>
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default NewVehicle;
