"use client";

import { useEffect } from "react";
import { UserProfile } from "@/types/data";
import { useUserStore } from "@/stores/userStore";

type Props = {
  user: UserProfile;
};

export default function StoreUserClient({ user }: Props) {
  const setProfile = useUserStore((s) => s.setProfile);

  useEffect(() => {
    if (user) setProfile(user);
  }, [user, setProfile]);

  return null;
}
