"use client";

import { useEffect } from "react";
import { UserProfile } from "@/types/data";
import { useUserStore } from "@/stores/userStore";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  user: UserProfile;
};

export default function StoreUserClient({ user }: Props) {
  const setProfile = useUserStore((s) => s.setProfile);
  const { updateUser } = useAuth();

  useEffect(() => {
    if (user) {
      setProfile(user);
      // Also update auth context with full profile data
      updateUser(user);
    }
  }, [user, setProfile, updateUser]);

  return null;
}
