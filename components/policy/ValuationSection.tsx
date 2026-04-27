"use client";

import { useState } from "react";
import {
  ClipboardCheck,
  CheckCircle2,
  Search,
  Clock,
  Eye,
  MinusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ValuersList } from "./ValuersList";

type ValuationStatus =
  | "AWAITING_VALUATION"
  | "LODGED"
  | "UNDER_REVIEW"
  | "COMPLETED"
  | "NOT_REQUIRED";

const STATUS_META: Record<
  ValuationStatus,
  {
    label: string;
    description: string;
    icon: React.ElementType;
    cardClass: string;
    iconClass: string;
    badgeClass: string;
  }
> = {
  AWAITING_VALUATION: {
    label: "Awaiting Valuation",
    description:
      "Your vehicle needs to be inspected by a certified valuer. Select a valuer below to initiate the process.",
    icon: Clock,
    cardClass: "bg-amber-50 border-amber-200",
    iconClass: "bg-amber-100 border-amber-200 text-amber-600",
    badgeClass: "text-amber-700 bg-amber-50 border-amber-200",
  },
  LODGED: {
    label: "Valuation Lodged",
    description:
      "Your valuation request has been submitted and is awaiting review by the assigned valuer.",
    icon: ClipboardCheck,
    cardClass: "bg-violet-50 border-violet-200",
    iconClass: "bg-violet-100 border-violet-200 text-violet-600",
    badgeClass: "text-violet-700 bg-violet-50 border-violet-200",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    description:
      "The valuer is currently reviewing your vehicle details. You will be notified once complete.",
    icon: Eye,
    cardClass: "bg-blue-50 border-blue-200",
    iconClass: "bg-blue-100 border-blue-200 text-blue-600",
    badgeClass: "text-blue-700 bg-blue-50 border-blue-200",
  },
  COMPLETED: {
    label: "Valuation Completed",
    description:
      "Your vehicle valuation has been successfully completed and verified.",
    icon: CheckCircle2,
    cardClass: "bg-emerald-50 border-emerald-200",
    iconClass: "bg-emerald-100 border-emerald-200 text-emerald-600",
    badgeClass: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  NOT_REQUIRED: {
    label: "Not Required",
    description:
      "Vehicle valuation is not required for this policy.",
    icon: MinusCircle,
    cardClass: "bg-gray-50 border-gray-200",
    iconClass: "bg-gray-100 border-gray-200 text-gray-500",
    badgeClass: "text-gray-600 bg-gray-100 border-gray-200",
  },
};

export function ValuationSection({
  valuationStatus,
  underwriterId,
  policyId,
}: {
  valuationStatus: ValuationStatus;
  underwriterId: string | undefined;
  policyId: string;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const meta = STATUS_META[valuationStatus];
  const Icon = meta.icon;
  const isAwaiting = valuationStatus === "AWAITING_VALUATION";

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#d7e8ee] shadow-sm overflow-hidden">
        {/* Section header */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#d7e8ee]">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <ClipboardCheck className="w-4 h-4 text-primary" />
          </div>
          <h2 className="font-semibold text-[#1e3a5f] text-sm">
            Vehicle Valuation
          </h2>
        </div>

        {/* Status card */}
        <div className="px-5 py-5">
          <div
            className={`rounded-xl border p-4 flex items-start gap-4 ${meta.cardClass}`}
          >
            <div
              className={`shrink-0 w-10 h-10 rounded-full border flex items-center justify-center ${meta.iconClass}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  className={`inline-flex items-center gap-1 text-xs font-semibold border px-2.5 py-0.5 rounded-full ${meta.badgeClass}`}
                >
                  {meta.label}
                </span>
              </div>
              <p className="text-sm text-[#1e3a5f]/80 leading-relaxed">
                {meta.description}
              </p>
              {isAwaiting && (
                <Button
                  size="sm"
                  className="mt-3 text-white gap-1.5"
                  onClick={() => setDialogOpen(true)}
                >
                  <Search className="w-3.5 h-3.5" />
                  Select a Valuer
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {isAwaiting && (
        <ValuersList
          underwriterId={underwriterId}
          policyId={policyId}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </>
  );
}
