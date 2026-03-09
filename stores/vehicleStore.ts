// stores/vehicleStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type SelectedMotorType = {
  id: string;
  name: string;
  description: string;
  image_url: string;
};

type VehicleDetails = {
  vehicleValue: number;
  engineCapacity: string;
  engineNumber: string;
  vehicleNumber: string;
  chassisNumber: string;
  make: string;
  model: string;
  year: string;
  bodyType: string;
  vehiclePurpose: string;
  vehiclePurposeCategory: string;
  ntsaRegistered: boolean;
};

type VehicleStore = {
  // general vehicle selection
  selectedMotorType: SelectedMotorType | null;
  vehicleValue: string;
  seating_capacity: string;
  tonnage: number;
  tpo_category: string;

  // detailed vehicle info
  vehicleDetails: VehicleDetails;

  // actions - general
  setMotorType: (motorType: SelectedMotorType | null) => void;
  setVehicleValue: (value: string) => void;
  setSeatingCapacity: (value: string) => void;
  setTonnage: (value: number) => void;
  setTpoCategory: (value: string) => void;

  // actions - details
  setVehicleDetails: (payload: Partial<VehicleDetails>) => void;
  updateVehicleField: (
    field: keyof VehicleDetails,
    value: string | number | boolean,
  ) => void;
  resetVehicleDetails: () => void;

  // reset all
  reset: () => void;
};

const initialVehicleDetails: VehicleDetails = {
  vehicleValue: 0,
  engineCapacity: "",
  engineNumber: "",
  vehicleNumber: "",
  chassisNumber: "",
  make: "",
  model: "",
  year: "",
  bodyType: "",
  vehiclePurpose: "",
  vehiclePurposeCategory: "",
  ntsaRegistered: false,
};

export const useVehicleStore = create<VehicleStore>()(
  persist(
    (set) => ({
      selectedMotorType: null,
      vehicleValue: "",
      seating_capacity: "",
      tonnage: 0,
      tpo_category: "",

      vehicleDetails: initialVehicleDetails,

      setMotorType: (motorType) => set({ selectedMotorType: motorType }),
      setVehicleValue: (value) => set({ vehicleValue: value }),
      setSeatingCapacity: (value) => set({ seating_capacity: value }),
      setTonnage: (value) => set({ tonnage: value }),
      setTpoCategory: (value) => set({ tpo_category: value }),

      setVehicleDetails: (payload) =>
        set((state) => ({
          vehicleDetails: { ...state.vehicleDetails, ...payload },
        })),

      updateVehicleField: (field, value) =>
        set((state) => ({
          vehicleDetails: { ...state.vehicleDetails, [field]: value as any },
        })),

      resetVehicleDetails: () => set({ vehicleDetails: initialVehicleDetails }),

      reset: () =>
        set({
          selectedMotorType: null,
          vehicleValue: "",
          seating_capacity: "",
          tonnage: 0,
          tpo_category: "",
          vehicleDetails: initialVehicleDetails,
        }),
    }),
    {
      name: "vehicle-info-store",
    },
  ),
);
