"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { axiosClient } from "@/utilities/axios-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

const MOTOR_TYPES = [
  { value: "PRIVATE", label: "Private" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "PSV", label: "PSV (Public Service Vehicle)" },
  { value: "MOTORBIKE", label: "Motorbike" },
] as const;

export default function VehicleSearch() {
  const router = useRouter();
  const [reg, setReg] = useState("");
  const [motorType, setMotorType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosClient.get(
        `vehicle/search?vehicle_registration_number=${reg.replace(/ /g, "")}&motor_type=${motorType}`,
      );
      const { vehicle, owner, regNo } = res.data;

      if (!vehicle) {
        toast.error("Vehicle not found. Please check the registration number and motor type.");
        return;
      }

      sessionStorage.setItem(
        "dashboard-vehicle-search",
        JSON.stringify({
          vehicle,
          owner: owner ?? null,
          regNo: regNo ?? reg,
          motorType,
        }),
      );

      toast.success("Vehicle found");
      router.push("/dashboard/vehicle-details");
    } catch {
      toast.error("Vehicle not found. Please check the registration number and motor type.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border border-[#d7e8ee] shadow-sm overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="space-y-5">
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
                value={reg}
                onChange={(e) => setReg(e.target.value)}
                placeholder="e.g. KAA 123A"
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="motorType">Motor Type</FieldLabel>
              <Select
                value={motorType}
                onValueChange={setMotorType}
                required
              >
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

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-[#d7e8ee] text-[#1e3a5f] hover:bg-[#f0f6f9]"
                onClick={() => { router.push("/dashboard?tab=vehicle"); router.refresh(); }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 text-white"
                disabled={loading || !reg.trim() || !motorType}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Search Vehicle
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
