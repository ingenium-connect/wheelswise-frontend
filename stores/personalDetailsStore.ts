import { create } from "zustand";
import { persist } from "zustand/middleware";

type PersonalDetails = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  idNumber: string;
  kraPin: string;
  ntsaRegistered: boolean;
};

type PersonalDetailsState = {
  personalDetails: { user: PersonalDetails; secondary_user?: PersonalDetails };
  setPersonalDetails: (payload: Partial<PersonalDetails>) => void;
  updateField: (field: keyof PersonalDetails, value: string | boolean) => void;
  resetPersonalDetails: () => void;
};

const initialState: { user: PersonalDetails , secondary_user?: PersonalDetails } = {
  user: {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    idNumber: "",
    kraPin: "",
    ntsaRegistered: false,
  },
};

export const usePersonalDetailsStore = create<PersonalDetailsState>()(
  persist(
    (set) => ({
      personalDetails: initialState,

      setPersonalDetails: (payload) =>
        set((state) => ({
          personalDetails: { ...state.personalDetails, ...payload },
        })),

      updateField: (field, value) =>
        set((state) => ({
          personalDetails: { ...state.personalDetails, [field]: value as any },
        })),

      resetPersonalDetails: () => set({ personalDetails: initialState }),
    }),
    {
      name: "personal-details-store",
    },
  ),
);
