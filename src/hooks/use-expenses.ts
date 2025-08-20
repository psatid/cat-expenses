import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
    onSuccess: () => {
      // Invalidate and refetch expenses and related queries
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
    },
  });
};

export const useDeleteExpenses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseIds: string[]) =>
      ExpenseService.deleteExpenses(expenseIds),
    onSuccess: () => {
      // Invalidate and refetch expenses and related queries
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
    },
  });
};

// Cat fact hook
export const useRandomCatFact = () => {
  return useQuery({
    queryKey: catFactKeys.random(),
    queryFn: () => CatFactService.getRandomCatFact(),
    staleTime: 0,
    gcTime: 0,
  });
};
