import { getData } from "@/utilities/api";
import { POLICY_DETAIL_ENDPOINT } from "@/utilities/endpoints";
import { InsurancePolicy } from "@/types/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@/utilities/constants";
import { CompletePaymentButton } from "@/components/policy/complete-payment-button";
import {
  ArrowLeft,
  Car,
  Shield,
  Calendar,
  CreditCard,
  FileText,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Hourglass,
} from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Policy Details",
  robots: { index: false, follow: false },
};

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function fmtCurrency(amount: number) {
  return `KES ${amount.toLocaleString("en-KE")}`;
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

  const today = new Date();
  const expiryDate = new Date(policy.end_date);
  const timeDiff = expiryDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
  const isExpired = timeDiff <= 0;
  const isExpiringSoon = !isExpired && timeDiff <= 30 * 24 * 3600 * 1000;
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
        : isExpiringSoon
          ? {
              label: "Expiring Soon",
              icon: AlertTriangle,
              className: "text-amber-700 bg-amber-50 border-amber-200",
              barColor: "bg-amber-400",
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-white/60 text-xs uppercase tracking-widest mb-1">
                {policy.policy_type.replace("_", " ")} Insurance
              </p>
              <h1 className="text-xl md:text-2xl font-bold text-white">
                {policy.vehicle_details.make} {policy.vehicle_details.model}
              </h1>
              <p className="text-white/70 text-sm mt-1">
                {policy.vehicle_details.registration_number}
              </p>
            </div>
            <div className="self-start sm:self-center flex flex-col items-end gap-3">
              <span
                className={`inline-flex items-center gap-1.5 text-sm font-medium border px-3 py-1.5 rounded-full ${statusConfig.className}`}
              >
                <StatusIcon className="w-4 h-4" />
                {statusConfig.label}
              </span>
              {isPendingPayment && (
                <CompletePaymentButton policyId={policy.id} token={token} />
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
            <Detail
              label="Certificate Number"
              value={policy.certno ?? "—"}
            />
            <Detail
              label="Coverage Type"
              value={policy.policy_type.replace("_", " ")}
            />
            <Detail
              label="Certificate Issued"
              value={policy.certificate_issued ? "Yes" : "No"}
            />
            <Detail
              label="Date Created"
              value={fmt(policy.date_created)}
            />
            {policy.updated_at && (
              <Detail label="Last Updated" value={fmt(policy.updated_at)} />
            )}
          </Grid>
        </Section>

        {/* Coverage Dates */}
        <Section icon={Calendar} title="Coverage Period">
          <Grid>
            <Detail
              label="Start Date"
              value={fmt(policy.start_date)}
            />
            <Detail
              label="End Date"
              value={fmt(policy.end_date)}
            />
            <Detail label="Duration" value={`${policy.days} days`} />
            {policy.is_paid && (
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
            <Detail
              label="Total Premium"
              value={fmtCurrency(policy.premium)}
            />
            <Detail
              label="Underwriter Premium"
              value={fmtCurrency(policy.onetime_underwriter_premium)}
            />
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
              value={`${policy.vehicle_details.make} ${policy.vehicle_details.model}`}
            />
            <Detail
              label="Registration"
              value={policy.vehicle_details.registration_number}
            />
            <Detail
              label="Body Type"
              value={policy.vehicle_details.body_type}
            />
            <Detail
              label="Year of Manufacture"
              value={String(policy.vehicle_details.year_of_manufacture)}
            />
            <Detail
              label="Vehicle Value"
              value={fmtCurrency(policy.vehicle_details.vehicle_value)}
            />
            {policy.vehicle_details.engine_capacity && (
              <Detail
                label="Engine Capacity"
                value={`${policy.vehicle_details.engine_capacity} cc`}
              />
            )}
            {policy.vehicle_details.seating_capacity && (
              <Detail
                label="Seating Capacity"
                value={`${policy.vehicle_details.seating_capacity} seats`}
              />
            )}
            {policy.vehicle_details.chassis_number && (
              <Detail
                label="Chassis Number"
                value={policy.vehicle_details.chassis_number}
                mono
              />
            )}
            {policy.vehicle_details.engine_number && (
              <Detail
                label="Engine Number"
                value={policy.vehicle_details.engine_number}
                mono
              />
            )}
            {policy.vehicle_details.purpose && (
              <Detail
                label="Purpose"
                value={policy.vehicle_details.purpose}
              />
            )}
          </Grid>
        </Section>

        {/* Policyholder */}
        {policy.user && (
          <Section icon={User} title="Policyholder">
            <Grid>
              <Detail label="Full Name" value={policy.user.name} />
              <Detail label="Email" value={policy.user.email} />
              <Detail label="Phone" value={policy.user.msisdn} />
              <Detail label="ID Number" value={policy.user.id_number} />
              <Detail label="KRA PIN" value={policy.user.kra_pin} mono />
            </Grid>
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
  value: string;
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
        {value}
      </p>
    </div>
  );
}
