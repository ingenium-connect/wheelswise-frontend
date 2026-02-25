"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useInsuranceStore } from "@/stores/insuranceStore";
import { useVehicleStore } from "@/stores/vehicleStore";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Car } from "lucide-react";

type Props = {
  motor_type: string | undefined;
  product_type: string | undefined;
};

const VehicleValue: React.FC<Props> = ({ product_type, motor_type }: Props) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const selectedMotorType = useInsuranceStore((store) => store.motorType);
  const vehicleValue = useInsuranceStore((store) => store.vehicleValue);
  const setVehicleValue = useInsuranceStore((state) => state.setVehicleValue);
  const setCoverStep = useInsuranceStore((state) => state.setCoverStep);

  const { seating_capacity, tonnage, setSeatingCapacity, setTonnage } =
    useVehicleStore();

  const [isCommercial] = useState(
    () => selectedMotorType?.name === "COMMERCIAL",
  );

  useEffect(() => {
    setCoverStep(2);
  }, [setCoverStep]);

  const handleContinue = () => {
    let isValid = true;

    if (
      !vehicleValue ||
      isNaN(Number(vehicleValue)) ||
      Number(vehicleValue) <= 0
    ) {
      isValid = false;
      setError("Please enter a valid numeric value for your vehicle.");
    } else if (
      selectedMotorType?.name === "PSV" &&
      (!seating_capacity || Number(seating_capacity) <= 0)
    ) {
      isValid = false;
      setError("Please enter a valid seating capacity.");
    } else if (isCommercial && (!tonnage || tonnage <= 0)) {
      isValid = false;
      setError("Please enter a valid tonnage.");
    }

    if (!isValid) return;

    setError("");
    router.push(
      `/motor-subtype?product_type=${product_type}&motor_type=${motor_type}`,
    );
  };

  return (
    <Card className="border border-[#d7e8ee] shadow-sm overflow-hidden">
      <div className="h-1.5 w-full bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 bg-primary/5 rounded-xl p-4 mb-6">
          <div className="p-2.5 bg-white rounded-xl shadow-sm shrink-0">
            <Car className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-[#1e3a5f]">Vehicle Information</p>
            {selectedMotorType && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Motor type:{" "}
                <span className="font-medium">{selectedMotorType.name}</span>
              </p>
            )}
          </div>
        </div>

        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="vehicleValue">
                  Vehicle Value (KES)
                </FieldLabel>
                <Input
                  id="vehicleValue"
                  type="number"
                  placeholder="e.g. 800000"
                  defaultValue={vehicleValue}
                  onChange={(e) => setVehicleValue(Number(e.target.value))}
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
                  placeholder="e.g. 5"
                  value={seating_capacity}
                  onChange={(e) => setSeatingCapacity(e.target.value)}
                  required
                />
              </Field>
              {isCommercial && (
                <Field>
                  <FieldLabel htmlFor="tonnage">Tonnage</FieldLabel>
                  <Input
                    id="tonnage"
                    type="number"
                    min={1}
                    placeholder="e.g. 3"
                    value={tonnage as number}
                    onChange={(e) => setTonnage(Number(e.target.value))}
                  />
                </Field>
              )}
            </FieldGroup>
          </FieldSet>
        </FieldGroup>

        {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            className="flex-1 border-[#d7e8ee] text-[#1e3a5f] hover:bg-[#f0f6f9]"
            onClick={() => router.back()}
          >
            Back
          </Button>
          <Button
            className="flex-1 text-white"
            onClick={handleContinue}
            disabled={isCommercial && (!tonnage || tonnage <= 0)}
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleValue;
