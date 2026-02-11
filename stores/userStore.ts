import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserProfile } from "@/types/data";

type UserStore = {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
  updateProfile: (payload: Partial<UserProfile>) => void;
  resetProfile: () => void;
};

const initialProfile: UserProfile | null = null;

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      profile: initialProfile,
      setProfile: (profile) => set({ profile }),
      updateProfile: (payload) =>
        set((state) => ({
          profile: { ...(state.profile as any), ...payload },
        })),
      resetProfile: () => set({ profile: initialProfile }),
    }),
    {
      name: "user-profile-store",
      // only persist the profile object
      partialize: (state) => ({ profile: state.profile }),
    },
  ),
);
