"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Field, FieldLabel } from "@/components/ui/field";
import { axiosClient } from "@/utilities/axios-client";
import { parseCookies } from "nookies";
import { ACCESS_TOKEN } from "@/utilities/constants";
import { OTP_VERIFY_ENDPOINT } from "@/utilities/endpoints";
import { useOtp } from "@/hooks/useOtp";
import { useUserStore } from "@/stores/userStore";
import { toast } from "sonner";
import { OTP_RESEND_WINDOW_MS } from "@/utilities/constants";

const CANCEL_REASONS = [
  {
    value: "INSURED_PERSON_REQUESTED_CANCELLATION",
    label: "Insured person requested cancellation",
  },
  { value: "AMENDING_NO_OF_PASSENGERS", label: "Amending no of passengers" },
  { value: "CHANGE_OF_SCOPE_OF_COVER", label: "Change of scope of cover" },
  { value: "POLICY_NOT_TAKEN_UP", label: "Policy not taken up" },
  { value: "VEHICLE_SOLD", label: "Vehicle sold" },
  { value: "AMENDING_INSUREDS_DETAILS", label: "Amending insured's details" },
  { value: "AMENDING_VEHICLE_DETAILS", label: "Amending vehicle details" },
  { value: "SUSPECTED_FRAUD", label: "Suspected fraud" },
  { value: "NON_PAYMENT_OF_PREMIUM", label: "Non-payment of premium" },
  { value: "FAILURE_TO_PROVIDE_KYCS", label: "Failure to provide KYCs" },
  {
    value: "REQUEST_BY_A_GOVERNMENT_BODY",
    label: "Request by a government body",
  },
  {
    value: "SUBJECT_MATTER_CEASED_TO_EXIST",
    label: "Subject matter ceased to exist",
  },
  {
    value: "CHANGE_PERIOD_OF_INSURANCE",
    label: "Change period of insurance",
  },
  { value: "COVER_DECLINED_BY_INSURER", label: "Cover declined by insurer" },
  {
    value: "MOTOR_VEHICLE_WAS_WRITTEN_OFF",
    label: "Motor vehicle was written off",
  },
  { value: "MOTOR_VEHICLE_WAS_STOLEN", label: "Motor vehicle was stolen" },
] as const;

export function CancelCertificateButton({ policyId }: { policyId: string }) {
  const router = useRouter();
  const { profile } = useUserStore();
  const { sendOtp, timeUntilResend } = useOtp();

  const [open, setOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  // Resend timer
  const [timer, setTimer] = useState(60);
  const [allowResend, setAllowResend] = useState(false);

  const nationalId = profile?.id_number ?? "";

  // Countdown timer
  useEffect(() => {
    if (!open) return;
    if (timer === 0) {
      setAllowResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, open]);

  // Auto-send OTP when dialog opens
  useEffect(() => {
    if (!open || !nationalId) return;
    setTimer(60);
    setAllowResend(false);
    sendOtp(nationalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleResend = () => {
    setAllowResend(false);
    (async () => {
      try {
        const res = await sendOtp(nationalId);
        if (res.ok) {
          setTimer(Math.ceil(OTP_RESEND_WINDOW_MS / 1000));
        } else if (res.reason === "recently-sent") {
          toast.success("OTP already sent recently");
          const until = timeUntilResend(nationalId);
          setTimer(Math.ceil(until / 1000));
        }
      } catch {
        toast.error("Failed to resend OTP. Please try again.");
        setAllowResend(true);
      }
    })();
  };

  const canSubmit = otpVerified && !!cancelReason && !loading;

  const verifyOtp = async (code: string) => {
    setVerifying(true);
    setOtpError("");
    try {
      const res = await axiosClient.patch(OTP_VERIFY_ENDPOINT, {
        user_id: profile?.id ?? "",
        otp: code,
        user_type: "CUSTOMER",
      });
      if (res?.data) {
        setOtpVerified(true);
      } else {
        setOtpVerified(false);
        setOtpError("Invalid OTP. Please try again.");
      }
    } catch {
      setOtpVerified(false);
      setOtpError("Invalid or expired OTP. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleOtpChange = (val: string) => {
    setOtp(val);
    setOtpVerified(false);
    if (otpError) setOtpError("");
    if (val.length === 6) {
      verifyOtp(val);
    }
  };

  const handleCancel = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      const token = parseCookies()[ACCESS_TOKEN];
      await axiosClient.post(
        "/policy/cancel-certificate",
        { policy_id: policyId, cancel_reason: cancelReason },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: false,
        },
      );
      toast.success("Certificate cancelled successfully.");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Failed to cancel certificate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setCancelReason("");
      setOtp("");
      setOtpError("");
      setOtpVerified(false);
      setVerifying(false);
      setTimer(60);
      setAllowResend(false);
    }
    setOpen(next);
  };

  return (
    <>
      <Button
        variant="outline"
        className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 gap-2 shrink-0"
        onClick={() => setOpen(true)}
      >
        <XCircle className="w-4 h-4" />
        Cancel Certificate
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Cancel Certificate
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-3 mt-1">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                  <strong>Warning:</strong> This action will cancel your
                  insurance certificate and leave your vehicle uninsured. This
                  cannot be undone.
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <Field>
              <FieldLabel>Reason for cancellation</FieldLabel>
              <Select value={cancelReason} onValueChange={setCancelReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {CANCEL_REASONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Enter the OTP sent to your phone</FieldLabel>
              <div className="flex justify-center pt-1">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={handleOtpChange}
                  disabled={verifying || otpVerified}
                >
                  <InputOTPGroup>
                    {[0, 1, 2].map((i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                  <InputOTPGroup>
                    {[3, 4, 5].map((i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {verifying && (
                <p className="text-center text-sm text-muted-foreground mt-2">Verifying…</p>
              )}
              {otpVerified && (
                <p className="text-center text-sm text-emerald-600 font-medium mt-2">OTP verified</p>
              )}
              {otpError && (
                <p className="text-center text-red-600 text-sm mt-2">{otpError}</p>
              )}
              <p className="text-center text-sm text-muted-foreground mt-2">
                {allowResend ? (
                  <>
                    Didn&apos;t receive a code?{" "}
                    <span
                      className="text-primary font-medium cursor-pointer hover:underline"
                      onClick={handleResend}
                    >
                      Resend
                    </span>
                  </>
                ) : (
                  <>Resend in {timer}s</>
                )}
              </p>
            </Field>

            <div className="flex gap-3 pt-1">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleOpenChange(false)}
                disabled={loading}
              >
                Go back
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                disabled={!canSubmit}
                onClick={handleCancel}
              >
                {loading ? "Cancelling…" : "Cancel Certificate"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
