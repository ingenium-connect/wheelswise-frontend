import FlowStepHeader from "@/components/layout/FlowStepHeader";
import DateSelectionClient from "@/components/DateSelectionClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Select Cover Start Date",
  robots: { index: false, follow: true },
};

export default function DateSelectionPage() {
  return (
    <>
      <FlowStepHeader
        title="Policy Start Date"
        subtitle="Choose when you'd like your cover to begin."
      />
      <div className="bg-[#f0f6f9] flex-1 px-4 md:px-8 py-8">
        <DateSelectionClient />
      </div>
    </>
  );
}
