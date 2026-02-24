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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Card, CardContent } from "./ui/card";
import { axiosClient } from "@/utilities/axios-client";
import { usePersonalDetailsStore } from "@/stores/personalDetailsStore";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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
  }, []);

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
      <Card
        className={`mx-auto mt-4 sm:mt-10 w-full bg-white/80 backdrop-blur-sm shadow-lg transition-all ${searchStatus === "idle" ? "max-w-md" : "max-w-3xl"
          }`}
      >
        <CardContent>
          {searchStatus === "idle" ? (
            <form onSubmit={searchVehicle}>
              <FieldGroup>
                <FieldSet>
                  <FieldLegend>Vehicle Search</FieldLegend>
                  <FieldDescription>
                    Enter your vehicle registration number.
                  </FieldDescription>
                  <Field>
                    <FieldLabel>Vehicle Number</FieldLabel>
                    <Input
                      value={vehicleRegNumber}
                      onChange={(e) => setVehicleRegNumber(e.target.value)}
                      required
                    />
                  </Field>
                </FieldSet>
              </FieldGroup>
              <Button
                type="submit"
                className="mt-4 w-full text-white"
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
            <form onSubmit={handleSubmit}>
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
                          disabled
                          readOnly
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
                          disabled={isFieldsDisabled}
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
                          readOnly={isFieldsDisabled}
                          placeholder="Vehicle Number"
                          required
                          disabled={isFieldsDisabled}
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
                          disabled={isFieldsDisabled}
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="vehicleMake">
                          Select Make
                        </FieldLabel>
                        {isFieldsDisabled ? (
                          <Input
                            value={form.make}
                            readOnly
                            disabled
                            className="bg-slate-50"
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
                          Vehicle Model
                        </FieldLabel>
                        {isFieldsDisabled ? (
                          <Input
                            value={form.model}
                            readOnly
                            disabled
                            className="bg-slate-50"
                          />
                        ) : (
                          <Select
                            onValueChange={(v) =>
                              handleSelectChange("model", v)
                            }
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
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="yearOfManufacture">
                          Year of Manufacture
                        </FieldLabel>
                        {isFieldsDisabled ? (
                          <Input
                            value={form.year}
                            readOnly
                            disabled
                            className="bg-slate-50"
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
                                    motorSubType?.underwriter_product
                                      .yom_range ?? 0,
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
                        )}
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="bodyType">Body Type</FieldLabel>
                        {isFieldsDisabled ? (
                          <Input
                            value={form.bodyType}
                            readOnly
                            disabled
                            className="bg-slate-50"
                          />
                        ) : (
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
                        )}
                      </Field>
                    </div>
                    {/* Engine Number & Vehicle Purpose */}
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="engineNumber">
                          Engine Number
                        </FieldLabel>
                        <Input
                          id="engineNumber"
                          type="text"
                          name="engineNumber"
                          value={form.engineNumber}
                          onChange={handleChange}
                          placeholder="Engine Number"
                          required
                          disabled={isFieldsDisabled && !!form.engineNumber}
                          readOnly={isFieldsDisabled && !!form.engineNumber}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="vehiclePurpose">
                          Vehicle Purpose
                        </FieldLabel>
                        <Input
                          id="vehiclePurpose"
                          type="text"
                          name="vehiclePurpose"
                          value={form.vehiclePurpose}
                          onChange={handleChange}
                          placeholder="e.g. PSV, Private"
                          required
                          disabled={isFieldsDisabled && !!form.vehiclePurpose}
                          readOnly={isFieldsDisabled && !!form.vehiclePurpose}
                        />
                      </Field>
                    </div>

                    {/* Vehicle Purpose Category */}
                    <div className="grid grid-cols-2 gap-4 mt-0">
                      <Field>
                        <FieldLabel htmlFor="vehiclePurposeCategory">
                          Vehicle Purpose Category
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
                                  ? "Loading categories…"
                                  : !form.vehiclePurpose
                                    ? "Enter vehicle purpose first"
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

                    <div className="flex justify-between mt-4">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={cancelAction}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={!validDetails()}>
                        Next
                      </Button>
                    </div>
                  </FieldGroup>
                </FieldSet>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleDetails;
