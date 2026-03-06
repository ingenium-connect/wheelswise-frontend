"use client";
import { useInsuranceStore } from "@/stores/insuranceStore";

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
import { Field, FieldLabel } from "@/components/ui/field";
import { Card, CardContent } from "./ui/card";
import { axiosClient } from "@/utilities/axios-client";
import { usePersonalDetailsStore } from "@/stores/personalDetailsStore";
import { toast } from "sonner";
import { Car, Loader2, Search } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { useVehicleStore } from "@/stores/vehicleStore";

type Props = {
  motor_type: string | undefined;
  product_type: string | undefined;
  modelMakeMap: { make: string; models: string[] }[];
};

type SearchStatus = "idle" | "success" | "error";

const VehicleDetails = ({ modelMakeMap, motor_type, product_type }: Props) => {
  const router = useRouter();

  const vehicleValue = useInsuranceStore((s) => s.vehicleValue);
  const motorSubType = useInsuranceStore((s) => s.motorSubtype);
  const setCoverStep = useInsuranceStore((s) => s.setCoverStep);

  const { setVehicleDetails } = useVehicleStore();
  const { setPersonalDetails } = usePersonalDetailsStore();

  const [models, setModels] = useState<string[]>([]);
  const [bodyTypes, setBodyTypes] = useState<string[]>([]);
  const [purposeCategories, setPurposeCategories] = useState<
    { code: number; name: string }[]
  >([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [vehicleRegNumber, setVehicleRegNumber] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchStatus, setSearchStatus] = useState<SearchStatus>("idle");
  const [searchMessage, setSearchMessage] = useState("");
  const [isFieldsDisabled, setIsFieldsDisabled] = useState(false);

  const currentYear = new Date().getFullYear();

  const [form, setForm] = useState({
    vehicleValue: vehicleValue,
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
      .then((res) => {
        setBodyTypes(res.data);
      })
      .catch((err) => {
        console.error(err);
      });

    setCoverStep(4);
  }, [setCoverStep]);

  // Fetch purpose categories whenever vehiclePurpose changes
  useEffect(() => {
    if (!form.vehiclePurpose) {
      setPurposeCategories([]);
      return;
    }
    setLoadingCategories(true);
    axiosClient
      .get(
        `vehicle-purpose-category?vehicle_purpose=${encodeURIComponent(form.vehiclePurpose)}`,
      )
      .then((res) => {
        setPurposeCategories(res.data.categories ?? []);
      })
      .catch((err) => {
        console.error(err);
        setPurposeCategories([]);
      })
      .finally(() => setLoadingCategories(false));
  }, [form.vehiclePurpose]);

  const validDetails = () => {
    return (
      form.vehicleValue > 0 &&
      form.engineCapacity &&
      form.engineNumber &&
      form.vehicleNumber &&
      form.chassisNumber &&
      form.make &&
      form.model &&
      form.year &&
      form.bodyType &&
      form.vehiclePurpose &&
      form.vehiclePurposeCategory
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });

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

  const searchVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSearch(true);

    try {
      const res = await axiosClient.get(
        `vehicle/search?vehicle_registration_number=${vehicleRegNumber.replace(
          / /g,
          "",
        )}`,
      );

      const { vehicle, owner, regNo } = res.data;

      if (!vehicle) {
        setIsFieldsDisabled(false);
        reset();

        setVehicleDetails({ ntsaRegistered: false });

        setPersonalDetails({
          firstName: "",
          lastName: "",
          phoneNumber: "",
          idNumber: "",
          kraPin: "",
          ntsaRegistered: false,
        });

        throw new Error("Vehicle not found");
      }

      const vehicleYear = parseInt(vehicle.yearOfManufacture);
      const maxAgeAllowed = motorSubType?.underwriter_product.yom_range;

      setIsFieldsDisabled(true);
      if (maxAgeAllowed && vehicleYear) {
        const vehicleAge = currentYear - vehicleYear;

        if (vehicleAge > maxAgeAllowed) {
          setSearchStatus("error");
          setSearchMessage(
            `Vehicle is too old (${vehicleAge} years). The maximum allowed age for this cover is ${maxAgeAllowed} years. Kindly select a different product`,
          );
          toast.error("Vehicle exceeds age limit");
          setLoadingSearch(false);
          setTimeout(() => {
            router.back();
          }, 3000);
          return; // Prevent the form from populating
        }
      }

      // 1. Find the Make in your map using case-insensitive search
      const matchingMakeEntry = modelMakeMap.find(
        (m) => m.make.toLowerCase() === vehicle.carMake?.toLowerCase(),
      );

      // 2. Determine the correctly cased Make and populate Model list
      const correctlyCasedMake = matchingMakeEntry
        ? matchingMakeEntry.make
        : vehicle.carMake;

      const availableModels = matchingMakeEntry ? matchingMakeEntry.models : [];

      // Set the list of models for the dropdown options
      setModels(availableModels);

      const correctlyCasedModel =
        availableModels.find(
          (mod) => mod.toLowerCase() === vehicle.carModel?.toLowerCase(),
        ) || vehicle.carModel;

      // 3. Find correctly cased Body Type from your fetched bodyTypes list
      const correctlyCasedBodyType =
        bodyTypes.find(
          (bt) => bt.toLowerCase() === vehicle.bodyType?.toLowerCase(),
        ) || vehicle.bodyType;

      // 🔁 Populate models BEFORE setting form.model
      const modelMake = modelMakeMap.find((m) => m.make === vehicle.carMake);
      setModels(modelMake?.models ?? []);

      setForm((prev) => ({
        ...prev,
        engineCapacity: vehicle.engineCapacity || "",
        engineNumber: vehicle.engineNumber || "",
        vehicleNumber: regNo || "",
        chassisNumber: vehicle.ChassisNo || "",
        // Ensure the strings match exactly what is in your modelMakeMap
        make: correctlyCasedMake || "",
        model: correctlyCasedModel || "",
        year: vehicle.yearOfManufacture?.toString() || "",
        bodyType: correctlyCasedBodyType || "",
        vehiclePurpose: vehicle.purpose || "",
        vehiclePurposeCategory: "",
      }));

      setVehicleDetails({ ntsaRegistered: true });

      if (owner) {
        const ownerObj = owner[0];
        setPersonalDetails({
          firstName: ownerObj.FIRSTNAME || "",
          lastName: ownerObj.LASTNAME || ownerObj.FIRSTNAME || "",
          phoneNumber: ownerObj.TELNO || "",
          idNumber: ownerObj.ID_NUMBER || "",
          kraPin: ownerObj.PIN || "",
          ntsaRegistered: true,
        });
      }

      setSearchStatus("success");

      toast.success("Vehicle found");
    } catch (error) {
      reset();

      setVehicleDetails({ ntsaRegistered: false });

      setPersonalDetails({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        idNumber: "",
        kraPin: "",
        ntsaRegistered: false,
      });

      setSearchStatus("error");
      setSearchMessage(
        "Vehicle could not be found. Kindly enter the vehicle details manually.",
      );

      toast.error("Vehicle not found");
      console.error(error);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setVehicleDetails({ ...form });

    setTimeout(() => {
      toast.success("Vehicle details saved.", { duration: 2000 });
      reset();
      router.push(
        `/personal-details?product_type=${product_type}&motor_type=${motor_type}`,
      );
    }, 200);
  };

  const reset = () => {
    setForm({
      vehicleValue: vehicleValue,
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
    setPurposeCategories([]);
  };

  const cancelAction = () => {
    reset();
    router.back();
  };

  return (
    <div className="w-full">
      {searchStatus === "error" && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error Occured</AlertTitle>
          <AlertDescription>{searchMessage}</AlertDescription>
        </Alert>
      )}

      <Card className="w-full border border-[#d7e8ee] shadow-sm overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />
        <CardContent className="p-6">

          {/* Search state */}
          {searchStatus === "idle" ? (
            <form onSubmit={searchVehicle} className="space-y-5">
              <div className="flex items-center gap-3 bg-primary/5 rounded-xl p-4">
                <div className="p-2.5 bg-white rounded-xl shadow-sm shrink-0">
                  <Search className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-[#1e3a5f] text-sm">Search by Registration</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Enter your vehicle registration number to auto-fill details.</p>
                </div>
              </div>
              <Field>
                <FieldLabel htmlFor="vehicleReg">Vehicle Registration Number</FieldLabel>
                <Input
                  id="vehicleReg"
                  value={vehicleRegNumber}
                  onChange={(e) => setVehicleRegNumber(e.target.value)}
                  placeholder="e.g. KAA 123A"
                  required
                />
              </Field>
              <Button type="submit" className="w-full text-white" disabled={loadingSearch}>
                {loadingSearch ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Search Vehicle"}
              </Button>
            </form>
          ) : (

            /* Details form */
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Header */}
              <div className="flex items-center gap-3 bg-primary/5 rounded-xl p-4">
                <div className="p-2.5 bg-white rounded-xl shadow-sm shrink-0">
                  <Car className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-[#1e3a5f] text-sm">Vehicle Details</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Enter your vehicle details manually.</p>
                </div>
              </div>

              {/* Section: Identification */}
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">Identification</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Field>
                    <FieldLabel htmlFor="vehicleNumber">Vehicle Number</FieldLabel>
                    <Input
                      id="vehicleNumber"
                      name="vehicleNumber"
                      type="text"
                      value={form.vehicleNumber}
                      onChange={handleChange}
                      placeholder="e.g. KAA 123A"
                      required
                      disabled={isFieldsDisabled}
                      readOnly={isFieldsDisabled}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="chassisNumber">Chassis Number</FieldLabel>
                    <Input
                      id="chassisNumber"
                      name="chassisNumber"
                      type="text"
                      value={form.chassisNumber}
                      onChange={handleChange}
                      placeholder="Chassis Number"
                      required
                      disabled={isFieldsDisabled}
                    />
                  </Field>
                </div>
              </div>

              {/* Section: Vehicle Specs */}
              <div className="border-t border-[#d7e8ee] pt-5">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">Vehicle Specs</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Field>
                    <FieldLabel htmlFor="vehicleMake">Make</FieldLabel>
                    {isFieldsDisabled ? (
                      <Input value={form.make} readOnly disabled className="bg-[#f0f6f9]" />
                    ) : (
                      <Select onValueChange={(v) => handleSelectChange("make", v)} value={form.make}>
                        <SelectTrigger><SelectValue placeholder="Select Make" /></SelectTrigger>
                        <SelectContent>
                          {modelMakeMap.map((m) => (
                            <SelectItem key={m.make} value={m.make}>{m.make}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="vehicleModel">Model</FieldLabel>
                    {isFieldsDisabled ? (
                      <Input value={form.model} readOnly disabled className="bg-[#f0f6f9]" />
                    ) : (
                      <Select onValueChange={(v) => handleSelectChange("model", v)} value={form.model}>
                        <SelectTrigger><SelectValue placeholder="Select Model" /></SelectTrigger>
                        <SelectContent>
                          {models.map((model) => (
                            <SelectItem key={model} value={model}>{model}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="yearOfManufacture">Year of Manufacture</FieldLabel>
                    {isFieldsDisabled ? (
                      <Input value={form.year} readOnly disabled className="bg-[#f0f6f9]" />
                    ) : (
                      <Select onValueChange={(v) => handleSelectChange("year", v)} value={form.year}>
                        <SelectTrigger><SelectValue placeholder="Year of manufacture" /></SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: motorSubType?.underwriter_product.yom_range ?? 0 }, (_, i) => {
                            const year = currentYear - i;
                            return <SelectItem key={year} value={year.toString()}>{year}</SelectItem>;
                          })}
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="bodyType">Body Type</FieldLabel>
                    {isFieldsDisabled ? (
                      <Input value={form.bodyType} readOnly disabled className="bg-[#f0f6f9]" />
                    ) : (
                      <Select onValueChange={(v) => handleSelectChange("bodyType", v)} value={form.bodyType}>
                        <SelectTrigger><SelectValue placeholder="Select body type" /></SelectTrigger>
                        <SelectContent>
                          {bodyTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="engineCapacity">Engine Capacity</FieldLabel>
                    <Input
                      id="engineCapacity"
                      name="engineCapacity"
                      type="text"
                      value={form.engineCapacity}
                      onChange={handleChange}
                      placeholder="e.g. 1800CC"
                      required
                      disabled={isFieldsDisabled}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="engineNumber">Engine Number</FieldLabel>
                    <Input
                      id="engineNumber"
                      name="engineNumber"
                      type="text"
                      value={form.engineNumber}
                      onChange={handleChange}
                      placeholder="Engine Number"
                      required
                      disabled={isFieldsDisabled && !!form.engineNumber}
                      readOnly={isFieldsDisabled && !!form.engineNumber}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="vehicleValue">Vehicle Value (KES)</FieldLabel>
                    <Input
                      id="vehicleValue"
                      name="vehicleValue"
                      value={form.vehicleValue}
                      disabled
                      readOnly
                      className="bg-[#f0f6f9]"
                    />
                  </Field>
                </div>
              </div>

              {/* Section: Purpose */}
              <div className="border-t border-[#d7e8ee] pt-5">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">Purpose</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Field>
                    <FieldLabel htmlFor="vehiclePurpose">Vehicle Purpose</FieldLabel>
                    <Input
                      id="vehiclePurpose"
                      name="vehiclePurpose"
                      type="text"
                      value={form.vehiclePurpose}
                      onChange={handleChange}
                      placeholder="e.g. PSV, Private"
                      required
                      disabled={isFieldsDisabled && !!form.vehiclePurpose}
                      readOnly={isFieldsDisabled && !!form.vehiclePurpose}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="vehiclePurposeCategory">Purpose Category</FieldLabel>
                    <Select
                      onValueChange={(v) => handleSelectChange("vehiclePurposeCategory", v)}
                      value={form.vehiclePurposeCategory}
                      disabled={!form.vehiclePurpose || loadingCategories || purposeCategories.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            loadingCategories ? "Loading…" : !form.vehiclePurpose ? "Enter purpose first" : "Select category"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {purposeCategories.map((cat) => (
                          <SelectItem key={cat.code} value={cat.code.toString()}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  type="button"
                  className="flex-1 border-[#d7e8ee] text-[#1e3a5f] hover:bg-[#f0f6f9]"
                  onClick={cancelAction}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 text-white" disabled={!validDetails()}>
                  Next
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleDetails;
