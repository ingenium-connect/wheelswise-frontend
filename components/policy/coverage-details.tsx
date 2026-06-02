"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, FileText, Info, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

type CoverageDetailItem = {
  header: string;
  description: string;
  conditions: string[];
};

type CoverageDetailsProps = {
  coverageDetails: CoverageDetailItem[];
  variant?: "default" | "drawer";
};

export function CoverageDetails({ coverageDetails, variant = "default" }: CoverageDetailsProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (coverageDetails.length === 0) {
    return null;
  }

  const toggleSection = (header: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [header]: !prev[header],
    }));
  };

  // Render as a drawer trigger button for the default variant
  if (variant === "default") {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Info className="w-4 h-4" />
            <span className="font-medium">What&apos;s covered by this product</span>
          </div>
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <button className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                View Details
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </DrawerTrigger>
            <DrawerContent side="right" className="sm:max-w-md w-full">
              <DrawerHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <DrawerTitle className="text-[#1e3a5f]">What&apos;s covered</DrawerTitle>
                      <DrawerDescription className="text-xs">
                        Product coverage details
                      </DrawerDescription>
                    </div>
                  </div>
                  <DrawerTrigger asChild>
                    <button className="rounded-full p-1 hover:bg-muted transition-colors">
                      <X className="w-4 h-4 text-muted-foreground" />
                      <span className="sr-only">Close</span>
                    </button>
                  </DrawerTrigger>
                </div>
              </DrawerHeader>
              <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
                {coverageDetails.map((item) => (
                  <div
                    key={item.header}
                    className="border border-border rounded-xl overflow-hidden bg-white"
                  >
                    <button
                      onClick={() => toggleSection(item.header)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
                      aria-expanded={!!expandedSections[item.header]}
                    >
                      <span className="text-sm font-semibold text-[#1e3a5f] text-left">
                        {item.header}
                      </span>
                      {expandedSections[item.header] ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>

                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-200 ease-in-out",
                        expandedSections[item.header] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      )}
                    >
                      <div className="px-4 pb-4 pl-4">
                        {item.description && (
                          <p className="text-sm text-muted-foreground mb-3">
                            {item.description}
                          </p>
                        )}
                        {item.conditions.length > 0 && (
                          <ul className="space-y-2">
                            {item.conditions.map((condition, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                <span className="leading-relaxed">{condition}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        <div className="space-y-2">
          {coverageDetails.map((item) => (
            <div
              key={item.header}
              className="border border-[#d7e8ee] rounded-xl overflow-hidden bg-white/50"
            >
              <button
                onClick={() => toggleSection(item.header)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#f0f6f9] transition-colors"
                aria-expanded={!!expandedSections[item.header]}
              >
                <span className="text-sm font-semibold text-[#1e3a5f] text-left">
                  {item.header}
                </span>
                {expandedSections[item.header] ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              <div
                className={cn(
                  "overflow-hidden transition-all duration-200 ease-in-out",
                  expandedSections[item.header] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="px-4 pb-3 pl-4">
                  {item.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.description}
                    </p>
                  )}
                  {item.conditions.length > 0 && (
                    <ul className="space-y-1.5">
                      {item.conditions.map((condition, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          <span>{condition}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render as a full drawer content for the drawer variant
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <div className="p-2 bg-primary/10 rounded-lg">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-[#1e3a5f]">What&apos;s covered</h3>
          <p className="text-xs text-muted-foreground">Product coverage details</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {coverageDetails.map((item) => (
          <div
            key={item.header}
            className="border border-border rounded-xl overflow-hidden"
          >
            <button
              onClick={() => toggleSection(item.header)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
              aria-expanded={!!expandedSections[item.header]}
            >
              <span className="text-sm font-semibold text-[#1e3a5f] text-left">
                {item.header}
              </span>
              {expandedSections[item.header] ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>

            <div
              className={cn(
                "overflow-hidden transition-all duration-200 ease-in-out",
                expandedSections[item.header] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="px-4 pb-4 pl-4">
                {item.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {item.description}
                  </p>
                )}
                {item.conditions.length > 0 && (
                  <ul className="space-y-2">
                    {item.conditions.map((condition, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        <span className="leading-relaxed">{condition}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
