import Link from "next/link";
import React from "react";
import { Car, FileText, AlertTriangle, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  name: string;
  vehicleCount: number;
  policyCount: number;
  expiringSoonCount: number;
};

const DashboardBanner = ({ name, vehicleCount, policyCount, expiringSoonCount }: Props) => {
  const stats = [
    {
      icon: <Car className="w-5 h-5 text-primary" />,
      label: "Total Vehicles",
      value: vehicleCount,
      bg: "bg-primary/10",
      href: "/dashboard?tab=vehicle",
    },
    {
      icon: <FileText className="w-5 h-5 text-emerald-600" />,
      label: "Active Policies",
      value: policyCount,
      bg: "bg-emerald-50",
      href: "/dashboard?tab=policies",
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
      label: "Expiring Soon",
      value: expiringSoonCount,
      bg: "bg-amber-50",
      href: "/dashboard?tab=policies",
    },
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Welcome card */}
      <Card className="border border-[#d7e8ee] shadow-sm bg-gradient-to-r from-[#d7e8ee]/60 to-white">
        <CardContent className="p-8">
          <h2 className="text-xl font-semibold text-[#1e3a5f] mb-2">
            Hello, {name} 👋
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Here&apos;s an overview of your insurance portfolio. Keep your
            coverage up to date for peace of mind on every journey.
          </p>
        </CardContent>
      </Card>

      {/* Stats */}
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-medium">
          At a Glance
        </p>
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <Link key={i} href={stat.href}>
              <Card className="border border-[#d7e8ee] shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
                <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                  <div className={`p-3 rounded-full ${stat.bg}`}>{stat.icon}</div>
                  <p className="text-3xl font-bold text-[#1e3a5f]">
                    {stat.value ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-medium">
          Quick Actions
        </p>
        <Card className="border border-[#d7e8ee] shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <Button
                asChild
                size="lg"
                className="w-full text-white justify-between whitespace-normal h-auto py-3"
              >
                <Link href="/cover-type">
                  <span className="flex items-center gap-2">
                    <Plus className="w-4 h-4 shrink-0" />
                    Insure a New Vehicle
                  </span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full justify-between border-primary text-primary hover:bg-primary/5 whitespace-normal h-auto py-3"
              >
                <Link href="/dashboard?tab=policies">
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 shrink-0" />
                    View My Policies
                  </span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardBanner;
