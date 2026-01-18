import { Card, CardContent } from "@/components/ui/card";
import { Vehicle } from "@/types/data";
import { Button } from "../ui/button";

type Props = {
  vehicle: Vehicle;
  insured?: boolean;
};

export function VehicleCard({ vehicle, insured = false }: Props) {
  const {
    make,
    model,
    registration_number,
    body_type,
    seating_capacity,
    tonnage,
    vehicle_value,
    year_of_manufacture,
  } = vehicle;

  return (
    <Card className="bg-transparent p-6 relative rounded-2xl border border-black/60 text-black shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold tracking-wide">
            {year_of_manufacture || "—"} {make} {model}
          </h3>
          <p className="mt-1 text-sm opacity-90">{registration_number}</p>
        </div>

        <Button
          variant="outline"
          className="border-black text-black hover:bg-black/10"
        >
          {insured ? "Insured / Covered" : "Insure"}
        </Button>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-y-6 text-md">
        <div className="opacity-80">Body Type:</div>
        <div className="text-right font-medium">{body_type || "—"}</div>

        <div className="opacity-80">Seating Capacity:</div>
        <div className="text-right font-medium">{seating_capacity || "—"}</div>

        <div className="opacity-80">Tonnage:</div>
        <div className="text-right font-medium">
          {tonnage ? `${tonnage} Tons` : "—"}
        </div>

        <div className="opacity-80">Vehicle Value:</div>
        <div className="text-right font-medium">
          KES {vehicle_value.toLocaleString()}
        </div>
      </div>
    </Card>
  );
}
