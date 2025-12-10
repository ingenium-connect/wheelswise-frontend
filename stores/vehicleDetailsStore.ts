import { create } from "zustand";

type VehicleDetails = {
  vehicleValue: number;
  engineCapacity: string;
  vehicleNumber: string;
  chassisNumber: string;
  make: string;
  model: string;
  year: string;
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
};

export const useVehicleDetailsStore = create<VehicleDetailsState>((set) => ({
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
}));
