"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { axiosAuthClient } from "@/utilities/axios-client";
import {
  CheckCircle2,
  Loader2,
  MapPin,
  Phone,
  Mail,
  ClipboardCheck,
  AlertCircle,
} from "lucide-react";
import { UnderwriterValuer } from "@/types/data";
import { toast } from "sonner";

export function ValuersList({
  underwriterId,
  policyId,
  open,
  onOpenChange,
}: {
  underwriterId: string | undefined;
  policyId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [valuers, setValuers] = useState<UnderwriterValuer[] | null>(null);
  const [fetchError, setFetchError] = useState(false);
  const [selectedValuer, setSelectedValuer] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    setValuers(null);
    setFetchError(false);
    setSelectedValuer(undefined);
    setSubmitted(false);
    axiosAuthClient
      .get(`/policy/valuers?underwriter_id=${underwriterId}`)
      .then((res) => setValuers(res.data.valuers ?? []))
      .catch(() => {
        setFetchError(true);
        setValuers([]);
      });
  }, [open, underwriterId]);

  const handleConfirm = async () => {
    if (!selectedValuer) return;
    setSubmitting(true);
    try {
      await axiosAuthClient.post("/policy/valuation-request", {
        policy_id: policyId,
        valuer_id: selectedValuer,
      });
      setSubmitted(true);
      toast.success("Valuation request submitted successfully.");
    } catch {
      toast.error("Failed to submit valuation request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedValuerObj = valuers?.find((v) => v.id === selectedValuer);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ClipboardCheck className="w-4 h-4 text-primary" />
            </div>
            <DialogTitle className="text-[#1e3a5f]">
              Request Vehicle Valuation
            </DialogTitle>
          </div>
          <DialogDescription>
            Select a certified valuer to inspect your vehicle. They will contact
            you to schedule an appointment.
          </DialogDescription>
        </DialogHeader>

        {/* Success state */}
        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-[#1e3a5f]">Request Submitted</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your valuation request has been sent to{" "}
                <span className="font-medium text-[#1e3a5f]">
                  {selectedValuerObj?.name}
                </span>
                . They will reach out to you shortly.
              </p>
            </div>
            <Button
              className="mt-2 text-white"
              onClick={() => onOpenChange(false)}
            >
              Done
            </Button>
          </div>
        ) : valuers === null ? (
          /* Loading state */
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <Loader2 className="w-7 h-7 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Loading available valuers…
            </p>
          </div>
        ) : fetchError || valuers.length === 0 ? (
          /* Empty / error state */
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-[#1e3a5f]">No Valuers Found</p>
              <p className="text-sm text-muted-foreground mt-1">
                {fetchError
                  ? "Could not load valuers. Please try again later."
                  : "There are no registered valuers for this underwriter yet."}
              </p>
            </div>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        ) : (
          /* Valuer list */
          <>
            <p className="text-xs text-muted-foreground -mt-1 mb-1">
              {valuers.length} valuer{valuers.length !== 1 ? "s" : ""} available
            </p>
            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
              {valuers.map((valuer) => {
                const isSelected = selectedValuer === valuer.id;
                return (
                  <button
                    key={valuer.id}
                    type="button"
                    onClick={() => setSelectedValuer(valuer.id)}
                    className={`w-full text-left rounded-xl border p-3.5 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-[#d7e8ee] bg-white hover:border-primary/40 hover:bg-primary/[0.03]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 space-y-1.5">
                        <p className="font-semibold text-[#1e3a5f] text-sm leading-tight">
                          {valuer.name}
                        </p>
                        {valuer.location && (
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3 shrink-0" />
                            {valuer.location}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                          {valuer.phone && (
                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Phone className="w-3 h-3 shrink-0" />
                              {valuer.phone}
                            </p>
                          )}
                          {valuer.email && (
                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Mail className="w-3 h-3 shrink-0" />
                              {valuer.email}
                            </p>
                          )}
                        </div>
                      </div>
                      <div
                        className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected
                            ? "border-primary bg-primary"
                            : "border-[#c5d9e2] bg-white"
                        }`}
                      >
                        {isSelected && (
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 text-white"
                disabled={!selectedValuer || submitting}
                onClick={handleConfirm}
              >
                {submitting && (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                )}
                {submitting ? "Submitting…" : "Request Valuation"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
