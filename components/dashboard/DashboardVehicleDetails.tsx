"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";
import { axiosClient, axiosAuthClient } from "@/utilities/axios-client";
import { toast } from "sonner";
import { Car, Loader2 } from "lucide-react";
import {
  getVehicleValueLimitError,
  MAX_VEHICLE_VALUE,
} from "@/utilities/validation-schemas";

type Props = {
  modelMakeMap: { make: string; models: string[] }[];
};

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_RANGE = 20;

export default function DashboardVehicleDetails({ modelMakeMap }: Props) {
  const router = useRouter();
  const [models, setModels] = useState<string[]>([]);
  const [bodyTypes, setBodyTypes] = useState<string[]>([]);
  const [purposeCategories, setPurposeCategories] = useState<
    { code: number; name: string }[]
  >([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [isFieldsDisabled, setIsFieldsDisabled] = useState(false);
  const [seatingCapacity, setSeatingCapacity] = useState("");
  const [vehicleValue, setVehicleValue] = useState("");
  const [tonnage, setTonnage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [vehicleType, setVehicleType] = useState("PRIVATE");

  const [form, setForm] = useState({
    engineCapacity: "",
    engineNumber: "",
    vehicleNumber: "",
    chassisNumber: "",
    make: "",
    model: "",
    year: "",
    bodyType: "",
    vehiclePurpose: "",
    vehiclePurposeCategory: "",
  });

  useEffect(() => {
    axiosClient
      .get("vehicle/body-type")
      .then((res) => setBodyTypes(res.data))
      .catch(() =>
        toast.error(
          "Could not load vehicle body types. Please refresh the page.",
        ),
      );

    const raw = sessionStorage.getItem("dashboard-vehicle-search");
    if (!raw) return;

    const {
      vehicle,
      regNo,
      motorType: savedMotorType,
    } = JSON.parse(raw) as {
      vehicle: Record<string, string> | null;
      regNo: string;
      motorType?: string;
    };

    if (savedMotorType) {
      setVehicleType(savedMotorType);
    }

    if (!vehicle) return;

    const matchingMakeEntry = modelMakeMap.find(
      (m) => m.make.toLowerCase() === vehicle.carMake?.toLowerCase(),
    );
    const correctlyCasedMake = matchingMakeEntry
      ? matchingMakeEntry.make
      : vehicle.carMake;
    const availableModels = matchingMakeEntry ? matchingMakeEntry.models : [];
    setModels(availableModels);

    const correctlyCasedModel =
      availableModels.find(
        (mod) => mod.toLowerCase() === vehicle.carModel?.toLowerCase(),
      ) || vehicle.carModel;

    setForm({
      engineCapacity: vehicle.engineCapacity || "",
      engineNumber: vehicle.engineNumber || "",
      vehicleNumber: regNo || "",
      chassisNumber: vehicle.ChassisNo || "",
      make: correctlyCasedMake || "",
      model: correctlyCasedModel || "",
      year: vehicle.yearOfManufacture?.toString() || "",
      bodyType: vehicle.bodyType || "",
      vehiclePurpose: vehicle.purpose || "",
      vehiclePurposeCategory: "",
    });

    const seats = vehicle.passengerCapacity || vehicle.seatingCapacity;
    if (seats) {
      setSeatingCapacity(seats.toString());
    }

    setIsFieldsDisabled(true);
  }, [modelMakeMap]);

  useEffect(() => {
    if (!form.vehiclePurpose) {
      setPurposeCategories([]);
      return;
    }
    setLoadingCategories(true);
    const isMotorbike = vehicleType.toUpperCase() === "MOTORBIKE";
    axiosClient
      .get(
        `vehicle-purpose-category?vehicle_purpose=${encodeURIComponent(form.vehiclePurpose)}${isMotorbike ? "&is_motorbike=true" : ""}`,
      )
      .then((res) => setPurposeCategories(res.data.categories ?? []))
      .catch(() => {
        setPurposeCategories([]);
        toast.error("Could not load purpose categories. Please try again.");
      })
      .finally(() => setLoadingCategories(false));
  }, [form.vehiclePurpose, vehicleType]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "make") {
      const entry = modelMakeMap.find((m) => m.make === value);
      setModels(entry?.models ?? []);
      setForm((prev) => ({ ...prev, make: value, model: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    handleChange({
      target: { name, value },
    } as React.ChangeEvent<HTMLSelectElement>);
  };

  const isValid = () =>
    !!(
      form.engineCapacity &&
      form.engineNumber &&
      form.vehicleNumber &&
      form.chassisNumber &&
      form.make &&
      form.model &&
      form.year &&
      form.bodyType &&
      form.vehiclePurpose &&
      form.vehiclePurposeCategory &&
      vehicleValue &&
      Number(vehicleValue) > 0 &&
      !vehicleValueError
    );

  const vehicleValueError = getVehicleValueLimitError(vehicleValue);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (vehicleValueError) {
      toast.error(vehicleValueError);
      return;
    }

    setSubmitting(true);

    const ntsaRaw = sessionStorage.getItem("dashboard-vehicle-search");
    const ntsaData = ntsaRaw ? JSON.parse(ntsaRaw) : null;
    const isNtsa = !!ntsaData?.vehicle;

    const payload = {
      source: isNtsa ? "NTSA" : "",
      vehicle: {
        chassis_number: form.chassisNumber.trim(),
        registration_number: form.vehicleNumber.trim(),
        make: form.make.trim(),
        model: form.model.trim(),
        engine_capacity: form.engineCapacity
          ? Number(form.engineCapacity)
          : null,
        engine_number: form.engineNumber?.trim() || undefined,
        body_type: form.bodyType.trim(),
        vehicle_value: vehicleValue ? Number(vehicleValue) : null,
        seating_capacity: seatingCapacity ? Number(seatingCapacity) : null,
        tonnage: tonnage ? Number(tonnage) : null,
        vehicle_type: vehicleType,
        year_of_manufacture: Number(form.year),
        purpose: form.vehiclePurpose?.trim() || undefined,
        purpose_type: form.vehiclePurposeCategory
          ? Number(form.vehiclePurposeCategory)
          : null,
      },
    };

    try {
      await axiosAuthClient.post("vehicle/new", payload);
      sessionStorage.removeItem("dashboard-vehicle-search");
      toast.success("Vehicle saved successfully.");
      router.push("/dashboard?tab=vehicle");
      router.refresh();
    } catch {
      toast.error("Failed to save vehicle. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border border-[#d7e8ee] shadow-sm overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 bg-primary/5 rounded-xl p-4">
              <div className="p-2.5 bg-white rounded-xl shadow-sm shrink-0">
                <Car className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-[#1e3a5f] text-sm">
                  Vehicle Details
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Review and complete your vehicle information.
                </p>
              </div>
            </div>

            {/* Identification */}
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
                Identification
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="vehicleNumber">
                    Vehicle Number <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id="vehicleNumber"
                    name="vehicleNumber"
                    value={form.vehicleNumber}
                    onChange={handleChange}
                    placeholder="e.g. KAA 123A"
                    required
                    disabled={isFieldsDisabled}
                    readOnly={isFieldsDisabled}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="chassisNumber">
                    Chassis Number <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id="chassisNumber"
                    name="chassisNumber"
                    value={form.chassisNumber}
                    onChange={handleChange}
                    placeholder="Chassis Number"
                    required
                    disabled={isFieldsDisabled}
                  />
                </Field>
              </div>
            </div>

            {/* Vehicle Specs */}
            <div className="border-t border-[#d7e8ee] pt-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
                Vehicle Specs
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Field>
                  <FieldLabel>
                    Make <span className="text-red-500">*</span>
                  </FieldLabel>
                  {isFieldsDisabled ? (
                    <Input
                      value={form.make}
                      readOnly
                      disabled
                      className="bg-[#f0f6f9]"
                    />
                  ) : (
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
                  )}
                </Field>
                <Field>
                  <FieldLabel>
                    Model <span className="text-red-500">*</span>
                  </FieldLabel>
                  {isFieldsDisabled ? (
                    <Input
                      value={form.model}
                      readOnly
                      disabled
                      className="bg-[#f0f6f9]"
                    />
                  ) : (
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
                  )}
                </Field>
                <Field>
                  <FieldLabel>
                    Year of Manufacture <span className="text-red-500">*</span>
                  </FieldLabel>
                  {isFieldsDisabled ? (
                    <Input
                      value={form.year}
                      readOnly
                      disabled
                      className="bg-[#f0f6f9]"
                    />
                  ) : (
                    <Select
                      onValueChange={(v) => handleSelectChange("year", v)}
                      value={form.year}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Year of manufacture" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: YEAR_RANGE }, (_, i) => {
                          const year = CURRENT_YEAR - i;
                          return (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  )}
                </Field>
                <Field>
                  <FieldLabel>
                    Body Type <span className="text-red-500">*</span>
                  </FieldLabel>
                  {isFieldsDisabled ? (
                    <Input
                      value={form.bodyType}
                      readOnly
                      disabled
                      className="bg-[#f0f6f9]"
                    />
                  ) : (
                    <Select
                      onValueChange={(v) => handleSelectChange("bodyType", v)}
                      value={form.bodyType}
                    >
                      <SelectTrigger>
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
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="engineCapacity">
                    Engine Capacity <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id="engineCapacity"
                    name="engineCapacity"
                    value={form.engineCapacity}
                    onChange={handleChange}
                    placeholder="e.g. 1800CC"
                    required
                    disabled={isFieldsDisabled}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="engineNumber">
                    Engine Number <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id="engineNumber"
                    name="engineNumber"
                    value={form.engineNumber}
                    onChange={handleChange}
                    placeholder="Engine Number"
                    disabled={isFieldsDisabled && !!form.engineNumber}
                    readOnly={isFieldsDisabled && !!form.engineNumber}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="seatingCapacity">
                    Seating Capacity
                  </FieldLabel>
                  <Input
                    id="seatingCapacity"
                    type="number"
                    min={1}
                    value={seatingCapacity}
                    onChange={(e) => setSeatingCapacity(e.target.value)}
                    placeholder="e.g. 5"
                    disabled={isFieldsDisabled}
                    readOnly={isFieldsDisabled}
                  />
                </Field>
              </div>
            </div>

            {/* Valuation */}
            <div className="border-t border-[#d7e8ee] pt-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
                Valuation
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Field>
                  <FieldLabel htmlFor="vehicleValue">
                    Vehicle Value (KES) <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id="vehicleValue"
                    type="number"
                    min={0}
                    max={MAX_VEHICLE_VALUE}
                    value={vehicleValue}
                    aria-invalid={Boolean(vehicleValueError)}
                    onChange={(e) => setVehicleValue(e.target.value)}
                    placeholder="e.g. 800000"
                  />
                  <FieldError>{vehicleValueError}</FieldError>
                </Field>
                {form.vehiclePurpose.toUpperCase() === "COMMERCIAL" && (
                  <Field>
                    <FieldLabel htmlFor="tonnage">Tonnage</FieldLabel>
                    <Input
                      id="tonnage"
                      type="number"
                      min={0}
                      step="0.1"
                      value={tonnage}
                      onChange={(e) => setTonnage(e.target.value)}
                      placeholder="e.g. 3.5"
                    />
                  </Field>
                )}
              </div>
            </div>

            {/* Purpose */}
            <div className="border-t border-[#d7e8ee] pt-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
                Purpose
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="vehiclePurpose">
                    Vehicle Purpose <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id="vehiclePurpose"
                    name="vehiclePurpose"
                    value={form.vehiclePurpose}
                    onChange={handleChange}
                    placeholder="e.g. PSV, Private"
                    required
                    disabled={isFieldsDisabled && !!form.vehiclePurpose}
                    readOnly={isFieldsDisabled && !!form.vehiclePurpose}
                  />
                </Field>
                <Field>
                  <FieldLabel>
                    Purpose Category <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select
                    onValueChange={(v) =>
                      handleSelectChange("vehiclePurposeCategory", v)
                    }
                    value={form.vehiclePurposeCategory}
                    disabled={
                      !form.vehiclePurpose ||
                      loadingCategories ||
                      purposeCategories.length === 0
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          loadingCategories
                            ? "Loading…"
                            : !form.vehiclePurpose
                              ? "Enter purpose first"
                              : "Select category"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {purposeCategories.map((cat) => (
                        <SelectItem key={cat.code} value={cat.code.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-[#d7e8ee] text-[#1e3a5f] hover:bg-[#f0f6f9]"
                onClick={() => router.back()}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 text-white"
                disabled={!isValid() || submitting}
              >
                {submitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Save Vehicle"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
