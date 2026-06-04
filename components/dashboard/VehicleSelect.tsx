"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { axiosAuthClient } from "@/utilities/axios-client";
import { USER_VEHICLES_ENDPOINT } from "@/utilities/endpoints";
import { UserVehicle } from "@/types/data";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { AlertCircle, Loader2 } from "lucide-react";

interface VehicleSelectProps {
  value?: string;
  onChange: (vehicle: UserVehicle | null) => void;
  className?: string;
}

export default function VehicleSelect({
  value,
  onChange,
  className,
}: VehicleSelectProps) {
  const [vehicles, setVehicles] = useState<UserVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosAuthClient.get(USER_VEHICLES_ENDPOINT);
        const vehiclesData = response.data;
        // Handle both possible response formats
        const vehicleList = vehiclesData.vehicles || vehiclesData;
        setVehicles(Array.isArray(vehicleList) ? vehicleList : []);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setError("Failed to load your vehicles. Please try again.");
        toast.error("Failed to load vehicles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleSelect = (registrationNumber: string) => {
    const selectedVehicle = vehicles.find(
      (v) => v.registration_number === registrationNumber,
    );
    onChange(selectedVehicle || null);
  };

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center py-2", className)}>
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">
          Loading vehicles...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("text-center py-4", className)}>
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className={cn("text-center py-4", className)}>
        <p className="text-sm text-muted-foreground">
          No vehicles found. Please register your vehicle first.
        </p>
      </div>
    );
  }

  // Check if vehicle has an existing policy from the API response
  const getVehicleMessage = (registrationNumber: string | undefined) => {
    if (!registrationNumber) return null;
    const selectedVehicle = vehicles.find(
      (v) => v.registration_number === registrationNumber,
    );
    if (!selectedVehicle) return null;

    if (selectedVehicle.active_policy) {
      return {
        type: "active_policy" as const,
        message: (
          <div className="rounded-md bg-yellow-50 border border-yellow-200 px-3 py-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-yellow-900">
                  This vehicle has an active policy
                </p>
                <p className="text-xs text-yellow-700 mt-0.5">
                  {selectedVehicle.registration_number} already has an active{" "}
                  {selectedVehicle.active_policy.policy_type} policy. You cannot
                  link another policy for this vehicle from an external
                  underwriter.
                </p>
              </div>
            </div>
          </div>
        ),
      };
    }

    return null;
  };

  // Get the warning message for the currently selected vehicle
  const currentMessage = getVehicleMessage(value);

  return (
    <div className={cn("space-y-3", className)}>
      <Select value={value || undefined} onValueChange={handleSelect}>
        <SelectTrigger className="w-full h-9">
          <SelectValue>
            {value ? (
              <span className="truncate">
                {
                  vehicles.find((v) => v.registration_number === value)
                    ?.registration_number
                }
              </span>
            ) : (
              <span className="hidden sm:inline-flex">Select a vehicle</span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-64 overflow-y-auto z-50 w-full">
          {vehicles.map((vehicle) => {
            const message = getVehicleMessage(vehicle.registration_number);
            const hasActivePolicy = !!message;
            return (
              <SelectItem key={vehicle.id} value={vehicle.registration_number}>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {vehicle.registration_number}
                    </span>
                    {hasActivePolicy && (
                      <span
                        className="flex h-1.5 w-1.5 rounded-full bg-warning"
                        title="This vehicle has an active policy"
                      />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {vehicle.make} {vehicle.model} (
                    {vehicle.year_of_manufacture})
                  </span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {/* Warning for selected vehicle with active policy - shown below trigger */}
      {value && currentMessage?.type === "active_policy" && (
        <div className="animate-in fade-in slide-in-from-top-2">
          {currentMessage.message}
        </div>
      )}
    </div>
  );
}
