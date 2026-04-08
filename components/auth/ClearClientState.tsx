"use client";

import { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { usePersonalDetailsStore } from "@/stores/personalDetailsStore";
import { useVehicleStore } from "@/stores/vehicleStore";

const PERSISTED_STORE_KEYS = [
  "motor-insurance-details",
  "vehicle-info-store",
  "personal-details-store",
  "user-profile-store",
];

const AD_HOC_KEYS = [
  "payment_method_id",
  "policy_start_date",
  "vehicleRegistrationNumber",
];

export default function ClearClientState() {
  const resetProfile = useUserStore((s) => s.resetProfile);
  const resetPersonal = usePersonalDetailsStore((s) => s.resetPersonalDetails);
  const resetVehicle = useVehicleStore((s) => s.reset);

  useEffect(() => {
    try {
      const cookies = document.cookie.split(";").map((c) => c.trim());
      const clearCookie = cookies.find((c) =>
        c.startsWith("clear_client_state="),
      );
      if (!clearCookie) return;

      // Reset persisted zustand stores (in-memory state)
      try {
        resetProfile();
        resetPersonal();
        resetVehicle();
      } catch (e) {
        console.error("Failed to reset client stores", e);
      }

      // Remove persisted store entries + ad-hoc auth/flow keys from localStorage
      try {
        [...PERSISTED_STORE_KEYS, ...AD_HOC_KEYS].forEach((k) =>
          localStorage.removeItem(k),
        );
      } catch (e) {
        console.error("Failed to clear localStorage keys", e);
      }

      // Clear sessionStorage (OTP deduplication state, etc.)
      try {
        sessionStorage.clear();
      } catch (e) {
        console.error("Failed to clear sessionStorage", e);
      }

      // Remove the cookie so this runs only once
      document.cookie = "clear_client_state=; path=/; max-age=0; samesite=lax";
    } catch (err) {
      console.error(err);
    }
  }, [resetProfile, resetPersonal, resetVehicle]);

  return null;
}
