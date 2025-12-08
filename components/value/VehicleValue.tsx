"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useInsuranceStore } from "@/store/store";
import { useVehicleStore } from "@/stores/vehicleStore";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

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
    } else if (
      selectedMotorType?.name === "COMMERCIAL" &&
      (!tonnage || Number(tonnage) <= 0)
    ) {
      isValid = false;
      setError("Please enter a valid tonnage.");
    }

    if (!isValid) return;

    setError("");

    router.push(
      `/motor-subtype?product_type=${product_type}&motor_type=${motor_type}`
    );
  };

  return (
    <>
      <div className="w-full">
        <Card>
          <CardContent>
            <FieldGroup>
              <FieldSet>
                <FieldLegend>Vehicle Value</FieldLegend>
                <FieldDescription>
                  {selectedMotorType && (
                    <span className="text-center text-gray-700 text-sm mb-3">
                      Selected: <strong>{selectedMotorType.name}</strong>
                    </span>
                  )}
                </FieldDescription>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="vehicleValue">
                      Vehicle Value
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
                      placeholder="e.g. 14"
                      value={seating_capacity}
                      onChange={(e) => setSeatingCapacity(e.target.value)}
                      required
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
            </FieldGroup>

            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}

            <button
              onClick={handleContinue}
              className="mt-4 bg-[#397397] hover:bg-[#2e5e74] text-white px-5 py-2 rounded-lg text-sm font-medium transition"
            >
              Continue
            </button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default VehicleValue;
