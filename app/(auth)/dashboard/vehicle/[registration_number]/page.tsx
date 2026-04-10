import { getData } from "@/utilities/api";
import { VEHICLE_DETAIL_ENDPOINT } from "@/utilities/endpoints";
import { Vehicle } from "@/types/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Car,
  Calendar,
  CreditCard,
  FileText,
  User,
  CheckCircle2,
  ShieldOff,
  AlertTriangle,
  Clock,
  Hourglass,
  XCircle,
  Wrench,
  BookOpen,
} from "lucide-react";
import { InsureVehicleButton } from "@/components/vehicle/insure-vehicle-button";
import {
  LogbookViewer,
  LogbookUploadPlaceholder,
} from "@/components/vehicle/logbook-viewer";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vehicle Details",
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

type Params = { registration_number: string };

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { registration_number } = await params;
  const decodedReg = decodeURIComponent(registration_number);

  const vehicle: Vehicle | undefined = await getData(
    `${VEHICLE_DETAIL_ENDPOINT}?registration_number=${decodedReg}`,
  );

  if (!vehicle?.id) notFound();

  const policy = vehicle.active_policy;
  const isInsured = !!policy;

  // Policy status logic
  let statusConfig = null;
  let daysRemaining: number | null = null;
  let isExpired = false;
  let isExpiringSoon = false;

  if (policy) {
    const today = new Date();
    const expiryDate = policy.end_date ? new Date(policy.end_date) : null;
    const timeDiff =
      expiryDate && !isNaN(expiryDate.getTime())
        ? expiryDate.getTime() - today.getTime()
        : null;
    daysRemaining =
      timeDiff != null ? Math.ceil(timeDiff / (1000 * 3600 * 24)) : null;
    isExpired = timeDiff != null ? timeDiff <= 0 : false;
    isExpiringSoon =
      !isExpired && timeDiff != null && timeDiff <= 30 * 24 * 3600 * 1000;
    const isCancelled = policy.is_cancelled;
    const isPendingPayment = !policy.is_paid && !isCancelled;
    const isActive = policy.is_paid && policy.is_active && !isExpired;

    statusConfig = isCancelled
      ? {
          label: "Cancelled",
          icon: XCircle,
          className: "text-gray-600 bg-gray-100 border-gray-200",
        }
      : isPendingPayment
        ? {
            label: "Pending Payment",
            icon: Hourglass,
            className: "text-blue-700 bg-blue-50 border-blue-200",
          }
        : isExpired
          ? {
              label: "Expired",
              icon: AlertTriangle,
              className: "text-red-700 bg-red-50 border-red-200",
            }
          : isActive
            ? {
                label: "Active",
                icon: CheckCircle2,
                className: "text-emerald-700 bg-emerald-50 border-emerald-200",
              }
            : {
                label: "Pending",
                icon: Clock,
                className: "text-amber-700 bg-amber-50 border-amber-200",
              };
  }

  return (
    <div className="min-h-screen bg-[#f0f6f9]">
      {/* Back nav */}
      <div className="px-4 md:px-8 pt-6 max-w-4xl mx-auto">
        <Link
          href="/dashboard?tab=vehicles"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to vehicles
        </Link>
      </div>

      {/* Hero header */}
      <div className="px-4 md:px-8 pt-4 pb-6 max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74] rounded-2xl px-6 md:px-10 py-8 shadow-lg">
          <div className="flex flex-col gap-4">
            <div className="min-w-0">
              <p className="text-white/60 text-xs uppercase tracking-widest mb-1">
                {or(vehicle.purpose)} Vehicle
              </p>
              <h1 className="text-xl md:text-2xl font-bold text-white">
                {vehicle.year_of_manufacture} {vehicle.make} {vehicle.model}
              </h1>
              <p className="text-white/70 text-sm mt-1">
                {vehicle.registration_number}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {isInsured ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium border px-3 py-1.5 rounded-full text-emerald-700 bg-emerald-50 border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                  Insured
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium border px-3 py-1.5 rounded-full text-amber-700 bg-amber-50 border-amber-200">
                  <ShieldOff className="w-4 h-4" />
                  Uninsured
                </span>
              )}
              {isExpiringSoon && (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium border px-3 py-1.5 rounded-full text-amber-700 bg-amber-50 border-amber-200">
                  <AlertTriangle className="w-4 h-4" />
                  Expiring Soon
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 pb-12 max-w-4xl mx-auto space-y-5">
        {/* Insure nudge */}
        {!isInsured && (
          <InsureVehicleButton vehicle={vehicle} />
        )}

        {/* Vehicle Identification */}
        <Section icon={Car} title="Vehicle Identification">
          <Grid>
            <Detail label="Registration" value={vehicle.registration_number} />
            <Detail label="Make" value={vehicle.make} />
            <Detail label="Model" value={vehicle.model} />
            <Detail label="Body Type" value={or(vehicle.body_type)} />
            <Detail
              label="Year of Manufacture"
              value={String(vehicle.year_of_manufacture)}
            />
            <Detail label="Purpose" value={or(vehicle.purpose)} />
          </Grid>
        </Section>

        {/* Technical Specifications */}
        <Section icon={Wrench} title="Technical Specifications">
          <Grid>
            {vehicle.chassis_number && (
              <Detail
                label="Chassis Number"
                value={vehicle.chassis_number}
                mono
              />
            )}
            {vehicle.engine_number && (
              <Detail
                label="Engine Number"
                value={vehicle.engine_number}
                mono
              />
            )}
            {vehicle.engine_capacity != null && (
              <Detail
                label="Engine Capacity"
                value={`${vehicle.engine_capacity} cc`}
              />
            )}
            <Detail
              label="Seating Capacity"
              value={
                vehicle.seating_capacity
                  ? `${vehicle.seating_capacity} seats`
                  : "—"
              }
            />
            {vehicle.tonnage != null && (
              <Detail label="Tonnage" value={`${vehicle.tonnage} T`} />
            )}
            <Detail
              label="Vehicle Value"
              value={fmtCurrency(vehicle.vehicle_value)}
            />
          </Grid>
        </Section>

        {/* Logbook */}
        <Section icon={BookOpen} title="Vehicle Logbook">
          {vehicle.logbook_url ? (
            <LogbookViewer url={vehicle.logbook_url} />
          ) : (
            <LogbookUploadPlaceholder
              vehicleId={vehicle.id}
              registrationNumber={vehicle.registration_number}
            />
          )}
        </Section>

        {/* Active Policy */}
        {policy && (
          <>
            <Section icon={FileText} title="Active Policy">
              <Grid>
                <Detail
                  label="Policy Number"
                  value={policy.policy_number ?? "—"}
                />
                <Detail
                  label="Certificate Number"
                  value={policy.certno ?? "—"}
                />
                <Detail
                  label="Coverage Type"
                  value={policy.policy_type.replace("_", " ")}
                />
                {statusConfig && (
                  <Detail
                    label="Status"
                    value={statusConfig.label}
                    valueClass={
                      statusConfig.label === "Active"
                        ? "text-emerald-600"
                        : statusConfig.label === "Expired"
                          ? "text-red-600"
                          : "text-[#1e3a5f]"
                    }
                  />
                )}
                <Detail
                  label="Certificate Issued"
                  value={policy.certificate_issued ? "Yes" : "No"}
                />
                <Detail
                  label="Date Created"
                  value={fmt(policy.date_created)}
                />
              </Grid>
            </Section>

            {/* Coverage Period */}
            <Section icon={Calendar} title="Coverage Period">
              <Grid>
                <Detail label="Start Date" value={fmt(policy.start_date)} />
                <Detail label="End Date" value={fmt(policy.end_date)} />
                {policy.days != null && (
                  <Detail label="Duration" value={`${policy.days} days`} />
                )}
                {policy.is_paid && daysRemaining != null && (
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
                  valueClass={
                    policy.is_paid ? "text-emerald-600" : "text-red-600"
                  }
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

            {/* Policyholder */}
            {policy.user && (
              <Section icon={User} title="Policyholder">
                <Grid>
                  <Detail label="Full Name" value={or(policy.user.name)} />
                  <Detail label="Email" value={or(policy.user.email)} />
                  <Detail label="Phone" value={or(policy.user.msisdn)} />
                  <Detail
                    label="ID Number"
                    value={or(policy.user.id_number)}
                  />
                  <Detail
                    label="KRA PIN"
                    value={or(policy.user.kra_pin)}
                    mono
                  />
                </Grid>
              </Section>
            )}
          </>
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
