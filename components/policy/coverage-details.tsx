"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";

type CoverageDetailItem = {
  header: string;
  description: string;
  conditions: string[];
};

type CoverageDetailsProps = {
  coverageDetails: CoverageDetailItem[];
};

export function CoverageDetails({ coverageDetails }: CoverageDetailsProps) {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [sectionExpanded, setSectionExpanded] = useState(false);

  if (coverageDetails.length === 0) {
    return null;
  }

  const toggleSection = (header: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [header]: !prev[header],
    }));
  };

  // Render as a standalone section with expandable items
  return (
    <div className="bg-white rounded-2xl border border-[#d7e8ee] shadow-sm overflow-hidden">
      <button
        onClick={() => setSectionExpanded(!sectionExpanded)}
        className="w-full flex items-center justify-between px-5 py-4 border-b border-[#d7e8ee] bg-gradient-to-r from-[#f0f6f9] to-white hover:bg-gradient-to-r hover:from-[#e8f0f5] hover:to-[#e0e8f4] transition-colors"
        aria-expanded={sectionExpanded}
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <div className="text-left">
            <h2 className="font-semibold text-[#1e3a5f] text-sm">
              What&apos;s covered by this product
            </h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {sectionExpanded ? "Click to collapse" : "Click to expand"} -{" "}
              {coverageDetails.length} items
            </p>
          </div>
        </div>
        {sectionExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-200 ease-in-out",
          sectionExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="p-5 space-y-3">
          {coverageDetails.map((item) => (
            <div
              key={item.header}
              className="border border-border rounded-xl overflow-hidden bg-muted/30"
            >
              <button
                onClick={() => toggleSection(item.header)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
                aria-expanded={!!expandedSections[item.header]}
              >
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-sm font-semibold text-[#1e3a5f] text-left">
                    {item.header}
                  </span>
                </div>
                {expandedSections[item.header] ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              <div
                className={cn(
                  "overflow-hidden transition-all duration-200 ease-in-out",
                  expandedSections[item.header]
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0",
                )}
              >
                <div className="px-4 pb-4 pl-4">
                  {item.description && (
                    <p className="text-sm text-muted-foreground mb-3 pl-5">
                      {item.description}
                    </p>
                  )}
                  {item.conditions.length > 0 && (
                    <ul className="space-y-2 pl-5">
                      {item.conditions.map((condition, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
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
    </div>
  );
}
