// components/policy-card.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InsurancePolicy } from "@/types/data";

type Props = {
  policy: InsurancePolicy;
};

export const PolicyCard = ({ policy }: Props) => {
  return (
    <Card className="bg-transparent border border-black/60 rounded-2xl text-black">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-6">
          {/* Left section */}
          <div className="flex gap-4">
            {/* Logo placeholder */}
            <div className="h-14 w-14 rounded-xl border border-black/60 flex items-center justify-center text-xs">
              Logo
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold tracking-wide">
                {policy.vehicleName}
              </h3>
              <p className="text-sm text-black/70">{policy.registration}</p>
              <p className="text-sm">{policy.insurer}</p>
            </div>
          </div>

          {/* Action */}
          <Button
            variant="outline"
            className="border-black/60 text-black hover:bg-black/10"
          >
            View Details
          </Button>
        </div>

        {/* Divider */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
          <InfoBlock label="Policy #" value={policy.policyNumber} />
          <InfoBlock label="Coverage" value={policy.coverage} />
          <InfoBlock
            label="Premium"
            value={`KES ${policy.premium.toLocaleString()}`}
          />
          <InfoBlock
            label="Expires"
            value={`${policy.expiryDate} (${policy.remainingDays} days)`}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const InfoBlock = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="space-y-1">
      <p className="text-black/60 text-xs uppercase tracking-widest">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
};
