"use client";

import { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { useInsuranceFlowStore } from "@/stores/insuranceFlowStore";
import { useAuth } from "@/hooks/useAuth";

const PERSISTED_STORE_KEYS = [
  "insurance-flow-store", // New consolidated store
  "user-profile-store",
  // Legacy store keys (in case they exist)
  "motor-insurance-details",
  "vehicle-info-store",
  "personal-details-store",
];

const AD_HOC_KEYS = [
  "payment_method_id",
  "policy_start_date",
  "vehicleRegistrationNumber",
  "auth_event", // Auth sync key
];

/**
 * ClearClientState - Clears all client-side state on logout
 *
 * This component listens for the clear_client_state cookie set by the server
 * during logout and clears all persisted Zustand stores and localStorage keys.
 *
 * It also clears sessionStorage to remove OTP deduplication state and other
 * temporary data.
 */
export default function ClearClientState() {
  const resetProfile = useUserStore((s) => s.resetProfile);
  const resetFlow = useInsuranceFlowStore((s) => s.resetFlow);
  const { checkAuth } = useAuth();

  useEffect(() => {
    try {
      const cookies = document.cookie.split(";").map((c) => c.trim());
      const clearCookie = cookies.find((c) =>
        c.startsWith("clear_client_state="),
      );
      if (!clearCookie) return;

      console.log("[ClearClientState] Clearing all client state...");

      // Reset persisted zustand stores (in-memory state)
      try {
        resetProfile();
        resetFlow();
        console.log("[ClearClientState] Zustand stores reset");
      } catch (e) {
        console.error("[ClearClientState] Failed to reset stores:", e);
      }

      // Remove persisted store entries + ad-hoc auth/flow keys from localStorage
      try {
        [...PERSISTED_STORE_KEYS, ...AD_HOC_KEYS].forEach((k) => {
          localStorage.removeItem(k);
        });
        console.log("[ClearClientState] localStorage cleared");
      } catch (e) {
        console.error("[ClearClientState] Failed to clear localStorage:", e);
      }

      // Clear sessionStorage (OTP deduplication state, etc.)
      try {
        sessionStorage.clear();
        console.log("[ClearClientState] sessionStorage cleared");
      } catch (e) {
        console.error("[ClearClientState] Failed to clear sessionStorage:", e);
      }

      // Remove the cookie so this runs only once
      document.cookie = "clear_client_state=; path=/; max-age=0; samesite=lax";
      console.log("[ClearClientState] Cleanup complete");

      // Trigger auth check to update navbar immediately
      console.log("[ClearClientState] Triggering auth check...");
      checkAuth();
    } catch (err) {
      console.error("[ClearClientState] Error:", err);
    }
  }, [resetProfile, resetFlow, checkAuth]);

  return null;
}
