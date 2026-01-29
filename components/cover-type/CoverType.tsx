"use client";

import { useRouter } from "next/navigation";
import { CoverTypesResponse } from "@/types/data";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useInsuranceStore } from "@/store/store";
import { useEffect } from "react";

type Props = {
  data: CoverTypesResponse;
};

const CoverMappings: Record<
  string,
  { features: string[]; description: string; path: string }
> = {
  THIRD_PARTY: {
    description:
      "Essential coverage that protects against third-party damages.",
    features: [
      "Covers damage to other vehicles",
      "Covers injury to third parties",
      "Meets legal requirements",
      "Budget-friendly premiums",
    ],
    path: "/motor-type",
  },
  COMPREHENSIVE: {
    description:
      "Complete protection including third-party and accidental damage.",
    features: [
      "Third-party coverage included",
      "Covers theft and fire damage",
      "Personal accident protection",
      "Covers natural disasters (flood, storm, etc.)",
    ],
    path: "/motor-type",
  },
};

const SelectCoverType = ({ data }: Props) => {
  const router = useRouter();
  const selectCover = useInsuranceStore((state) => state.selectCover);
  const setCoverStep = useInsuranceStore((state) => state.setCoverStep);

  useEffect(() => {
    setCoverStep(0);
  }, []);

  const handleSelect = (type: string, path: string) => {
    selectCover(type);

    router.push(`${path}/${type}`);
  };

  return (
    <>
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {(data?.coverTypes ?? []).map((type) => {
          const mapping = CoverMappings[type.type];
          return (
            <Card
              key={type.id}
              className="shadow-lg border border-[#d7e8ee] hover:shadow-xl transition duration-200"
            >
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-semibold text-primary">
                  {type.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {mapping?.description}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-left">
                  {mapping?.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button
                  size="lg"
                  className="w-full bg-primary hover:bg-[#2e5e74] text-white font-semibold rounded-lg"
                  onClick={() => handleSelect(type.type, mapping.path)}
                >
                  Select {type.name}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-10">
        <Badge className="bg-primary/10 text-[#2e5e74] px-3 py-1 rounded-full">
          Secure your vehicle with trusted coverage
        </Badge>
      </div>
    </>
  );
};

export default SelectCoverType;
