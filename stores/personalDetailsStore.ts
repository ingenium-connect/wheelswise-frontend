import { create } from "zustand";

type PersonalDetails = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  idNumber: string;
  kraPin: string;
  ntsaRegitered: boolean;
};

type PersonalDetailsState = {
  personalDetails: PersonalDetails;
  setPersonalDetails: (payload: Partial<PersonalDetails>) => void;
  updateField: (field: keyof PersonalDetails, value: string) => void;
  resetPersonalDetails: () => void;
};

const initialState: PersonalDetails = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  idNumber: "",
  kraPin: "",
  ntsaRegitered: false,
};

export const usePersonalDetailsStore = create<PersonalDetailsState>((set) => ({
  personalDetails: initialState,

  setPersonalDetails: (payload) =>
    set((state) => ({
      personalDetails: { ...state.personalDetails, ...payload },
    })),

  updateField: (field, value) =>
    set((state) => ({
      personalDetails: { ...state.personalDetails, [field]: value },
    })),

  resetPersonalDetails: () => set({ personalDetails: initialState }),
}));
