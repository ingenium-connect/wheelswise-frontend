import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types/data";

type Props = {
  user: UserProfile;
};

export function AccountCard({ user }: Props) {
  return (
    <Card className="bg-transparent border border-black/60 rounded-2xl text-black max-w-2xl">
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl border border-black/60 flex items-center justify-center text-xs">
            Account
            <br />
            Icon
          </div>
          <h2 className="text-lg font-semibold tracking-wide">
            Account Information
          </h2>
        </div>

        {/* Details */}
        {!user ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No user data available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <Info label="Name" value={user.name} />
            <Info label="ID Number" value={user.id_number} />
            <Info label="KRA PIN" value={user.kra_pin} />

            <Info label="Phone Number" value={user.msisdn} />
            <Info label="Email" value={user.email} />
          </div>
        )}

        {/* Action */}
        <Button
          variant="outline"
          className="w-full border-black/60 text-black hover:bg-black/10"
        >
          Change Password
        </Button>
      </CardContent>
    </Card>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-widest text-black/60">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
