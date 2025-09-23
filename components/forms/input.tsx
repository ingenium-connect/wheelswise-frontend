import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import { Input } from "../ui/input";

interface CustomFormFieldProps {
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  readonly?: boolean;
  type?: "text" | "number" | "email" | "password";
  disabled?: boolean;
  description?: string;
}

// Reusable Input Component
const CustomFormField: React.FC<CustomFormFieldProps> = ({
  control,
  name,
  label,
  placeholder,
  readonly = false,
  type = "text",
  description,
  disabled = false,
}) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input
            type={type}
            placeholder={placeholder}
            value={field.value ?? ""}
            autoComplete={name}
            disabled={disabled}
            readOnly={readonly}
            onChange={(e) =>
              field.onChange(
                type === "number"
                  ? parseFloat(e.target.value) || 0
                  : e.target.value
              )
            }
          />
        </FormControl>
        {description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    )}
  />
);

export default CustomFormField;
