import { PersonalDetails } from "@/types/data";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type PersonalDetailsState = {
  personalDetails: { user: PersonalDetails; secondary_user?: PersonalDetails };
  setPersonalDetails: (
    payload: Partial<PersonalDetails>,
    userType?: "user" | "secondary_user",
  ) => void;
  updateField: (
    field: keyof PersonalDetails,
    value: string | boolean,
    userType?: "user" | "secondary_user",
  ) => void;
  resetPersonalDetails: () => void;
};

const initialState: {
  user: PersonalDetails;
  secondary_user?: PersonalDetails;
} = {
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

      setPersonalDetails: (payload, userType = "user") =>
        set((state) => ({
          personalDetails: {
            ...state.personalDetails,
            [userType]: { ...state.personalDetails[userType], ...payload },
          },
        })),

      updateField: (field, value, userType = "user") =>
        set((state) => ({
          personalDetails: {
            ...state.personalDetails,
            [userType]: {
              ...state.personalDetails[userType],
              [field]: value as any,
            },
          },
        })),

      resetPersonalDetails: () => set({ personalDetails: initialState }),
    }),
    {
      name: "personal-details-store",
    },
  ),
);
