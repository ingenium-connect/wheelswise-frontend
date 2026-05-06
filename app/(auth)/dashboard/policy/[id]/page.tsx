import { getData } from "@/utilities/api";
import {
  ADDITIONAL_BENEFITS_ENDPOINT,
  BENEFIT_EXTRAS_ENDPOINT,
  POLICY_DETAIL_ENDPOINT,
  SERVER_URL,
} from "@/utilities/endpoints";
import {
  AdditionalBenefit,
  BenefitExtras,
  InsurancePolicy,
} from "@/types/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@/utilities/constants";
import { CompletePaymentButton } from "@/components/policy/complete-payment-button";
import { CancelCertificateButton } from "@/components/policy/cancel-certificate-button";
import { ValuationSection } from "@/components/policy/ValuationSection";
import {
  ApplicableExcessesList,
  PolicyBenefitsList,
} from "@/components/policy/policy-benefits-list";
import {
  ArrowLeft,
  Car,
  Calendar,
  CreditCard,
  FileText,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Hourglass,
  ShieldCheck,
  ListChecks,
  BadgePercent,
  ClipboardCheck,
} from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Policy Details",
  robots: { index: false, follow: false },
};

function fmt(dateStr?: string | null) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function fmtCurrency(amount?: number | null) {
  if (amount == null || isNaN(amount)) return "—";
  return `KES ${amount.toLocaleString("en-KE")}`;
}

function or(value: string | undefined | null, fallback = "—") {
  return value?.trim() || fallback;
}

type Params = { id: string };

export default async function PolicyDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN)?.value ?? "";

  const policy: InsurancePolicy | undefined = await getData(
    `${POLICY_DETAIL_ENDPOINT}/${id}`,
  );

  if (!policy?.id) notFound();

  let additionalBenefits: AdditionalBenefit[] = [];
  if (policy.policy_benefits && policy.policy_benefits.length > 0) {
    try {
      const res = await fetch(`${SERVER_URL}${ADDITIONAL_BENEFITS_ENDPOINT}`, {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: policy.policy_benefits }),
      });
      if (res.ok) {
        additionalBenefits = await res.json();
      }
    } catch {
      // silently skip — benefits are supplemental
    }
  }

  let benefitExtras: BenefitExtras | null = null;
  if (policy.product_id) {
    try {
      benefitExtras = await getData(
        `${BENEFIT_EXTRAS_ENDPOINT}?underwriter_product_id=${policy.product_id}&exclude=additional_benefits`,
      );
    } catch {
      // silently skip — extras are supplemental
    }
  }

  const productBenefits = benefitExtras?.product_benefits ?? [];
  const applicableExcesses = benefitExtras?.applicable_excesses ?? [];

  const today = new Date();
  const expiryDate = policy.end_date ? new Date(policy.end_date) : null;
  const timeDiff =
    expiryDate && !isNaN(expiryDate.getTime())
      ? expiryDate.getTime() - today.getTime()
      : null;
  const daysRemaining =
    timeDiff != null ? Math.ceil(timeDiff / (1000 * 3600 * 24)) : null;
  const isExpired = timeDiff != null ? timeDiff <= 0 : false;
  const isExpiringSoon =
    !isExpired && timeDiff != null && timeDiff <= 30 * 24 * 3600 * 1000;
  const isCancelled = policy.is_cancelled;
  const isPendingPayment = !policy.is_paid && !isCancelled;

  const isActive = policy.is_paid && policy.is_active && !isExpired;

  const statusConfig = isCancelled
    ? {
        label: "Cancelled",
        icon: XCircle,
        className: "text-gray-600 bg-gray-100 border-gray-200",
        barColor: "bg-gray-300",
      }
    : isPendingPayment
      ? {
          label: "Pending Payment",
          icon: Hourglass,
          className: "text-blue-700 bg-blue-50 border-blue-200",
          barColor: "bg-blue-400",
        }
      : isExpired
        ? {
            label: "Expired",
            icon: AlertTriangle,
            className: "text-red-700 bg-red-50 border-red-200",
            barColor: "bg-red-500",
          }
        : isActive
          ? {
              label: "Active",
              icon: CheckCircle2,
              className: "text-emerald-700 bg-emerald-50 border-emerald-200",
              barColor: "bg-emerald-500",
            }
          : {
              label: "Pending",
              icon: Clock,
              className: "text-amber-700 bg-amber-50 border-amber-200",
              barColor: "bg-amber-400",
            };

  const valuationStatusConfig = (() => {
    const s = policy.valuation_status;
    if (!s) return null;
    const label = s
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const className =
      s === "COMPLETED"
        ? "text-emerald-700 bg-emerald-50 border-emerald-200"
        : s === "UNDER_REVIEW"
          ? "text-blue-700 bg-blue-50 border-blue-200"
          : s === "LODGED"
            ? "text-violet-700 bg-violet-50 border-violet-200"
            : s === "NOT_REQUIRED"
              ? "text-gray-600 bg-gray-100 border-gray-200"
              : "text-amber-700 bg-amber-50 border-amber-200";
    return { label, className };
  })();

  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-[#f0f6f9]">
      {/* Back nav */}
      <div className="px-4 md:px-8 pt-6 max-w-4xl mx-auto">
        <Link
          href="/dashboard?tab=policies"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to policies
        </Link>
      </div>

      {/* Hero header */}
      <div className="px-4 md:px-8 pt-4 pb-6 max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74] rounded-2xl px-6 md:px-10 py-8 shadow-lg">
          <div className="flex flex-col gap-4">
            <div className="min-w-0">
              <p className="text-white/60 text-xs uppercase tracking-widest mb-1">
                {policy.policy_type.replace("_", " ")} Insurance
              </p>
              <h1 className="text-xl md:text-2xl font-bold text-white">
                {or(
                  [policy.vehicle_details.make, policy.vehicle_details.model]
                    .filter(Boolean)
                    .join(" "),
                  "Unknown Vehicle",
                )}
              </h1>
              <p className="text-white/70 text-sm mt-1">
                {or(
                  policy.vehicle_details.registration_number,
                  "No Registration",
                )}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 text-sm font-medium border px-3 py-1.5 rounded-full ${statusConfig.className}`}
              >
                <StatusIcon className="w-4 h-4" />
                {statusConfig.label}
              </span>
              {isExpiringSoon && (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium border px-3 py-1.5 rounded-full text-amber-700 bg-amber-50 border-amber-200">
                  <AlertTriangle className="w-4 h-4" />
                  Expiring Soon
                </span>
              )}
              {valuationStatusConfig && (
                <span
                  className={`inline-flex items-center gap-1.5 text-sm font-medium border px-3 py-1.5 rounded-full ${valuationStatusConfig.className}`}
                >
                  <ClipboardCheck className="w-4 h-4" />
                  {valuationStatusConfig.label}
                </span>
              )}
              {isPendingPayment && (
                <CompletePaymentButton policyId={policy.id} token={token} />
              )}
              {!isCancelled && policy.certificate_issued && (
                <CancelCertificateButton policyId={policy.id} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 pb-12 max-w-4xl mx-auto space-y-5">
        {/* Policy Numbers */}
        <Section icon={FileText} title="Policy Information">
          <Grid>
            <Detail label="Policy Number" value={policy.policy_number ?? "—"} />
            <Detail label="Certificate Number" value={policy.certno ?? "—"} />
            <Detail
              label="Coverage Type"
              value={policy.policy_type.replace("_", " ")}
            />
            <Detail
              label="Certificate Issued"
              value={policy.certificate_issued ? "Yes" : "No"}
            />
            <Detail label="Date Created" value={fmt(policy.date_created)} />
            {policy.updated_at && (
              <Detail label="Last Updated" value={fmt(policy.updated_at)} />
            )}
            {policy.referral_code?.trim() && (
              <Detail label="Referral Code" value={policy.referral_code} mono />
            )}
          </Grid>
        </Section>

        {/* Coverage Dates */}
        <Section icon={Calendar} title="Coverage Period">
          <Grid>
            <Detail label="Start Date" value={fmt(policy.start_date)} />
            <Detail label="End Date" value={fmt(policy.end_date)} />
            {policy.days != null && (
              <Detail label="Duration" value={`${policy.days} days`} />
            )}
            {policy.is_paid && timeDiff != null && (
              <Detail
                label={isExpired ? "Status" : "Days Remaining"}
                value={isExpired ? "Expired" : `${daysRemaining} days`}
                valueClass={
                  isExpired
                    ? "text-red-600"
                    : isExpiringSoon
                      ? "text-amber-600"
                      : "text-emerald-600"
                }
              />
            )}
          </Grid>
        </Section>

        {/* Premium & Payment */}
        <Section icon={CreditCard} title="Premium & Payment">
          <Grid>
            <Detail label="Total Premium" value={fmtCurrency(policy.premium)} />
            <Detail
              label="Payment Status"
              value={policy.is_paid ? "Paid" : "Unpaid"}
              valueClass={policy.is_paid ? "text-emerald-600" : "text-red-600"}
            />
            {policy.payment_reference && (
              <Detail
                label="Payment Reference"
                value={policy.payment_reference}
                mono
              />
            )}
          </Grid>
        </Section>

        {/* Vehicle Details */}
        <Section icon={Car} title="Vehicle Details">
          <Grid>
            <Detail
              label="Make & Model"
              value={or(
                [policy.vehicle_details.make, policy.vehicle_details.model]
                  .filter(Boolean)
                  .join(" "),
              )}
            />
            <Detail
              label="Registration"
              value={or(policy.vehicle_details.registration_number)}
            />
            <Detail
              label="Body Type"
              value={or(policy.vehicle_details.body_type)}
            />
            <Detail
              label="Year of Manufacture"
              value={
                policy.vehicle_details.year_of_manufacture
                  ? String(policy.vehicle_details.year_of_manufacture)
                  : "—"
              }
            />
            <Detail
              label="Vehicle Value"
              value={fmtCurrency(policy.vehicle_details.vehicle_value)}
            />
            {policy.vehicle_details.engine_capacity ? (
              <Detail
                label="Engine Capacity"
                value={`${policy.vehicle_details.engine_capacity} cc`}
              />
            ) : null}
            {policy.vehicle_details.seating_capacity ? (
              <Detail
                label="Seating Capacity"
                value={`${policy.vehicle_details.seating_capacity} seats`}
              />
            ) : null}
            {policy.vehicle_details.chassis_number?.trim() ? (
              <Detail
                label="Chassis Number"
                value={policy.vehicle_details.chassis_number}
                mono
              />
            ) : null}
            {policy.vehicle_details.engine_number?.trim() ? (
              <Detail
                label="Engine Number"
                value={policy.vehicle_details.engine_number}
                mono
              />
            ) : null}
            {policy.vehicle_details.purpose?.trim() ? (
              <Detail label="Purpose" value={policy.vehicle_details.purpose} />
            ) : null}
          </Grid>
        </Section>

        {/* Policyholder / Proposer (Hirer) */}
        {policy.user && (
          <Section
            icon={User}
            title={policy.primary_user ? "Proposer (Hirer)" : "Policyholder"}
          >
            <Grid>
              <Detail label="Full Name" value={or(policy.user.name)} />
              <Detail label="Email" value={or(policy.user.email)} />
              <Detail label="Phone" value={or(policy.user.msisdn)} />
              <Detail label="ID Number" value={or(policy.user.id_number)} />
              <Detail label="KRA PIN" value={or(policy.user.kra_pin)} mono />
            </Grid>
          </Section>
        )}

        {/* Registered Owner (Hire Purchase only) */}
        {policy.primary_user && (
          <Section icon={User} title="Registered Owner">
            <Grid>
              <Detail label="Full Name" value={or(policy.primary_user.name)} />
              <Detail label="Email" value={or(policy.primary_user.email)} />
              <Detail label="Phone" value={or(policy.primary_user.msisdn)} />
              <Detail
                label="ID Number"
                value={or(policy.primary_user.id_number)}
              />
              <Detail
                label="KRA PIN"
                value={or(policy.primary_user.kra_pin)}
                mono
              />
            </Grid>
          </Section>
        )}

        {/* Vehicle Valuation */}
        {policy.valuation_status && (
          <ValuationSection
            valuationStatus={policy.valuation_status}
            underwriterId={policy.underwriter_id}
            policyId={policy.id}
          />
        )}

        {/* Policy Benefits */}
        {productBenefits.length > 0 && (
          <Section icon={ListChecks} title="Policy Benefits">
            <PolicyBenefitsList benefits={productBenefits} />
          </Section>
        )}

        {/* Applicable Excesses */}
        {applicableExcesses.length > 0 && (
          <Section icon={BadgePercent} title="Applicable Excesses">
            <ApplicableExcessesList excesses={applicableExcesses} />
          </Section>
        )}

        {/* Additional Benefits */}
        {additionalBenefits.length > 0 && (
          <Section icon={ShieldCheck} title="Additional Benefits">
            <div className="divide-y divide-[#e8f0f5]">
              {additionalBenefits.map((benefit) => (
                <div
                  key={benefit.id}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1e3a5f] truncate">
                        {or(benefit.name, "Unnamed Benefit")}
                      </p>
                      {benefit.percentage != null && (
                        <p className="text-[11px] text-muted-foreground">
                          {benefit.percentage}% of vehicle value
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right ml-4">
                    <p className="text-sm font-semibold text-[#1e3a5f]">
                      {benefit.base_amount != null
                        ? `${benefit.currency ?? "KES"} ${benefit.base_amount.toLocaleString("en-KE")}`
                        : "—"}
                    </p>
                    {benefit.duration_days != null && (
                      <p className="text-[11px] text-muted-foreground">
                        {benefit.duration_days} days
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#d7e8ee] shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#d7e8ee]">
        <div className="p-1.5 bg-primary/10 rounded-lg">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <h2 className="font-semibold text-[#1e3a5f] text-sm">{title}</h2>
      </div>
      <div className="px-5 py-5">{children}</div>
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
      {children}
    </div>
  );
}

function Detail({
  label,
  value,
  valueClass = "text-[#1e3a5f]",
  mono = false,
}: {
  label: string;
  value?: string | null;
  valueClass?: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">
        {label}
      </p>
      <p
        className={`text-sm font-semibold break-words ${valueClass} ${mono ? "font-mono text-xs" : ""}`}
      >
        {value?.trim() || "—"}
      </p>
    </div>
  );
}
