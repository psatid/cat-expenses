import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ExpenseService } from "../services/expense-service";
import { CatFactService } from "../services/cat-fact-service";
import type { ExpenseFormData } from "../types/expense";

// Query keys
export const expenseKeys = {
  all: ["expenses"] as const,
  lists: () => [...expenseKeys.all, "list"] as const,
  list: (filters: string) => [...expenseKeys.lists(), { filters }] as const,
  categories: () => [...expenseKeys.all, "categories"] as const,
  topCategories: () => [...expenseKeys.all, "topCategories"] as const,
};

export const catFactKeys = {
  random: () => ["catFact", "random"] as const,
};

// Expense hooks
export const useExpenses = () => {
  return useQuery({
    queryKey: expenseKeys.lists(),
    queryFn: () => ExpenseService.getAllExpenses(),
  });
};

export const useExpensesByCategory = () => {
  return useQuery({
    queryKey: expenseKeys.categories(),
    queryFn: () => ExpenseService.getExpensesByCategory(),
  });
};

export const useTopCategories = () => {
  return useQuery({
    queryKey: expenseKeys.topCategories(),
    queryFn: () => ExpenseService.getTopCategories(),
  });
};

export const useAddExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseData: ExpenseFormData) =>
      ExpenseService.addExpense(expenseData),
    onSuccess: (data) => {
      // Invalidate and refetch expenses and related queries
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });

      // Show success toast
      toast.success("Expense added successfully!", {
        description: `${data.itemName} - ${data.category}`,
      });
    },
    onError: (error) => {
      // Show error toast
      toast.error("Failed to add expense", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    },
  });
};

export const useDeleteExpenses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseIds: string[]) =>
      ExpenseService.deleteExpenses(expenseIds),
    onSuccess: (_, expenseIds) => {
      // Invalidate and refetch expenses and related queries
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });

      // Show success toast
      const count = expenseIds.length;
      toast.success("Expenses deleted successfully!", {
        description: `${count} expense${count > 1 ? "s" : ""} removed`,
      });
    },
    onError: (error) => {
      // Show error toast
      toast.error("Failed to delete expenses", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    },
  });
};

// Cat fact hook
export const useRandomCatFact = () => {
  return useQuery({
    queryKey: catFactKeys.random(),
    queryFn: () => CatFactService.getRandomCatFact(),
  });
};
