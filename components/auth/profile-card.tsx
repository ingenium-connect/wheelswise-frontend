import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types/data";
import { User, Phone, Mail, CreditCard, Hash } from "lucide-react";
import Link from "next/link";

type Props = {
  user: UserProfile;
};

export function AccountCard({ user }: Props) {
  const fields = [
    {
      icon: <User className="w-4 h-4" />,
      label: "Full Name",
      value: user.name,
    },
    {
      icon: <Hash className="w-4 h-4" />,
      label: "ID Number",
      value: user.id_number,
    },
    {
      icon: <CreditCard className="w-4 h-4" />,
      label: "KRA PIN",
      value: user.kra_pin,
    },
    {
      icon: <Phone className="w-4 h-4" />,
      label: "Phone Number",
      value: user.msisdn,
    },
    {
      icon: <Mail className="w-4 h-4" />,
      label: "Email Address",
      value: user.email,
    },
  ];

  return (
    <div className="max-w-2xl">
      {/* Profile header */}
      <Card className="border border-[#d7e8ee] shadow-sm mb-5 overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />
        <CardContent className="px-6 pb-6">
          <div className="-mt-8 mb-4 flex items-end gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div className="pb-1">
              <h2 className="text-lg font-bold text-[#1e3a5f]">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
              user.is_active
                ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                : "text-red-700 bg-red-50 border border-red-200"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${user.is_active ? "bg-emerald-500" : "bg-red-500"}`}
            />
            {user.is_active ? "Active Account" : "Inactive Account"}
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <Card className="border border-[#d7e8ee] shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-sm font-semibold text-[#1e3a5f] mb-5 uppercase tracking-wide">
            Account Information
          </h3>

          {!user ? (
            <p className="text-center text-muted-foreground py-8">
              No user data available.
            </p>
          ) : (
            <div className="space-y-4">
              {fields.map((field, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#f8fbfc] border border-[#d7e8ee]"
                >
                  <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
                    {field.icon}
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {field.label}
                    </p>
                    <p className="font-medium text-[#1e3a5f] text-sm">
                      {field.value || "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button
            variant="outline"
            className="w-full mt-6 border-primary text-primary hover:bg-primary/5"
            asChild
          >
            <Link href="/forgot-password">Reset PIN</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
