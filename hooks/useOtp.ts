"use client";

import { useCallback, useRef, useState } from "react";
import { axiosClient } from "@/utilities/axios-client";
import { toast } from "sonner";
import { OTP_RESEND_WINDOW_MS } from "@/utilities/constants";

const STORAGE_KEY = "__otp_last_sent__";

type LastSent = {
  msisdn: string;
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

  const writeLastSent = useCallback((msisdn: string) => {
    try {
      const item: LastSent = { msisdn, timestamp: Date.now() };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(item));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const canSend = useCallback(
    (msisdn: string) => {
      const last = readLastSent();
      if (!last) return true;
      if (last.msisdn !== msisdn) return true;
      return Date.now() - last.timestamp >= OTP_RESEND_WINDOW_MS;
    },
    [readLastSent],
  );

  const sendOtp = useCallback(
    async (msisdn: string) => {
      if (inFlight.current) return { ok: false, reason: "in-flight" };
      if (!canSend(msisdn)) return { ok: false, reason: "recently-sent" };

      inFlight.current = true;
      setSending(true);
      try {
        await axiosClient.post("otp", { msisdn, user_type: "CUSTOMER" });
        writeLastSent(msisdn);
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
    (msisdn: string) => {
      const last = readLastSent();
      if (!last || last.msisdn !== msisdn) return 0;
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
