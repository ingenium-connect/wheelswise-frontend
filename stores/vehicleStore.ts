// stores/vehicleStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface VehicleStore {
  selectedMotorType: {
    id: string;
    name: string;
    description: string;
    image_url: string;
  } | null;
  vehicleValue: string;
  seating_capacity: string;
  tonnage: number;
  tpo_category: string;
  setMotorType: (motorType: VehicleStore["selectedMotorType"]) => void;
  setVehicleValue: (value: string) => void;
  setSeatingCapacity: (value: string) => void;
  setTonnage: (value: number) => void;
  setTpoCategory: (value: string) => void;
  reset: () => void;
}

export const useVehicleStore = create<VehicleStore>()(
  persist(
    (set) => ({
      selectedMotorType: null,
      vehicleValue: "",
      seating_capacity: "",
      tonnage: 0,
      tpo_category: "",
      setMotorType: (motorType) => set({ selectedMotorType: motorType }),
      setVehicleValue: (value) => set({ vehicleValue: value }),
      setSeatingCapacity: (value) => set({ seating_capacity: value }),
      setTonnage: (value) => set({ tonnage: value }),
      setTpoCategory: (value) => set({ tpo_category: value }),
      reset: () =>
        set({
          selectedMotorType: null,
          vehicleValue: "",
          seating_capacity: "",
          tonnage: 0,
          tpo_category: "",
        }),
    }),
    {
      name: "vehicle-info-store",
    },
  ),
);
