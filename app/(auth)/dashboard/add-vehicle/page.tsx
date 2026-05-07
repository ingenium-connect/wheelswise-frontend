"use client";

import FlowStepHeader from "@/components/layout/FlowStepHeader";
import VehicleDetails from "@/components/VehicleDetails";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  getVehicleValueLimitError,
  MAX_VEHICLE_VALUE,
} from "@/utilities/validation-schemas";
import { useInsuranceStore } from "@/stores/insuranceStore";
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AddVehiclePage() {
  const vehicleValue = useInsuranceStore((s) => s.vehicleValue);
  const setVehicleValue = useInsuranceStore((s) => s.setVehicleValue);
  const vehicleValueError = getVehicleValueLimitError(vehicleValue);
  const [motorType, setMotorType] = useState<string | undefined>(undefined);
  const [showSearch, setShowSearch] = useState(false);

  const MOTOR_TYPES = [
    { value: "PRIVATE", label: "Private" },
    { value: "COMMERCIAL", label: "Commercial" },
    { value: "PSV", label: "PSV (Public Service Vehicle)" },
    { value: "MOTORBIKE", label: "Motorbike" },
  ] as const;

  const showNextSection = () => {
    if (!motorType || !vehicleValue || vehicleValueError || vehicleValue < 0) {
      toast.error(
        "Please select a motor type and enter a valid vehicle value.",
      );
      return;
    }

    setShowSearch(true);
  };

  return (
    <>
      <FlowStepHeader
        title="Add Vehicle"
        subtitle="Search your vehicle by registration number to get started."
      />
      <div className="mt-4">
        {showSearch ? (
          <div className="max-w-2xl mx-auto">
            <VehicleDetails motor_type={motorType} isAddVehicleOnly={true} />
          </div>
        ) : (
          <Card className="border border-[#d7e8ee] shadow-sm overflow-hidden w-full max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className=" gap-4">
                <Field>
                  <FieldLabel htmlFor="vehicleValue">
                    Vehicle Value (KES) <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id="vehicleValue"
                    type="number"
                    min={0}
                    max={MAX_VEHICLE_VALUE}
                    aria-invalid={Boolean(vehicleValueError)}
                    onChange={(e) => setVehicleValue(Number(e.target.value))}
                    placeholder="e.g. 800000"
                  />
                  <FieldError>{vehicleValueError}</FieldError>
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="motorType">Motor Type</FieldLabel>
                <Select value={motorType} onValueChange={setMotorType} required>
                  <SelectTrigger id="motorType">
                    <SelectValue placeholder="Select motor type" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOTOR_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={showNextSection}>Next</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </>
  );
}
