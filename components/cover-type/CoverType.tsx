"use client";

import { useRouter } from "next/navigation";
import { CoverTypesResponse } from "@/types/data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Shield, ShieldCheck } from "lucide-react";
import { useInsuranceStore } from "@/stores/insuranceStore";
import { useEffect } from "react";

type Props = {
  data: CoverTypesResponse;
};

const CoverMappings: Record<
  string,
  {
    features: string[];
    description: string;
    path: string;
    icon: React.ReactNode;
    accent: string;
  }
> = {
  THIRD_PARTY: {
    description:
      "Essential coverage that protects against third-party damages. Meets all legal requirements at an affordable premium.",
    features: [
      "Covers damage to other vehicles",
      "Covers injury to third parties",
      "Meets legal requirements",
      "Budget-friendly premiums",
    ],
    path: "/motor-type",
    icon: <Shield className="w-7 h-7 text-primary" />,
    accent: "from-primary/5 to-white",
  },
  COMPREHENSIVE: {
    description:
      "Complete protection including third-party, accidental damage, theft, fire, and natural disasters.",
    features: [
      "Third-party coverage included",
      "Covers theft and fire damage",
      "Personal accident protection",
      "Covers natural disasters",
    ],
    path: "/motor-type",
    icon: <ShieldCheck className="w-7 h-7 text-emerald-600" />,
    accent: "from-emerald-50 to-white",
  },
};

const SelectCoverType = ({ data }: Props) => {
  const router = useRouter();
  const selectCover = useInsuranceStore((state) => state.selectCover);
  const setCoverStep = useInsuranceStore((state) => state.setCoverStep);

  useEffect(() => {
    setCoverStep(0);
  }, [setCoverStep]);

  const handleSelect = (type: string, path: string) => {
    selectCover(type);
    router.push(`${path}/${type}`);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
        {(data?.coverTypes ?? []).map((type) => {
          const mapping = CoverMappings[type.type];
          if (!mapping) return null;

          return (
            <Card
              key={type.id}
              className="border border-[#d7e8ee] shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              {/* Top accent bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#1e3a5f] via-[#397397] to-[#2e5e74]" />

              <CardContent className="p-6 flex flex-col h-full">
                {/* Header */}
                <div className={`flex items-center gap-3 bg-gradient-to-br ${mapping.accent} rounded-xl p-4 mb-5`}>
                  <div className="p-2.5 bg-white rounded-xl shadow-sm shrink-0">
                    {mapping.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1e3a5f] text-lg leading-tight">
                      {type.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {mapping.description}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-6 flex-1">
                  {mapping.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm text-[#1e3a5f]">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  size="lg"
                  className="w-full text-white"
                  onClick={() => handleSelect(type.type, mapping.path)}
                >
                  Select {type.name}
                </Button>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
};

export default SelectCoverType;
