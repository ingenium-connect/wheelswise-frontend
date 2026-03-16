"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import type { ApplicableExcess, ProductBenefit } from "@/types/data";

const INITIAL_VISIBLE = 3;

const pill =
  "text-[11px] font-medium bg-[#f0f6f9] text-[#1e3a5f] border border-[#d7e8ee] px-2 py-0.5 rounded-full whitespace-nowrap";

function ToggleButton({
  expanded,
  hiddenCount,
  label,
  onClick,
}: {
  expanded: boolean;
  hiddenCount: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="mt-3 w-full flex items-center justify-center gap-1.5 text-[12px] font-medium text-primary hover:text-primary/80 border border-dashed border-primary/30 hover:border-primary/50 rounded-lg py-2 transition-colors"
    >
      {expanded ? (
        <>
          <ChevronUp className="w-3.5 h-3.5" />
          Show less
        </>
      ) : (
        <>
          <ChevronDown className="w-3.5 h-3.5" />
          {hiddenCount} more {label}
        </>
      )}
    </button>
  );
}

/* ── Policy Benefits ── */

function BenefitRow({ benefit }: { benefit: ProductBenefit }) {
  const hasLimits = (benefit.limits?.length ?? 0) > 0;
  const hasDescription = !!benefit.description?.trim();

  return (
    <div className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div className="flex items-start gap-2.5 min-w-0">
        <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
        </div>
        <p className="text-sm font-medium text-[#1e3a5f] leading-snug">
          {benefit.name ?? "Unnamed Benefit"}
        </p>
      </div>

      <div className="flex-shrink-0 flex flex-wrap justify-end gap-1.5">
        {hasLimits
          ? benefit.limits!.map((limit, i) => (
              <span key={i} className={pill}>
                {limit.currency ?? "KES"} {limit.amount.toLocaleString("en-KE")}
                {limit.label && (
                  <span className="text-[#1e3a5f]/50"> / {limit.label}</span>
                )}
              </span>
            ))
          : hasDescription && (
              <span className={`${pill} max-w-[160px] truncate`} title={benefit.description}>
                {benefit.description}
              </span>
            )}
      </div>
    </div>
  );
}

export function PolicyBenefitsList({ benefits }: { benefits: ProductBenefit[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? benefits : benefits.slice(0, INITIAL_VISIBLE);
  const hiddenCount = benefits.length - INITIAL_VISIBLE;

  return (
    <div>
      <div className="divide-y divide-[#e8f0f5]">
        {visible.map((b) => (
          <BenefitRow key={b.id} benefit={b} />
        ))}
      </div>
      {hiddenCount > 0 && (
        <ToggleButton
          expanded={expanded}
          hiddenCount={hiddenCount}
          label={`benefit${hiddenCount !== 1 ? "s" : ""}`}
          onClick={() => setExpanded((v) => !v)}
        />
      )}
    </div>
  );
}

/* ── Applicable Excesses ── */

function ExcessRow({ excess }: { excess: ApplicableExcess }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#1e3a5f]">
          {excess.name ?? "Unnamed Excess"}
        </p>
        {excess.conditions?.trim() && (
          <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 inline-block mt-1">
            {excess.conditions}
          </p>
        )}
      </div>
      <div className="flex-shrink-0 flex flex-wrap gap-1.5 sm:justify-end">
        {excess.percentage != null && (
          <span className={pill}>
            {excess.percentage}%
            {excess.percentage_of && ` of ${excess.percentage_of}`}
          </span>
        )}
        {excess.minimum_amount != null && (
          <span className={pill}>
            Min. {excess.currency ?? "KES"}{" "}
            {excess.minimum_amount.toLocaleString("en-KE")}
          </span>
        )}
      </div>
    </div>
  );
}

export function ApplicableExcessesList({ excesses }: { excesses: ApplicableExcess[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? excesses : excesses.slice(0, INITIAL_VISIBLE);
  const hiddenCount = excesses.length - INITIAL_VISIBLE;

  return (
    <div>
      <div className="divide-y divide-[#e8f0f5]">
        {visible.map((e) => (
          <ExcessRow key={e.id} excess={e} />
        ))}
      </div>
      {hiddenCount > 0 && (
        <ToggleButton
          expanded={expanded}
          hiddenCount={hiddenCount}
          label={`excess${hiddenCount !== 1 ? "es" : ""}`}
          onClick={() => setExpanded((v) => !v)}
        />
      )}
    </div>
  );
}
