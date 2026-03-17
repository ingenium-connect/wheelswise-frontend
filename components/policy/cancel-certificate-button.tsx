"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { axiosAuthClient } from "@/utilities/axios-client";
import { toast } from "sonner";

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

const CONFIRM_WORD = "delete";

export function CancelCertificateButton({ policyId }: { policyId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  const confirmed = confirmText === CONFIRM_WORD;
  const canSubmit = confirmed && !!cancelReason && !loading;

  const handleCancel = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      await axiosAuthClient.post("/policy/cancel-certificate", {
        policy_id: policyId,
        cancel_reason: cancelReason,
      });
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
      setConfirmText("");
    }
    setOpen(next);
  };

  return (
    <>
      <Button
        variant="outline"
        className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 gap-2"
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
              <FieldLabel>
                Type{" "}
                <span className="font-mono font-bold text-red-600">
                  {CONFIRM_WORD}
                </span>{" "}
                to confirm
              </FieldLabel>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={CONFIRM_WORD}
                autoComplete="off"
              />
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
