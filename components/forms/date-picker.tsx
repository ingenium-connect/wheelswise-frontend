import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar1Icon } from "lucide-react";
import { Calendar } from "../ui/calendar";

interface CustomFormFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  mode?: "single" | "multiple" | "range" | undefined;
  required?: boolean;
  disabled?: boolean;
}
// Reusable Input Component
const CustomDateField: React.FC<CustomFormFieldProps> = ({
  control,
  name,
  label,
  placeholder,
  mode = "single",
  required = false,
  disabled = false,
}) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className="flex flex-col">
        <FormLabel>{label}</FormLabel>
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant={"outline"}
                className={cn(
                  "pl-3 text-left font-normal",
                  !field.value && "text-muted-foreground",
                )}
              >
                {field.value ? (
                  format(field.value, "PPP")
                ) : (
                  <span>{placeholder}</span>
                )}
                <Calendar1Icon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode={mode}
              required={required}
              selected={field.value}
              onSelect={field.onChange}
              disabled={disabled}
              className="rounded-md border shadow-sm"
              captionLayout="dropdown"
            />
          </PopoverContent>
        </Popover>
        <FormMessage />
      </FormItem>
    )}
  />
);
export default CustomDateField;
