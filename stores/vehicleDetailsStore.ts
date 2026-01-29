import { create } from "zustand";
import { persist } from "zustand/middleware";

type VehicleDetails = {
  vehicleValue: number;
  engineCapacity: string;
  vehicleNumber: string;
  chassisNumber: string;
  make: string;
  model: string;
  year: string;
  bodyType: string;
  ntsaRegitered: boolean;
};

type VehicleDetailsState = {
  vehicleDetails: VehicleDetails;
  setVehicleDetails: (payload: Partial<VehicleDetails>) => void;
  updateVehicleField: (field: keyof VehicleDetails, value: string) => void;
  resetVehicleDetails: () => void;
};

const initialState: VehicleDetails = {
  vehicleValue: 0,
  engineCapacity: "",
  vehicleNumber: "",
  chassisNumber: "",
  make: "",
  model: "",
  year: "",
  bodyType: "",
  ntsaRegitered: false,
};

export const useVehicleDetailsStore = create<VehicleDetailsState>()(
  persist(
    (set) => ({
      vehicleDetails: initialState,

      setVehicleDetails: (payload) =>
        set((state) => ({
          vehicleDetails: { ...state.vehicleDetails, ...payload },
        })),

      updateVehicleField: (field, value) =>
        set((state) => ({
          vehicleDetails: { ...state.vehicleDetails, [field]: value },
        })),

      resetVehicleDetails: () => set({ vehicleDetails: initialState }),
    }),
    {
      name: "vehicle-details-store",
    },
  ),
);
