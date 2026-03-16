"use client";

import { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { usePersonalDetailsStore } from "@/stores/personalDetailsStore";

export default function ClearClientState() {
  const resetProfile = useUserStore((s) => s.resetProfile);
  const resetPersonal = usePersonalDetailsStore((s) => s.resetPersonalDetails);

  useEffect(() => {
    try {
      const cookies = document.cookie.split(";").map((c) => c.trim());
      const clearCookie = cookies.find((c) =>
        c.startsWith("clear_client_state="),
      );
      if (!clearCookie) return;

      // Clear the relevant localStorage keys
      try {
        localStorage.removeItem("payment_method_id");
        localStorage.removeItem("policy_start_date");
        localStorage.removeItem("vehicleRegistrationNumber");
      } catch (e) {
        console.error("Failed to clear localStorage keys", e);
      }

      // Reset persisted zustand stores
      try {
        resetProfile();
        resetPersonal();
      } catch (e) {
        console.error("Failed to reset client stores", e);
      }

      // Remove the cookie so this runs only once
      document.cookie = "clear_client_state=; path=/; max-age=0; samesite=lax";
    } catch (err) {
      console.error(err);
    }
  }, [resetProfile, resetPersonal]);

  return null;
}
