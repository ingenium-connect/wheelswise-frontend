// components/vehicle-card.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Vehicle } from "@/types/data";

type Props = {
  vehicle: Vehicle;
};

export function VehicleCard({ vehicle }: Props) {
  return (
    <Card className="bg-transparent border border-black/60 rounded-2xl text-black">
      <CardContent className="p-5 space-y-3">
        <div>
          <h3 className="text-lg font-semibold tracking-wide">
            {vehicle.name}
          </h3>
          <p className="text-sm text-black/70">{vehicle.registration}</p>
        </div>

        <div className="flex justify-between text-sm pt-2">
          <span className="text-black/70">Color:</span>
          <span className="font-medium">{vehicle.color}</span>
        </div>
      </CardContent>
    </Card>
  );
}
