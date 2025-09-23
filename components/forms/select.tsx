import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
  } from "@/components/ui/form"
  import {
    Popover,
    PopoverTrigger,
    PopoverContent,
  } from "@/components/ui/popover"
  import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
  } from "@/components/ui/command"
  import { Button } from "@/components/ui/button"
  import { CheckIcon, ChevronDownIcon } from "lucide-react";
  import { cn } from "@/lib/utils"
  
  type FormSelectPopoverProps<T> = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: any
    name: string
    label: string
    placeholder?: string;
    disableItem?: (item: T) => boolean
    items: T[]
    valueKey: keyof T
    displayValue: (item: T) => React.ReactNode
  }
  
  export default function FormSelectPopover<T>({
    control,
    name,
    label,
    disableItem,
    placeholder = "Select an option",
    items,
    valueKey,
    displayValue,
  }: FormSelectPopoverProps<T>) {
    return (
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
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? displayValue(items.find(item => item[valueKey] === field.value) as T)
                      : placeholder}
                    <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
                  <CommandList>
                    <CommandEmpty>{label} not found.</CommandEmpty>
                    <CommandGroup>
                      {items.map(item => {
                        const value = (valueKey ? item[valueKey]: item) as string
                        return (
                          <CommandItem
                            key={value}
                            value={value}
                            disabled={disableItem && disableItem(item)}
                            onSelect={() => field.onChange(value)}
                          >
                            <CheckIcon
                              className={cn(
                                "mr-2 h-4 w-4",
                                value === field.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {displayValue(item)}
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }
  