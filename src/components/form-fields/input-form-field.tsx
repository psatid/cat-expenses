import React from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { cn } from "../../utils/ui-utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  type InputProps,
} from "../shadcn";

export interface InputFormFieldProps<
  T extends FieldValues,
  N extends Path<T> = Path<T>
> extends Omit<InputProps, "form"> {
  form: UseFormReturn<T>;
  name: N;
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const InputFormField = <T extends FieldValues>({
  name,
  form,
  label,
  leftIcon,
  rightIcon,
  className,
  ...inputProps
}: InputFormFieldProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <div className="relative">
            {leftIcon && (
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                {leftIcon}
              </div>
            )}
            <FormControl>
              <Input
                className={cn(leftIcon && "pl-10", className)}
                {...field}
                {...inputProps}
                onChange={(e) => {
                  if (inputProps.type === "number") {
                    field.onChange(e.target.valueAsNumber);
                  } else {
                    field.onChange(e);
                  }
                  inputProps.onChange?.(e);
                }}
                value={
                  inputProps.type === "number"
                    ? !field.value
                      ? ""
                      : field.value
                    : field.value
                }
              />
            </FormControl>
            {rightIcon && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {rightIcon}
              </div>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
