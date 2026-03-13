"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { InsurancePolicy } from "@/types/data";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Hourglass,
  Pencil,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { axiosClient } from "@/utilities/axios-client";
import {
  POLICY_COMPLETE_PURCHASE_ENDPOINT,
  POLICY_UPDATE_ENDPOINT,
} from "@/utilities/endpoints";

type Props = {
  policy: InsurancePolicy;
  token: string;
};

export const PolicyCard = ({ policy, token }: Props) => {
  const [startDate, setStartDate] = useState(new Date(policy.start_date));
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [completingPayment, setCompletingPayment] = useState(false);

  const today = new Date();
  const expiryDate = new Date(policy.end_date);
  const timeDiff = expiryDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
  const isExpired = timeDiff <= 0;
  const isExpiringSoon = !isExpired && timeDiff <= 30 * 24 * 3600 * 1000;

  const isCancelled = policy.is_cancelled;
  const isPendingPayment = !policy.is_paid && !isCancelled;
  const isActive = policy.is_paid && policy.is_active && !isExpired;

  const todayMidnight = new Date(new Date().setHours(0, 0, 0, 0));
  const startDateIsValid = startDate >= todayMidnight;

  const statusBadge = isCancelled ? (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-full">
      <XCircle className="w-3.5 h-3.5" />
      Cancelled
    </span>
  ) : isPendingPayment ? (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
      <Hourglass className="w-3.5 h-3.5" />
      Pending Payment
    </span>
  ) : isExpired ? (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
      <AlertTriangle className="w-3.5 h-3.5" />
      Expired
    </span>
  ) : isExpiringSoon ? (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
      <AlertTriangle className="w-3.5 h-3.5" />
      Expiring Soon
    </span>
  ) : isActive ? (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
      <CheckCircle2 className="w-3.5 h-3.5" />
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
      <Clock className="w-3.5 h-3.5" />
      Pending
    </span>
  );

  const statusBarColor = isCancelled
    ? "bg-gray-300"
    : isPendingPayment
      ? "bg-blue-400"
      : isExpired
        ? "bg-red-500"
        : isExpiringSoon
          ? "bg-amber-400"
          : "bg-emerald-500";

  const policyNumberDisplay = policy.policy_number ?? "—";
  const certDisplay = policy.certno ?? "—";

  async function handleCompletePayment() {
    setCompletingPayment(true);
    try {
      await axiosClient.post(
        `${POLICY_COMPLETE_PURCHASE_ENDPOINT}/${policy.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Payment completed successfully.");
    } catch {
      toast.error("Failed to complete payment. Please try again.");
    } finally {
      setCompletingPayment(false);
    }
  }

  async function handleDateSelect(date: Date | undefined) {
    if (!date) return;
    setCalendarOpen(false);
    setSaving(true);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const formatted = `${yyyy}-${mm}-${dd}`;
    try {
      await axiosClient.patch(
        `${POLICY_UPDATE_ENDPOINT}/${policy.id}`,
        { start_date: formatted },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setStartDate(date);
      toast.success("Start date updated successfully.");
    } catch {
      toast.error("Failed to update start date. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="border border-[#d7e8ee] shadow-md hover:shadow-xl transition-shadow duration-200 rounded-2xl overflow-hidden">
      {/* Status bar */}
      <div className={`h-1.5 w-full ${statusBarColor}`} />

      <CardContent className="p-5">
        {/* Header */}
        <div className="mb-5 space-y-3">
          {/* Row 1: vehicle info + days badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 bg-primary/10 rounded-xl shrink-0">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-[#1e3a5f] truncate">
                  {policy.vehicle_details.make} {policy.vehicle_details.model}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5 truncate">
                  {policy.vehicle_details.registration_number}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full shrink-0">
              <Clock className="w-3.5 h-3.5" />
              {policy.days} days
            </span>
          </div>

          {/* Row 2: status badge + action button */}
          <div className="flex items-center justify-between gap-2">
            {statusBadge}
            {isPendingPayment ? (
              <Button
                size="sm"
                disabled={!startDateIsValid || completingPayment}
                onClick={
                  startDateIsValid
                    ? handleCompletePayment
                    : () => setCalendarOpen(true)
                }
                title={
                  !startDateIsValid
                    ? "Update start date before proceeding"
                    : undefined
                }
                className="text-white text-xs shrink-0"
              >
                {completingPayment && (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                )}
                Complete Payment
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="border-primary text-primary hover:bg-primary/5 text-xs shrink-0"
              >
                View Details
              </Button>
            )}
          </div>
        </div>

        {/* Info grid */}
        <div className="flex flex-wrap justify-between gap-4 border-t border-[#d7e8ee] pt-4 text-sm">
          <InfoBlock label="Policy #" value={policyNumberDisplay} />
          {policy.certificate_issued && (
            <InfoBlock label="Cert #" value={certDisplay} />
          )}
          <InfoBlock
            label="Coverage"
            value={policy.policy_type.replace("_", " ")}
          />
          <InfoBlock
            label="Premium"
            value={`KES ${policy.premium.toLocaleString()}`}
          />

          {/* Start date — editable */}
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">
              Start date
            </p>
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-[#1e3a5f]">
                {startDate.toDateString()}
              </p>
              {!isActive && (
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <button
                      aria-label="Edit start date"
                      disabled={saving}
                      className="text-primary hover:text-primary/70 disabled:opacity-40 transition-colors"
                    >
                      {saving ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Pencil className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 shadow-xl border-[#d7e8ee]"
                    align="start"
                    sideOffset={8}
                  >
                    <div className="p-3 border-b border-[#d7e8ee]">
                      <p className="text-sm font-medium text-[#1e3a5f]">
                        Select new start date
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Choose when your cover should begin
                      </p>
                    </div>
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={handleDateSelect}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>

          {policy.is_paid && (
            <InfoBlock
              label="Expires"
              value={expiryDate.toDateString()}
              sub={isExpired ? "Expired" : `${daysRemaining} days remaining`}
              subColor={
                isExpired
                  ? "text-red-500"
                  : isExpiringSoon
                    ? "text-amber-500"
                    : "text-emerald-600"
              }
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const InfoBlock = ({
  label,
  value,
  sub,
  subColor = "text-muted-foreground",
}: {
  label: string;
  value: string | number;
  sub?: string;
  subColor?: string;
}) => (
  <div>
    <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">
      {label}
    </p>
    <p className="font-semibold text-[#1e3a5f]">{value}</p>
    {sub && <p className={`text-[11px] mt-0.5 ${subColor}`}>{sub}</p>}
  </div>
);
