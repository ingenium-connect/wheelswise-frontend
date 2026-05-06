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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Card, CardContent } from "./ui/card";
import { axiosClient } from "@/utilities/axios-client";
import { usePersonalDetailsStore } from "@/stores/personalDetailsStore";
import { toast } from "sonner";
import {
  AlertCircle,
  Car,
  Loader2,
  LucideUser,
  LucideUsers,
  Search,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { useVehicleStore } from "@/stores/vehicleStore";
import { useUserStore } from "@/stores/userStore";
import { ACCESS_TOKEN } from "@/utilities/constants";
import { getVehicleValueLimitError } from "@/utilities/validation-schemas";
import { AxiosError } from "axios";

type Props = {
  motor_type: string | undefined;
  product_type: string | undefined;
  modelMakeMap: { make: string; models: string[] }[];
};

type SearchStatus = "idle" | "success" | "error";
const MOTOR_TYPE_REDIRECT_DELAY_SECONDS = 5;

const VehicleDetails = ({ modelMakeMap, motor_type, product_type }: Props) => {
  const router = useRouter();

  const vehicleValue = useInsuranceStore((s) => s.vehicleValue);
  const motorSubType = useInsuranceStore((s) => s.motorSubtype);
  const isCoOwned = useInsuranceStore((s) => s.isCoOwned);
  const setCoverStep = useInsuranceStore((s) => s.setCoverStep);
  const setIsCoOwned = useInsuranceStore((s) => s.setisCoOwned);

  const {
    tonnage,
    setVehicleDetails,
    setSeatingCapacity: storeSetSeatingCapacity,
  } = useVehicleStore();
  const motorType = useInsuranceStore((s) => s.motorType);
  const { setPersonalDetails, resetPersonalDetails } =
    usePersonalDetailsStore();
  const resetVehicleStore = useVehicleStore((s) => s.reset);
  const profile = useUserStore((s) => s.profile);
  const [seatingCapacity, setSeatingCapacity] = useState("");
  const [motorTypeMismatch, setMotorTypeMismatch] = useState<string | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(
    null,
  );

  // Detect if user is logged in (has auth token cookie + profile)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    try {
      const cookies = document.cookie.split("; ").map((c) => c.trim());
      const tokenCookie = cookies.find((c) => c.startsWith(`${ACCESS_TOKEN}=`));
      setIsAuthenticated(
        Boolean(tokenCookie && tokenCookie.split("=")[1] && profile),
      );
    } catch {
      // ignore
    }
  }, [profile]);

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
  });

  useEffect(() => {
    axiosClient
      .get("vehicle/body-type")
      .then((res) => {
        setBodyTypes(res.data);
      })
      .catch(() => {
        toast.error(
          "Could not load vehicle body types. Please refresh the page.",
        );
      });

    setCoverStep(4);
  }, [setCoverStep]);

  useEffect(() => {
    if (!motorTypeMismatch) {
      setRedirectCountdown(null);
      return;
    }

    setRedirectCountdown(MOTOR_TYPE_REDIRECT_DELAY_SECONDS);

    const countdownInterval = window.setInterval(() => {
      setRedirectCountdown((current) => {
        if (current === null || current <= 1) {
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    const redirectTimeout = window.setTimeout(() => {
      router.push(`/motor-type/${product_type}`);
    }, MOTOR_TYPE_REDIRECT_DELAY_SECONDS * 1000);

    return () => {
      window.clearInterval(countdownInterval);
      window.clearTimeout(redirectTimeout);
    };
  }, [motorTypeMismatch, product_type, router]);

  // Fetch purpose categories whenever vehiclePurpose changes
  useEffect(() => {
    if (!form.vehiclePurpose) {
      setPurposeCategories([]);
      return;
    }
    setLoadingCategories(true);
    const isMotorbike =
      motorType?.name?.toUpperCase() === "MOTORBIKE" ||
      motor_type?.toUpperCase() === "MOTORBIKE";
    const purposeUrl = `vehicle-purpose-category?vehicle_purpose=${encodeURIComponent(form.vehiclePurpose)}${isMotorbike ? "&is_motorbike=true" : ""}`;
    axiosClient
      .get(purposeUrl)
      .then((res) => {
        setPurposeCategories(res.data.categories ?? []);
      })
      .catch(() => {
        setPurposeCategories([]);
        toast.error("Could not load purpose categories. Please try again.");
      })
      .finally(() => setLoadingCategories(false));
  }, [form.vehiclePurpose, motor_type, motorType]);

  const isThirdParty = product_type === "THIRD_PARTY";
  const vehicleValueError = isThirdParty
    ? ""
    : getVehicleValueLimitError(form.vehicleValue);

  const validDetails = () => {
    return (
      (isThirdParty || form.vehicleValue > 0) &&
      !vehicleValueError &&
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
      isCoOwned !== null
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
        )}&motor_type=${motor_type}`,
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
          toast.error("Vehicle too old for this cover", {
            description: `Maximum allowed age is ${maxAgeAllowed} years.`,
          });
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
      // Handle motor type mismatch from backend
      if (error instanceof AxiosError && error.response?.data?.error) {
        const errorMessage = error.response.data.error as string;

        // Check if it's a motor type mismatch error
        if (
          errorMessage.toLowerCase().includes("motor type") ||
          errorMessage.toLowerCase().includes("please select")
        ) {
          setMotorTypeMismatch(errorMessage);
          setLoadingSearch(false);

          // Clear all persisted store data
          resetVehicleStore();
          resetPersonalDetails();
          return;
        }
      }

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

      toast.error("Vehicle not found", {
        description: "Please enter a valid registration number and try again.",
      });
      console.error(error);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (vehicleValueError) {
      toast.error(vehicleValueError);
      return;
    }

    // Save to store
    setVehicleDetails({ ...form });
    if (seatingCapacity) {
      storeSetSeatingCapacity(seatingCapacity);
    }

    if (isAuthenticated) {
      // Logged-in user: register vehicle and go to payment summary
      setSubmitting(true);
      const ntsaRegistered =
        useVehicleStore.getState().vehicleDetails.ntsaRegistered;
      const payload = {
        source: ntsaRegistered ? "NTSA" : "",
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
          vehicle_value: form.vehicleValue || null,
          seating_capacity: seatingCapacity ? Number(seatingCapacity) : null,
          tonnage: tonnage || null,
          vehicle_type: motor_type || "PRIVATE",
          year_of_manufacture: Number(form.year),
          purpose: form.vehiclePurpose?.trim() || undefined,
          purpose_type: form.vehiclePurposeCategory
            ? Number(form.vehiclePurposeCategory)
            : null,
        },
      };

      try {
        const res = await fetch("/api/vehicle/new", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error ?? "Failed to register vehicle");
        }
        toast.success("Vehicle registered successfully.");
        reset();
        router.push("/dashboard/payment-summary");
        router.refresh();
      } catch (err) {
        console.error("Vehicle registration failed:", err);
        toast.error("Failed to register vehicle. Please try again.");
      } finally {
        setSubmitting(false);
      }
    } else {
      // Guest user: continue to personal details
      setTimeout(() => {
        toast.success("Vehicle details saved.", { duration: 2000 });
        reset();
        router.push(
          `/personal-details?product_type=${product_type}&motor_type=${motor_type}`,
        );
      }, 200);
    }
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
      {motorTypeMismatch && (
        <Alert className="mb-4 border-amber-300 bg-amber-50 text-amber-900 [&>svg]:text-amber-600">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{motorTypeMismatch}</p>
            <p className="text-sm">
              We&apos;ll return you to motor type selection so you can choose
              the correct option for this vehicle.
            </p>
            <p className="text-xs font-medium">
              Redirecting in{" "}
              {redirectCountdown ?? MOTOR_TYPE_REDIRECT_DELAY_SECONDS} second
              {(redirectCountdown ?? MOTOR_TYPE_REDIRECT_DELAY_SECONDS) === 1
                ? ""
                : "s"}
              &hellip;
            </p>
          </AlertDescription>
        </Alert>
      )}

      {searchStatus === "error" && !motorTypeMismatch && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Vehicle Not Found</AlertTitle>
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
                  Vehicle Registration Number{" "}
                  <span className="text-red-500">*</span>
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
                      Vehicle Number <span className="text-red-500">*</span>
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
                      Chassis Number <span className="text-red-500">*</span>
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
                </div>
              </div>

              {/* Section: Vehicle Specs */}
              <div className="border-t border-[#d7e8ee] pt-5">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
                  Vehicle Specs
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Field>
                    <FieldLabel htmlFor="vehicleMake">
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
                    <FieldLabel htmlFor="vehicleModel">
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
                    <FieldLabel htmlFor="yearOfManufacture">
                      Year of Manufacture{" "}
                      <span className="text-red-500">*</span>
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
                    <FieldLabel htmlFor="bodyType">
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
                      Engine Number <span className="text-red-500">*</span>
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
                        aria-invalid={Boolean(vehicleValueError)}
                        className="bg-[#f0f6f9]"
                      />
                      <FieldError>{vehicleValueError}</FieldError>
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
                      disabled={isFieldsDisabled}
                      readOnly={isFieldsDisabled}
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
                      Vehicle Purpose <span className="text-red-500">*</span>
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
                      Purpose Category<span className="text-red-500">*</span>
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

              {/* section: ownership */}
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">
                  Vehicle ownership
                </p>

                <p>
                  Who is the registered owner of this vehicle?
                  <span className="text-red-500">*</span>
                </p>
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div
                      onClick={() => setIsCoOwned(false)}
                      className={`flex items-center gap-3 border border-primary p-4 rounded-md cursor-pointer ${isCoOwned === false && " bg-primary text-white"}`}
                    >
                      <LucideUser />
                      <p>I am the sole owner</p>
                    </div>
                    <div
                      onClick={() => setIsCoOwned(true)}
                      className={`flex items-center gap-3 border border-primary p-4 rounded-md cursor-pointer ${isCoOwned && " bg-primary text-white"}`}
                    >
                      <LucideUsers />
                      <p>
                        It is co-owned or under finance (e.g. Hire Purchase)
                      </p>
                    </div>
                  </div>
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
                  disabled={!validDetails() || submitting}
                >
                  {submitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Next"
                  )}
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
