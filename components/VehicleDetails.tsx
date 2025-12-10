"use client";
import { useInsuranceStore } from "@/store/store";

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
import { useVehicleDetailsStore } from "@/stores/vehicleDetailsStore";

type Props = {
  motor_type: string | undefined;
  product_type: string | undefined;
  modelMakeMap: { make: string; models: string[] }[];
};

const VehicleDetails = ({ modelMakeMap, motor_type, product_type }: Props) => {
  const router = useRouter();
  const { setVehicleDetails } = useVehicleDetailsStore();
  const vehicleValue = useInsuranceStore((store) => store.vehicleValue);
  const motorSubType = useInsuranceStore((store) => store.motorSubtype);
  const setCoverStep = useInsuranceStore((state) => state.setCoverStep);

  const [models, setModels] = useState<string[]>([]);

  const [form, setForm] = useState({
    vehicleValue: vehicleValue,
    engineCapacity: "",
    vehicleNumber: "",
    chassisNumber: "",
    make: "",
    model: "",
    year: "",
  });

  useEffect(() => {
    setCoverStep(4);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setVehicleDetails({ ...form });

    router.push(
      `/personal-details?product_type=${product_type}&motor_type=${motor_type}`
    );
  };

  return (
    <div className="w-full">
      <Card>
        <CardContent>
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
                        type="text"
                        name="vehicleNumber"
                        value={form.vehicleNumber}
                        onChange={handleChange}
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

                  <div className="grid grid-cols-3 gap-4">
                    <Field>
                      <FieldLabel htmlFor="vehicleMake">Select Make</FieldLabel>
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
                              const year = new Date().getFullYear() - i;
                              return (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              );
                            }
                          )}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                  <Field orientation="horizontal">
                    <Button type="submit">Submit</Button>
                    <Button variant="outline" type="button">
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
  );
};

export default VehicleDetails;
