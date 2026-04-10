import { MotorSubTypeItem, MotorType, TpoOption } from "@/types/data";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type InsuranceStoreState = {
  // State
  cover: string | null;
  motorType: MotorType | null;
  vehicleValue: number;
  motorSubtype: MotorSubTypeItem | null;
  selectedAdditionalBenefitIds: string[];
  coverStep: number;
  tpoOption: string;
  isCoOwned: boolean | null;
  // Actions
  selectCover: (coverType: string) => void;
  setMotorType: (type: MotorType) => void;
  setVehicleValue: (value: number) => void;
  setVehicleSubType: (subtype: MotorSubTypeItem) => void;
  setSelectedAdditionalBenefitIds: (ids: string[]) => void;
  nextCoverStep: () => void;
  previousCoverStep: () => void;
  setCoverStep: (step: number) => void;
  setTpoOption: (option: TpoOption) => void;
  setisCoOwned: (isCoOwned: boolean) => void;
};

/**
 * stores the insurance details in local storage
 */
const useInsuranceStore = create<InsuranceStoreState>()(
  persist(
    (set) => ({
      // Initial sttes
      cover: null,
      motorType: null,
      vehicleValue: 0,
      motorSubtype: null,
      selectedAdditionalBenefitIds: [],
      coverStep: 0,
      tpoOption: "",
      isCoOwned: null,
      // Actions
      selectCover: (coverType) => set({ cover: coverType }),
      setMotorType: (type) => set({ motorType: type }),
      setVehicleValue: (value) => set({ vehicleValue: value }),
      setVehicleSubType: (subtype) => set({ motorSubtype: subtype }),
      setSelectedAdditionalBenefitIds: (ids) =>
        set({ selectedAdditionalBenefitIds: ids }),
      nextCoverStep: () => set((state) => ({ coverStep: state.coverStep + 1 })),
      previousCoverStep: () =>
        set((state) => ({ coverStep: state.coverStep - 1 })),
      setCoverStep: (step) => set({ coverStep: step }),
      setTpoOption: (option) => set({ tpoOption: option }),
      setisCoOwned: (isCoOwned) => set({ isCoOwned }),
    }),
    {
      name: "motor-insurance-details",
    },
  ),
);

export { useInsuranceStore };
