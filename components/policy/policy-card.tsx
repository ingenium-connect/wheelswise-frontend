import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InsurancePolicy } from "@/types/data";
import { Shield, AlertTriangle, CheckCircle2 } from "lucide-react";

type Props = {
  policy: InsurancePolicy;
};

export const PolicyCard = ({ policy }: Props) => {
  const isExpiringSoon = policy.remainingDays <= 30;
  const isExpired = policy.remainingDays <= 0;

  const statusBadge = isExpired ? (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
      <AlertTriangle className="w-3.5 h-3.5" />
      Expired
    </span>
  ) : isExpiringSoon ? (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
      <AlertTriangle className="w-3.5 h-3.5" />
      Expiring Soon
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
      <CheckCircle2 className="w-3.5 h-3.5" />
      Active
    </span>
  );

  return (
    <Card className="border border-[#d7e8ee] shadow-md hover:shadow-xl transition-shadow duration-200 rounded-2xl overflow-hidden">
      {/* Status bar */}
      <div
        className={`h-1.5 w-full ${
          isExpired
            ? "bg-red-500"
            : isExpiringSoon
              ? "bg-amber-400"
              : "bg-emerald-500"
        }`}
      />

      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl shrink-0">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-[#1e3a5f]">
                {policy.vehicleName}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {policy.registration}
              </p>
              <p className="text-sm text-primary font-medium mt-0.5">
                {policy.insurer}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            {statusBadge}
            <Button
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary/5 text-xs"
            >
              View Details
            </Button>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[#d7e8ee] pt-4 text-sm">
          <InfoBlock label="Policy #" value={policy.policyNumber} />
          <InfoBlock label="Coverage" value={policy.coverage} />
          <InfoBlock
            label="Premium"
            value={`KES ${policy.premium.toLocaleString()}`}
          />
          <InfoBlock
            label="Expires"
            value={policy.expiryDate}
            sub={`${policy.remainingDays} days remaining`}
            subColor={isExpired ? "text-red-500" : isExpiringSoon ? "text-amber-500" : "text-emerald-600"}
          />
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
  value: string;
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
