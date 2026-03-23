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
import { AlertTriangle, ArrowLeft, Car, Loader2, Search } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { useVehicleStore } from "@/stores/vehicleStore";

type Props = {
  motor_type: string | undefined;
  product_type: string | undefined;
  modelMakeMap: { make: string; models: string[] }[];
};

type SearchStatus = "idle" | "success" | "error" | "mismatch";

const VehicleDetails = ({ modelMakeMap, motor_type, product_type }: Props) => {
  const router = useRouter();

  const vehicleValue = useInsuranceStore((s) => s.vehicleValue);
  const motorSubType = useInsuranceStore((s) => s.motorSubtype);
  const setCoverStep = useInsuranceStore((s) => s.setCoverStep);
  const cover = useInsuranceStore((s) => s.cover);
  const selectCover = useInsuranceStore((s) => s.selectCover);
  const resetInsuranceStore = useInsuranceStore((s) => s.reset);

  const { tonnage, setVehicleDetails, setSeatingCapacity: storeSetSeatingCapacity, reset: resetVehicleStore } = useVehicleStore();
  const motorType = useInsuranceStore((s) => s.motorType);
  const { setPersonalDetails, resetPersonalDetails } = usePersonalDetailsStore();
  const [seatingCapacity, setSeatingCapacity] = useState("");

  const isCommercial = motorType?.name === "COMMERCIAL";

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
    vehicleType: "",
  });

  useEffect(() => {
    axiosClient
      .get("vehicle/body-type")
      .then((res) => {
        setBodyTypes(res.data);
      })
      .catch(() => {
        toast.error("Could not load vehicle body types. Please refresh the page.");
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
      .catch(() => {
        setPurposeCategories([]);
        toast.error("Could not load purpose categories. Please try again.");
      })
      .finally(() => setLoadingCategories(false));
  }, [form.vehiclePurpose]);

  const isThirdParty = product_type === "THIRD_PARTY";

  /**
   * Returns true if the NTSA vehicleType is compatible with the selected motor type.
   *
   * NTSA vehicleType values:
   *   Motor vehicles : "MOTOR", "MOTOR VEHICLE", "MOTORVEHICLE"
   *   Motorbikes     : "MOTOR CYCLES", "MOTORCYCLE", "MOTORBIKE"
   *
   * Motor type → expected category:
   *   MOTORBIKE  → must be a motorbike type
   *   All others → must be a motor vehicle type
   */
  const vehicleTypeMatchesMotorType = (
    vehicleType: string,
    selectedMotorType: string,
  ): boolean => {
    const vt = vehicleType.toLowerCase().replace(/[\s-]/g, "");
    const isMotorbike =
      vt === "motorcycles" ||
      vt === "motorcycle" ||
      vt === "motorbike" ||
      vt.includes("cycle");

    const selectedIsMotorbike = selectedMotorType.toUpperCase() === "MOTORBIKE";

    return selectedIsMotorbike ? isMotorbike : !isMotorbike;
  };

  const validDetails = () => {
    return (
      (isThirdParty || form.vehicleValue > 0) &&
      form.engineCapacity &&
      form.engineNumber &&
      form.vehicleNumber &&
      form.chassisNumber &&
      form.make &&
      form.model &&
      form.year &&
      form.bodyType &&
      form.vehicleType &&
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

      // 1. Validate vehicleType against selected motor type — checked first
      const rawVehicleType = vehicle.vehicleType || "";

      if (motor_type && rawVehicleType) {
        const typeIsValid = vehicleTypeMatchesMotorType(rawVehicleType, motor_type);

        if (!typeIsValid) {
          const savedCover = cover;

          resetInsuranceStore();
          resetVehicleStore();
          resetPersonalDetails();

          if (savedCover) selectCover(savedCover);

          setSearchStatus("mismatch");
          setSearchMessage(
            `This vehicle is registered as "${rawVehicleType}" with NTSA, which is not compatible with the selected motor type. Please select the correct motor type to continue.`,
          );
          setLoadingSearch(false);
          setTimeout(() => {
            router.push(`/motor-type/${product_type}`);
          }, 4000);
          return;
        }
      }

      // 2. Check vehicle age against cover's allowed YOM range
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
          toast.error("Vehicle too old for this cover", { description: `Maximum allowed age is ${maxAgeAllowed} years.` });
          setLoadingSearch(false);
          setTimeout(() => {
            router.back();
          }, 3000);
          return;
        }
      }

      // 3. Find the Make in your map using case-insensitive search
      const matchingMakeEntry = modelMakeMap.find(
        (m) => m.make.toLowerCase() === vehicle.carMake?.toLowerCase(),
      );

      // 4. Determine the correctly cased Make and populate Model list
      const correctlyCasedMake = matchingMakeEntry
        ? matchingMakeEntry.make
        : vehicle.carMake;

      const availableModels = matchingMakeEntry ? matchingMakeEntry.models : [];

      setModels(availableModels);

      const correctlyCasedModel =
        availableModels.find(
          (mod) => mod.toLowerCase() === vehicle.carModel?.toLowerCase(),
        ) || vehicle.carModel;

      // 5. Find correctly cased Body Type from your fetched bodyTypes list
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
        make: correctlyCasedMake || "",
        model: correctlyCasedModel || "",
        year: vehicle.yearOfManufacture?.toString() || "",
        bodyType: correctlyCasedBodyType || "",
        vehiclePurpose: vehicle.purpose || "",
        vehiclePurposeCategory: "",
        vehicleType: rawVehicleType,
      }));

      const seats = vehicle.passengerCapacity || vehicle.seatingCapacity;
      if (seats) {
        setSeatingCapacity(seats.toString());
      }

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

      setIsFieldsDisabled(true);
      setSearchStatus("error");
      setSearchMessage(
        "Vehicle not found. Please go back and enter a valid vehicle registration number.",
      );

      toast.error("Vehicle not found", { description: "Please enter a valid registration number and try again." });
      console.error(error);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // default behaviour: save to store and navigate
    setVehicleDetails({ ...form });
    if (seatingCapacity) {
      storeSetSeatingCapacity(seatingCapacity);
    }

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
      vehicleType: "",
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
          <AlertTitle>Vehicle Not Found</AlertTitle>
          <AlertDescription>{searchMessage}</AlertDescription>
        </Alert>
      )}

      {searchStatus === "mismatch" && (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 flex gap-4">
          <div className="shrink-0 mt-0.5">
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-amber-900 text-sm">
              Motor type doesn&apos;t match
            </p>
            <p className="text-amber-800 text-sm mt-1 leading-relaxed">
              {searchMessage}
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-amber-700">
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
              <span>Taking you back to motor type selection…</span>
            </div>
          </div>
        </div>
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
                  <p className="font-semibold text-[#1e3a5f] text-sm">
                    Search by Registration
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Enter your vehicle registration number to auto-fill details.
                  </p>
                </div>
              </div>
              <Field>
                <FieldLabel htmlFor="vehicleReg">
                  Vehicle Registration Number
                </FieldLabel>
                <Input
                  id="vehicleReg"
                  value={vehicleRegNumber}
                  onChange={(e) => setVehicleRegNumber(e.target.value)}
                  placeholder="e.g. KAA 123A"
                  required
                />
              </Field>
              <Button
                type="submit"
                className="w-full text-white"
                disabled={loadingSearch}
              >
                {loadingSearch ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Search Vehicle"
                )}
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
                  <p className="font-semibold text-[#1e3a5f] text-sm">
                    Vehicle Details
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Enter your vehicle details manually.
                  </p>
                </div>
              </div>

              {/* Section: Identification */}
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
                  Identification
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="vehicleNumber">
                      Vehicle Number
                    </FieldLabel>
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
                    <FieldLabel htmlFor="chassisNumber">
                      Chassis Number
                    </FieldLabel>
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
                  <Field>
                    <FieldLabel htmlFor="vehicleType">
                      Vehicle Type
                    </FieldLabel>
                    <Input
                      id="vehicleType"
                      name="vehicleType"
                      type="text"
                      value={form.vehicleType}
                      onChange={handleChange}
                      placeholder="e.g. Motor Vehicle"
                      required
                      disabled={isFieldsDisabled && !!form.vehicleType}
                      readOnly={isFieldsDisabled && !!form.vehicleType}
                      className={isFieldsDisabled && !!form.vehicleType ? "bg-[#f0f6f9]" : ""}
                    />
                  </Field>
                </div>
              </div>

              {/* Section: Vehicle Specs */}
              <div className="border-t border-[#d7e8ee] pt-5">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
                  Vehicle Specs
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Field>
                    <FieldLabel htmlFor="vehicleMake">Make</FieldLabel>
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
                    <FieldLabel htmlFor="vehicleModel">Model</FieldLabel>
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
                    <FieldLabel htmlFor="yearOfManufacture">
                      Year of Manufacture
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
                          {Array.from(
                            {
                              length:
                                motorSubType?.underwriter_product.yom_range ??
                                0,
                            },
                            (_, i) => {
                              const year = currentYear - i;
                              return (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              );
                            },
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="bodyType">Body Type</FieldLabel>
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
                      Engine Capacity
                    </FieldLabel>
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
                    <FieldLabel htmlFor="engineNumber">
                      Engine Number
                    </FieldLabel>
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
                  {!isThirdParty && (
                    <Field>
                      <FieldLabel htmlFor="vehicleValue">
                        Vehicle Value (KES)
                      </FieldLabel>
                      <Input
                        id="vehicleValue"
                        name="vehicleValue"
                        value={form.vehicleValue}
                        disabled
                        readOnly
                        className="bg-[#f0f6f9]"
                      />
                    </Field>
                  )}
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
                    />
                  </Field>
                  {isCommercial && tonnage > 0 && (
                    <Field>
                      <FieldLabel htmlFor="tonnage">
                        Tonnage (tonnes)
                      </FieldLabel>
                      <Input
                        id="tonnage"
                        type="number"
                        value={tonnage}
                        disabled
                        readOnly
                        className="bg-[#f0f6f9]"
                      />
                    </Field>
                  )}
                </div>
              </div>

              {/* Section: Purpose */}
              <div className="border-t border-[#d7e8ee] pt-5">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
                  Purpose
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="vehiclePurpose">
                      Vehicle Purpose
                    </FieldLabel>
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
                    <FieldLabel htmlFor="vehiclePurposeCategory">
                      Purpose Category
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
                          <SelectItem
                            key={cat.code}
                            value={cat.code.toString()}
                          >
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
                  variant="outline"
                  type="button"
                  className="flex-1 border-[#d7e8ee] text-[#1e3a5f] hover:bg-[#f0f6f9]"
                  onClick={cancelAction}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 text-white"
                  disabled={!validDetails()}
                >
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
