import { EXPENSE_CATEGORIES } from "@/constants/expense-constants";
import { useAddExpense, useRandomCatFact } from "@/hooks/use-expenses";
import { expenseSchema, type ExpenseFormData } from "@/types/expense";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { InputFormField, SelectFormField } from "./form-fields";
import { Button } from "./shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./shadcn/dialog";
import { Form } from "./shadcn/form";
import { Plus } from "lucide-react";

export function ExpenseForm() {
  const [open, setOpen] = useState(false);
  const addExpense = useAddExpense();
  const {
    data: catFact,
    isFetching: isLoadingCatFact,
    refetch: refetchCatFact,
    error: catFactError,
  } = useRandomCatFact();

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      itemName: "",
      category: "food",
      amount: 0,
    },
  });

  // Handle cat fact error
  useEffect(() => {
    if (catFactError) {
      toast.error("Failed to load cat fact", {
        description: "Don't worry, you can still add your expense!",
      });
    }
  }, [catFactError]);

  const onSubmit = async (data: ExpenseFormData) => {
    await addExpense.mutateAsync(data);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (open) {
          refetchCatFact();
        }
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary hover:bg-gradient-primary-hover text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200">
          <Plus className="mr-2 h-5 w-5" />
          Add Expense
        </Button>
      </DialogTrigger>

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
              <InputFormField
                form={form}
                name="itemName"
                label="Item Name"
                placeholder="e.g., Premium Cat Food"
              />

              <SelectFormField
                form={form}
                name="category"
                label="Category"
                placeholder="Select a category"
                options={EXPENSE_CATEGORIES}
              />

              <InputFormField
                form={form}
                name="amount"
                label="Amount (THB)"
                type="number"
                placeholder="0"
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={addExpense.isPending}
                  className="flex-1 bg-gradient-primary hover:bg-gradient-primary-hover"
                >
                  {addExpense.isPending ? "Adding..." : "Add Expense"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
