import { MotorSubTypeItem, MotorType } from "@/types/data";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type InsuranceStoreState = {
  // State
  cover: string | null;
  motorType: MotorType | null;
  vehicleValue: number;
  motorSubtype: MotorSubTypeItem | null;
  coverStep: number;
  tpoOption: string;
  // Actions
  selectCover: (coverType: string) => void;
  setMotorType: (type: MotorType) => void;
  setVehicleValue: (value: number) => void;
  setVehicleSubType: (subtype: MotorSubTypeItem) => void;
  nextCoverStep: () => void;
  previousCoverStep: () => void;
  setCoverStep: (step: number) => void;
  setTpoOption: (option: string) => void;
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
      motorSubtype: null,
      coverStep: 0,
      tpoOption: "",

      // Actions
      selectCover: (coverType) => set({ cover: coverType }),
      setMotorType: (type) => set({ motorType: type }),
      setVehicleValue: (value) => set({ vehicleValue: value }),
      setVehicleSubType: (subtype) => set({ motorSubtype: subtype }),
      nextCoverStep: () => set((state) => ({ coverStep: state.coverStep + 1 })),
      previousCoverStep: () =>
        set((state) => ({ coverStep: state.coverStep - 1 })),
      setCoverStep: (step) => set({ coverStep: step }),
      setTpoOption: (option) => set({ tpoOption: option }),
    }),
    {
      name: "motor-insurance-details",
    }
  )
);

export { useInsuranceStore };
