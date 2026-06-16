"use client";

import { axiosClient } from "@/utilities/axios-client";
import { useState } from "react";
import { Button } from "../ui/button";
import { Loader2, Search } from "lucide-react";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { vehicleSearchResponseType } from "@/types/data";

export default function VehicleSearch({
  onSearchSuccess,
}: {
  onSearchSuccess: (searchRes: vehicleSearchResponseType) => void;
}) {
  const [vehicleRegNumber, setVehicleRegNumber] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [motorType, setMotorType] = useState<string | undefined>(undefined);

  const MOTOR_TYPES = [
    { value: "PRIVATE", label: "Private" },
    { value: "COMMERCIAL", label: "Commercial" },
    { value: "PSV", label: "PSV (Public Service Vehicle)" },
    { value: "MOTORBIKE", label: "Motorbike" },
  ] as const;

  const searchVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSearch(true);

    try {
      const res = await axiosClient.get(
        `vehicle/search?vehicle_registration_number=${vehicleRegNumber.replace(
          / /g,
          "",
        )}&motor_type=${motorType}`,
      );

      const { vehicle, owner, regNo } = res.data;

      // invoke callbck function
      onSearchSuccess({
        vehicleFound: true,
        personalDetails: owner,
        vehicleDetails: vehicle,
        regNo: regNo,
      });
    } catch (_err: unknown) {
      toast.error("An error occurred please try again later");
    } finally {
      setLoadingSearch(false);
    }
  };

  return (
    <form
      onSubmit={searchVehicle}
      className="space-y-6 border-[#d7e8ee] bg-white shadow-lg p-4 rounded-md"
    >
      <div className="flex items-center gap-4 bg-primary/5 rounded-xl p-5">
        <div className="p-3 bg-white rounded-xl shadow-sm shrink-0">
          <Search className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-[#1e3a5f] text-base">
            Search by Registration
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Enter your vehicle registration number.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex-1">
          <Field>
            <FieldLabel>Motor type</FieldLabel>
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

          <FieldLabel htmlFor="vehicleReg">
            Vehicle Registration Number <span className="text-red-500">*</span>
          </FieldLabel>
          <Input
            id="vehicleReg"
            value={vehicleRegNumber}
            onChange={(e) => setVehicleRegNumber(e.target.value)}
            placeholder="e.g. KAA 123A"
            required
            className="mt-2 h-11 text-lg tracking-wider"
          />
        </div>

        <Button
          type="submit"
          className="w-full sm:w-auto text-white px-8 h-11"
          disabled={loadingSearch}
        >
          {loadingSearch ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Search"
          )}
        </Button>
      </div>
    </form>
  );
}
