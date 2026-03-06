"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

const DateSelectionClient = () => {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const dateInputRef = useRef<HTMLInputElement>(null);

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 7);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const handleNext = () => {
    if (!startDate) {
      alert("Please select a start date.");
      return;
    }
    localStorage.setItem("policyStartDate", startDate);
    router.push("/payment-summary");
  };

  return (
    <div className="max-w-sm mx-auto space-y-6">
      <Card
        className="border border-[#d7e8ee] shadow-sm cursor-pointer"
        onClick={() => dateInputRef.current?.showPicker()}
      >
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl shrink-0">
              <CalendarDays className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">
                Select a date within 7 days from today
              </p>
              <input
                ref={dateInputRef}
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={formatDate(today)}
                max={formatDate(maxDate)}
                className="w-full border border-[#d7e8ee] rounded-lg px-3 py-2 text-sm text-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white cursor-pointer"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
        <span className="font-semibold">Note:</span> Vehicle valuation is
        mandatory for comprehensive products before cover can be activated.
      </p>

      <div className="flex gap-4">
        <Button
          variant="outline"
          className="flex-1 border-[#d7e8ee] text-[#1e3a5f] hover:bg-[#f0f6f9]"
          onClick={() => router.back()}
        >
          Back
        </Button>
        <Button className="flex-1 text-white" onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default DateSelectionClient;
