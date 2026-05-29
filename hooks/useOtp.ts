"use client";

import { useCallback, useRef, useState } from "react";
import { axiosClient } from "@/utilities/axios-client";
import { toast } from "sonner";
import { OTP_RESEND_WINDOW_MS } from "@/utilities/constants";

const STORAGE_KEY = "__otp_last_sent__";

type LastSent = {
  identifier: string;
  timestamp: number;
};

export function useOtp() {
  const [sending, setSending] = useState(false);
  const inFlight = useRef(false);

  const readLastSent = useCallback((): LastSent | null => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as LastSent;
    } catch (err) {
      console.error(err);
      return null;
    }
  }, []);

  const writeLastSent = useCallback((identifier: string) => {
    try {
      const item: LastSent = { identifier, timestamp: Date.now() };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(item));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const canSend = useCallback(
    (identifier: string) => {
      const last = readLastSent();
      if (!last) return true;
      if (last.identifier !== identifier) return true;
      return Date.now() - last.timestamp >= OTP_RESEND_WINDOW_MS;
    },
    [readLastSent],
  );

  const sendOtp = useCallback(
    async (
      identifier: string,
      identifierType: "national_id" | "user_id" = "national_id",
    ) => {
      if (inFlight.current) return { ok: false, reason: "in-flight" };
      if (!canSend(identifier)) return { ok: false, reason: "recently-sent" };

      inFlight.current = true;
      setSending(true);
      try {
        await axiosClient.post("otp", {
          [identifierType]: identifier,
          user_type: "CUSTOMER",
        });
        writeLastSent(identifier);
        toast.success("OTP sent successfully");
        return { ok: true };
      } catch (err) {
        console.error("OTP send failed", err);
        toast.error("Failed to send OTP. Please try again.");
        return { ok: false, reason: "network" };
      } finally {
        inFlight.current = false;
        setSending(false);
      }
    },
    [canSend, writeLastSent],
  );

  const timeUntilResend = useCallback(
    (
      identifier: string,
      identifierType: "national_id" | "user_id" = "national_id",
    ) => {
      const last = readLastSent();
      if (!last || last.identifier !== identifier) return 0;
      const elapsed = Date.now() - last.timestamp;
      return Math.max(0, OTP_RESEND_WINDOW_MS - elapsed);
    },
    [readLastSent],
  );

  return {
    sending,
    sendOtp,
    canSend,
    timeUntilResend,
  } as const;
}
