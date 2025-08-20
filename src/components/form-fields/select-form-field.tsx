import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shadcn";

export interface SelectFormFieldProps<
  T extends FieldValues,
  N extends Path<T> = Path<T>
> {
  form: UseFormReturn<T>;
  name: N;
  label?: string;
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
}

export const SelectFormField = <T extends FieldValues>({
  name,
  form,
  label,
  placeholder,
  options,
}: SelectFormFieldProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
