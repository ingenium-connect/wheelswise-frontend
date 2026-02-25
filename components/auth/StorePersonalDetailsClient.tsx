"use client";

import { useEffect } from "react";
import { UserProfile } from "@/types/data";
import { usePersonalDetailsStore } from "@/stores/personalDetailsStore";

type Props = {
  user?: UserProfile | null;
};

export default function StorePersonalDetailsClient({ user }: Props) {
  const setPersonalDetails = usePersonalDetailsStore(
    (s) => s.setPersonalDetails,
  );

  useEffect(() => {
    if (!user) return;

    const nameParts = (user.name || "").split(" ");

    setPersonalDetails({
      firstName: nameParts[0] ?? "",
      lastName: nameParts[1] ?? "",
      phoneNumber: user.msisdn ?? "",
      email: user.email ?? "",
      idNumber: user.id_number ?? "",
      kraPin: user.kra_pin ?? "",
    });
  }, [user, setPersonalDetails]);

  return null;
}
