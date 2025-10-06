import VehicleValue from "@/components/value/VehicleValue";
import { MotorType } from "@/types/data";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type InsuranceStoreState = {
  // State
  cover: string | null;
  motorType: MotorType | null;
  vehicleValue: number;
  //   motorSubtype: string | null;
  // Actions
  selectCover: (coverType: string) => void;
  setMotorType: (type: MotorType) => void;
  setVehicleValue: (value: number) => void;
};

/**
 * stoeres the insurance details in local storage
 */
const useInsuranceStore = create<InsuranceStoreState>()(
  persist(
    (set) => ({
      // Initial sttes
      cover: null,
      motorType: null,
      vehicleValue: 0,

      // Actions
      selectCover: (coverType) => set({ cover: coverType }),
      setMotorType: (type) => set({ motorType: type }),
      setVehicleValue: (value) => set({ vehicleValue: value}),
    }),
    {
      name: "motor-insurance-details",
    }
  )
);

export { useInsuranceStore };
