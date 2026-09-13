"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Wallet,
  CalendarRange,
  CheckCircle2,
  Info,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";
import { axiosAuthClient } from "@/utilities/axios-client";
import { coverExtensionEndpoint } from "@/utilities/endpoints";
import type { CoverExtensionQuote } from "@/types/data";

function fmtCurrency(amount?: number | null) {
  if (amount == null || isNaN(amount)) return "—";
  return `KES ${amount.toLocaleString("en-KE")}`;
}

function fmtDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * The pay-off panel for a valued policy.
 *
 * A comprehensive policy is sold on an estimated value and issued one month of cover.
 * Once the vehicle is valued the premium is re-rated, and paying the difference buys
 * the remaining eleven months. This is where the customer does that.
 *
 * The backend decides whether they may — there are a dozen reasons they might not, from
 * an unfinished valuation to an underwriter that is not accepting payments right now —
 * so this never works that out for itself. It asks, and shows what it is told.
 */
export function CoverExtensionPanel({ policyId }: { policyId: string }) {
  const [quote, setQuote] = useState<CoverExtensionQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [paying, setPaying] = useState(false);
  const [prompted, setPrompted] = useState(false);

  const loadQuote = useCallback(async () => {
    setLoading(true);
    setLoadFailed(false);
    try {
      const res = await axiosAuthClient.get<CoverExtensionQuote>(
        coverExtensionEndpoint(policyId),
      );
      setQuote(res.data);
    } catch {
      setLoadFailed(true);
    } finally {
      setLoading(false);
    }
  }, [policyId]);

  useEffect(() => {
    void loadQuote();
  }, [loadQuote]);

  async function handlePay() {
    setPaying(true);
    try {
      await axiosAuthClient.post(coverExtensionEndpoint(policyId), {});
      setPrompted(true);
      toast.success("Check your phone to authorise the payment.");
    } catch (err) {
      // The backend's refusals are written for the customer, so show its message when
      // there is one rather than a generic failure.
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Could not start the payment. Please try again.";
      toast.error(message);
    } finally {
      setPaying(false);
    }
  }

  // A policy that cannot be extended is the common case, not a fault — most of the time
  // the valuation simply is not finished. Nothing is drawn for it.
  if (loading) {
    return (
      <div className="mt-4 flex items-center gap-2 text-sm text-[#1e3a5f]/60">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        Checking your balance…
      </div>
    );
  }

  if (loadFailed) {
    return (
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[#1e3a5f]/70">
        <Info className="w-3.5 h-3.5 shrink-0" />
        We could not load your balance just now.
        <button
          type="button"
          onClick={() => void loadQuote()}
          className="font-semibold text-primary underline underline-offset-2"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!quote) return null;

  if (prompted) {
    return (
      <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-start gap-3">
          <Smartphone className="w-5 h-5 shrink-0 text-emerald-600" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-emerald-900">
              Payment request sent
            </p>
            <p className="mt-0.5 text-sm text-emerald-800/80 leading-relaxed">
              Enter your M-Pesa PIN on your phone to pay{" "}
              <span className="font-semibold">
                {fmtCurrency(quote.amount_due)}
              </span>
              . Your cover is extended once the payment goes through.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!quote.can_pay) {
    // Only worth saying anything when the backend gave a reason to show.
    if (!quote.reason?.trim()) return null;

    return (
      <div className="mt-4 flex items-start gap-2 rounded-lg bg-white/60 border border-[#d7e8ee] px-3 py-2.5">
        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#1e3a5f]/50" />
        <p className="text-sm text-[#1e3a5f]/70 leading-relaxed first-letter:uppercase">
          {quote.reason}
        </p>
      </div>
    );
  }

  const coverFrom = fmtDate(quote.cover_from);
  const coverTo = fmtDate(quote.cover_to);

  return (
    <div className="mt-4 rounded-xl border border-[#d7e8ee] bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Balance to pay
          </p>
          <p className="text-2xl font-bold text-[#1e3a5f]">
            {fmtCurrency(quote.amount_due)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {fmtCurrency(quote.amount_paid)} paid of{" "}
            {fmtCurrency(quote.annual_premium)} annual premium
          </p>
        </div>

        <Button
          onClick={() => void handlePay()}
          disabled={paying}
          className="gap-1.5 text-white"
        >
          {paying ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Wallet className="w-3.5 h-3.5" />
          )}
          {paying ? "Sending request…" : "Pay balance"}
        </Button>
      </div>

      {coverFrom && coverTo && (
        <div className="mt-3 flex items-start gap-2 border-t border-[#e8f0f5] pt-3">
          <CalendarRange className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
          <p className="text-xs text-[#1e3a5f]/70 leading-relaxed">
            Paying in full extends your cover to{" "}
            <span className="font-semibold text-[#1e3a5f]">{coverTo}</span>{" "}
            (from {coverFrom}).
          </p>
        </div>
      )}

      <div className="mt-2 flex items-start gap-2">
        <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-600" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          You will get an M-Pesa prompt on the number registered to this policy.
        </p>
      </div>
    </div>
  );
}
