"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { LinkPolicyPayload } from "@/types/data";
import { linkPolicyAction } from "@/app/actions/link-policy";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import VehicleSelect from "./VehicleSelect";

// Type for Axios error with response
interface AxiosErrorWithResponse extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Helper function to calculate end date
const calculateEndDate = (
  startDate: string,
  durationInDays: number,
): string => {
  if (!startDate) return "";
  // Parse the date string to avoid timezone issues
  const [year, month, day] = startDate.split("-").map(Number);
  const start = new Date(year, month - 1, day);
  const end = new Date(start);
  end.setDate(end.getDate() + durationInDays);
  return `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}-${String(end.getDate()).padStart(2, "0")}`;
};

const formSchema = z.object({
  vehicle_registration_number: z
    .string()
    .min(1, { message: "Vehicle registration number is required" })
    .max(20, { message: "Registration number must be 20 characters or less" }),
  policy_number: z
    .string()
    .min(1, { message: "Policy number is required" })
    .max(50, { message: "Policy number must be 50 characters or less" }),
  certificate_number: z
    .string()
    .min(1, { message: "Certificate number is required" })
    .max(10, { message: "Certificate number must be 10 characters or less" }),
  start_date: z.string().min(1, { message: "Start date is required" }),
  end_date: z.string().optional(),
  underwriter_name: z
    .string()
    .min(1, { message: "Underwriter name is required" })
    .max(100, { message: "Underwriter name must be 100 characters or less" }),
  duration_in_days: z.number().int().positive().max(365, {
    message: "Duration must be 365 days or less",
  }),
  policy_type: z.enum(["COMPREHENSIVE", "THIRD_PARTY"], {
    message: "Policy type is required",
  }),
  vehicle_type: z.enum(["PRIVATE", "COMMERCIAL", "MOTORBIKE", "PSV"], {
    message: "Vehicle type is required",
  }),
  premium: z.number(),
});

type FormValues = z.infer<typeof formSchema>;

interface LinkExternalPolicyDialogProps {
  trigger?: React.ReactNode;
}

export default function LinkExternalPolicyDialog({
  trigger,
}: LinkExternalPolicyDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicle_registration_number: "",
      policy_number: "",
      certificate_number: "",
      start_date: (() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      })(),
      end_date: "",
      underwriter_name: "",
      duration_in_days: 365,
      policy_type: "COMPREHENSIVE",
      vehicle_type: "PRIVATE",
      premium: 0,
    },
  });

  // Watch for changes to start_date, duration_in_days, and policy_type to update end_date
  const startDateString = form.watch("start_date");
  const policyType = form.watch("policy_type");
  const durationDays = form.watch("duration_in_days");

  // Calculate end date based on start date and duration (only if duration is populated)
  const endDate =
    durationDays && durationDays > 0
      ? calculateEndDate(startDateString, durationDays)
      : "";

  // Update end_date field when start_date or duration changes
  useEffect(() => {
    form.setValue("end_date", endDate);
  }, [endDate, form]);

  // Auto-populate duration based on policy type when selected
  useEffect(() => {
    if (policyType === "COMPREHENSIVE") {
      // Only set duration if it's currently 0 or empty
      const currentDuration = form.getValues("duration_in_days");
      if (!currentDuration || currentDuration === 0) {
        form.setValue("duration_in_days", 365);
      }
    } else if (policyType === "THIRD_PARTY") {
      // Only set duration if it's currently 0 or empty
      const currentDuration = form.getValues("duration_in_days");
      if (!currentDuration || currentDuration === 0) {
        form.setValue("duration_in_days", 365);
      }
    }
  }, [policyType, form]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    console.log("LinkExternalPolicyDialog submit triggered", values);

    const payload: LinkPolicyPayload = {
      vehicle_registration_number: values.vehicle_registration_number
        .toUpperCase()
        .trim(),
      policy_number: values.policy_number.trim(),
      certificate_number: values.certificate_number.trim(),
      start_date: values.start_date,
      underwriter_name: values.underwriter_name.trim(),
      duration_in_days: values.duration_in_days,
      policy_type: values.policy_type,
      vehicle_type: values.vehicle_type,
      premium: values.premium,
    };

    try {
      const response = await linkPolicyAction(payload);

      if (response?.data?.message) {
        toast.success("Policy linked successfully!");
        setIsOpen(false);
        form.reset();
        // Navigate to policies tab after successful link
        router.push("/dashboard?tab=policies");
      } else {
        toast.success("Policy linked successfully!");
        setIsOpen(false);
        form.reset();
        // Navigate to policies tab after successful link
        router.push("/dashboard?tab=policies");
      }
    } catch (error: unknown) {
      let errorMessage = "Failed to link policy. Please try again.";
      let nextSteps = "";

      if (error instanceof Error) {
        const errorMsgLower = error.message.toLowerCase();
        // Handle the specific error for already linked vehicle
        if (
          errorMsgLower.includes("you can only link your vehicle policy") &&
          errorMsgLower.includes("once and only once")
        ) {
          // Extract vehicle registration number from error message
          const regNumMatch = error.message.match(/[A-Z0-9]{3,7}[A-Z]?/);
          const _regNum = regNumMatch ? regNumMatch[0] : "this vehicle";
          errorMessage = `You have already linked a policy for ${_regNum}.`;
          nextSteps =
            "You may only link each vehicle's policy once from an external underwriter. Please select a different vehicle or contact support for assistance.";
        } else if (errorMsgLower.includes("vehicle policy for")) {
          const regNumMatch = error.message.match(/[A-Z0-9]{3,7}[A-Z]?/);
          const _regNum = regNumMatch ? regNumMatch[0] : "this vehicle";
          errorMessage = error.message;
          nextSteps =
            "Please select a different vehicle or contact support for assistance.";
        }
      }

      if (
        error instanceof Error &&
        "response" in (error as AxiosErrorWithResponse)
      ) {
        const backendMessage = (error as AxiosErrorWithResponse).response?.data
          ?.message;
        if (backendMessage) {
          errorMessage = backendMessage;
          const errorMsgLower = backendMessage.toLowerCase();
          if (
            errorMsgLower.includes("already") ||
            errorMsgLower.includes("exists") ||
            errorMsgLower.includes("once and only once")
          ) {
            nextSteps =
              "You may only link each vehicle's policy once from an external underwriter. Please select a different vehicle or contact support for assistance.";
          }
        }
      }

      toast.error(errorMessage + (nextSteps ? ` ${nextSteps}` : ""));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-primary text-white hover:bg-primary/90">
            + Link External Policy
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Link External Policy</DialogTitle>
          <DialogDescription>
            Add an existing insurance policy from another underwriter. Select
            your vehicle from the list below, then fill in the policy details.
          </DialogDescription>
          <div className="mt-2 rounded-md bg-yellow-50 border border-yellow-200 p-3 text-sm">
            <p className="text-yellow-900">
              <span className="font-medium">Note:</span> Each vehicle can only
              be linked once from an external underwriter.
            </p>
          </div>
        </DialogHeader>

        <Form {...form}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vehicle Registration Number */}
            <FormField
              control={form.control}
              name="vehicle_registration_number"
              render={() => (
                <FormItem>
                  <FormLabel>Select Your Vehicle *</FormLabel>
                  <FormControl>
                    <VehicleSelect
                      value={
                        form.watch("vehicle_registration_number") || undefined
                      }
                      onChange={(vehicle) => {
                        if (vehicle) {
                          form.setValue(
                            "vehicle_registration_number",
                            vehicle.registration_number,
                          );
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Underwritter name */}
            <FormField
              control={form.control}
              name="underwriter_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Underwritter Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., ABC Insurance Co."
                      {...field}
                      maxLength={50}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Policy Number */}
            <FormField
              control={form.control}
              name="policy_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Policy Number *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., COMP/07/658685/05"
                      {...field}
                      maxLength={50}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Certificate Number */}
            <FormField
              control={form.control}
              name="certificate_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certificate Number *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., C22335678"
                      {...field}
                      maxLength={50}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Policy Type */}
            <FormField
              control={form.control}
              name="policy_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Policy Type *</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      required
                    >
                      <SelectTrigger id="policyType" className="w-full">
                        <SelectValue placeholder="Select policy type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="COMPREHENSIVE">
                          Comprehensive
                        </SelectItem>
                        <SelectItem value="THIRD_PARTY">Third Party</SelectItem>
                      </SelectContent>
                    </Select>
                    {/* <select
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        value={field.value}
                        onChange={field.onChange}
                      >
                        <option value="">Select policy type</option>
                        <option value="COMPREHENSIVE">Comprehensive</option>
                        <option value="THIRD_PARTY">Third Party</option>
                      </select> */}
                  </FormControl>
                  <FormDescription className="text-xs">
                    Select the insurance policy type
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start Date */}
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            new Date(field.value).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value
                            ? (() => {
                                const [year, month, day] = field.value
                                  .split("-")
                                  .map(Number);
                                return new Date(year, month - 1, day);
                              })()
                            : undefined
                        }
                        onSelect={(date) => {
                          if (date) {
                            // Format date as YYYY-MM-DD in local timezone
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(
                              2,
                              "0",
                            );
                            const day = String(date.getDate()).padStart(2, "0");
                            field.onChange(`${year}-${month}-${day}`);
                          } else {
                            field.onChange("");
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Duration in Days */}
            <FormField
              control={form.control}
              name="duration_in_days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (Days) *</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="decimal"
                      disabled={!policyType || policyType === "COMPREHENSIVE"}
                      placeholder="Enter duration in days"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^\d*$/.test(value)) {
                          field.onChange(value === "" ? "" : Number(value));
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    {policyType === "COMPREHENSIVE"
                      ? "Fixed at 365 days for Comprehensive policies"
                      : policyType === "THIRD_PARTY"
                        ? "e.g., 365 for one year"
                        : "Select policy type first"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* End Date (Read-only, auto-calculated) - Only show when end_date has a value */}
            {endDate && (
              <FormField
                control={form.control}
                name="end_date"
                render={() => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <div className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs">
                        <span>
                          {(() => {
                            const [year, month, day] = endDate
                              .split("-")
                              .map(Number);
                            const date = new Date(year, month - 1, day);
                            return date.toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            });
                          })()}
                        </span>
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs">
                      Auto-calculated from duration ({durationDays} days)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Vehicle Type */}
            <FormField
              control={form.control}
              name="vehicle_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Type *</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <option value="">Select vehicle type</option>
                      <option value="PRIVATE">Private</option>
                      <option value="COMMERCIAL">Commercial</option>
                      <option value="MOTORBIKE">Motorbike</option>
                      <option value="PSV">PSV</option>
                    </select>
                  </FormControl>
                  <FormDescription className="text-xs">
                    Select the vehicle type
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Premium */}
            <FormField
              control={form.control}
              name="premium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Premium (KES) *</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="decimal"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^\d*\.?\d*$/.test(value)) {
                          field.onChange(value === "" ? "" : Number(value));
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>Enter the premium amount</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={() => form.handleSubmit(onSubmit)()}
            >
              {isSubmitting ? "Linking..." : "Link Policy"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
