import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./shadcn/button";
import { Input } from "./shadcn/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./shadcn/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./shadcn/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./shadcn/select";
import { useAddExpense, useRandomCatFact } from "../hooks/use-expenses";

const expenseSchema = z.object({
  itemName: z.string().min(1, "Item name is required"),
  category: z.enum(["Food", "Furniture", "Accessory"] as const),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExpenseForm({ open, onOpenChange }: ExpenseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addExpense = useAddExpense();
  const { data: catFact, isLoading: isLoadingCatFact } = useRandomCatFact();

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      itemName: "",
      category: "Food",
      amount: 0,
    },
  });

  const onSubmit = async (data: ExpenseFormData) => {
    setIsSubmitting(true);
    try {
      await addExpense.mutateAsync(data);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding expense:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">🐱</span>
            Add Cat Expense
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cat Fact Section */}
          <div className="bg-gradient-accent p-4 rounded-lg border border-gradient-accent">
            <h3 className="font-semibold text-primary-800 mb-2">
              Random Cat Fact
            </h3>
            {isLoadingCatFact ? (
              <div className="text-sm text-gray-600">Loading cat fact...</div>
            ) : (
              <p className="text-sm text-primary-700 italic">
                "{catFact?.fact}"
              </p>
            )}
          </div>

          {/* Expense Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="itemName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Premium Cat Food" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Furniture">Furniture</SelectItem>
                        <SelectItem value="Accessory">Accessory</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-primary hover:bg-gradient-primary-hover"
                >
                  {isSubmitting ? "Adding..." : "Add Expense"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
