import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  useExpenses,
  useExpensesByCategory,
  useTopCategories,
  useAddExpense,
  useDeleteExpenses,
  useRandomCatFact,
} from "./use-expenses";
import { ExpenseService } from "@/services/expense-service";
import { CatFactService } from "@/services/cat-fact-service";
import type { ExpenseCategory } from "@/types/expense";

// Mock the services
vi.mock("@/services/expense-service");
vi.mock("@/services/cat-fact-service");
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockExpenseService = vi.mocked(ExpenseService);
const mockCatFactService = vi.mocked(CatFactService);

// Get the mocked toast functions
const mockToast = vi.mocked(await import("sonner")).toast;

// Test wrapper with QueryClient
function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    children
  );
}

const mockExpenses = [
  {
    id: "1",
    itemName: "Premium Cat Food",
    category: "food" as ExpenseCategory,
    amount: 500,
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    itemName: "Cat Toy",
    category: "furniture" as ExpenseCategory,
    amount: 200,
    createdAt: "2024-01-02T00:00:00.000Z",
  },
];

const mockExpensesByCategory = {
  food: 500,
  furniture: 200,
  accessory: 1000,
};

describe("useExpenses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExpenseService.getAllExpenses.mockResolvedValue(mockExpenses);
  });

  it("fetches expenses successfully", async () => {
    const { result } = renderHook(() => useExpenses(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockExpenses);
    expect(mockExpenseService.getAllExpenses).toHaveBeenCalledTimes(1);
  });
});

describe("useExpensesByCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExpenseService.getExpensesByCategory.mockResolvedValue(
      mockExpensesByCategory
    );
  });

  it("fetches expenses by category successfully", async () => {
    const { result } = renderHook(() => useExpensesByCategory(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockExpensesByCategory);
    expect(mockExpenseService.getExpensesByCategory).toHaveBeenCalledTimes(1);
  });
});

describe("useTopCategories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExpenseService.getTopCategories.mockResolvedValue("food");
  });

  it("fetches top category successfully", async () => {
    const { result } = renderHook(() => useTopCategories(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe("food");
    expect(mockExpenseService.getTopCategories).toHaveBeenCalledTimes(1);
  });
});

describe("useAddExpense", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExpenseService.addExpense.mockResolvedValue({
      id: "1",
      itemName: "Premium Cat Food",
      category: "food" as ExpenseCategory,
      amount: 500,
      createdAt: "2024-01-01T00:00:00.000Z",
    });
  });

  it("adds expense successfully", async () => {
    const { result } = renderHook(() => useAddExpense(), {
      wrapper: TestWrapper,
    });

    const expenseData = {
      itemName: "Premium Cat Food",
      category: "food" as const,
      amount: 500,
    };

    await result.current.mutateAsync(expenseData);

    expect(mockExpenseService.addExpense).toHaveBeenCalledWith(expenseData);
  });

  it("shows success toast when expense is added", async () => {
    const { result } = renderHook(() => useAddExpense(), {
      wrapper: TestWrapper,
    });

    const expenseData = {
      itemName: "Premium Cat Food",
      category: "food" as const,
      amount: 500,
    };

    await result.current.mutateAsync(expenseData);

    expect(mockToast.success).toHaveBeenCalledWith(
      "Expense added successfully!",
      {
        description: "Premium Cat Food - food",
      }
    );
  });

  it("shows error toast when expense addition fails", async () => {
    const error = new Error("Failed to add expense");
    mockExpenseService.addExpense.mockRejectedValue(error);

    const { result } = renderHook(() => useAddExpense(), {
      wrapper: TestWrapper,
    });

    const expenseData = {
      itemName: "Premium Cat Food",
      category: "food" as const,
      amount: 500,
    };

    await expect(result.current.mutateAsync(expenseData)).rejects.toThrow();

    expect(mockToast.error).toHaveBeenCalledWith("Failed to add expense", {
      description: "Failed to add expense",
    });
  });

  it("shows generic error toast for non-Error objects", async () => {
    const error = "String error";
    mockExpenseService.addExpense.mockRejectedValue(error);

    const { result } = renderHook(() => useAddExpense(), {
      wrapper: TestWrapper,
    });

    const expenseData = {
      itemName: "Premium Cat Food",
      category: "food" as const,
      amount: 500,
    };

    await expect(result.current.mutateAsync(expenseData)).rejects.toThrow();

    expect(mockToast.error).toHaveBeenCalledWith("Failed to add expense", {
      description: "An unexpected error occurred",
    });
  });

  it("handles error during mutation", async () => {
    const error = new Error("Failed to add expense");
    mockExpenseService.addExpense.mockRejectedValue(error);

    const { result } = renderHook(() => useAddExpense(), {
      wrapper: TestWrapper,
    });

    const expenseData = {
      itemName: "Premium Cat Food",
      category: "food" as const,
      amount: 500,
    };

    await expect(result.current.mutateAsync(expenseData)).rejects.toThrow();
  });
});

describe("useDeleteExpenses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExpenseService.deleteExpenses.mockResolvedValue();
  });

  it("deletes expenses successfully", async () => {
    const { result } = renderHook(() => useDeleteExpenses(), {
      wrapper: TestWrapper,
    });

    const expenseIds = ["1", "2"];

    await result.current.mutateAsync(expenseIds);

    expect(mockExpenseService.deleteExpenses).toHaveBeenCalledWith(expenseIds);
  });

  it("shows success toast when expenses are deleted", async () => {
    const { result } = renderHook(() => useDeleteExpenses(), {
      wrapper: TestWrapper,
    });

    const expenseIds = ["1", "2"];

    await result.current.mutateAsync(expenseIds);

    expect(mockToast.success).toHaveBeenCalledWith(
      "Expenses deleted successfully!",
      {
        description: "2 expenses removed",
      }
    );
  });

  it("shows singular success toast when one expense is deleted", async () => {
    const { result } = renderHook(() => useDeleteExpenses(), {
      wrapper: TestWrapper,
    });

    const expenseIds = ["1"];

    await result.current.mutateAsync(expenseIds);

    expect(mockToast.success).toHaveBeenCalledWith(
      "Expenses deleted successfully!",
      {
        description: "1 expense removed",
      }
    );
  });

  it("shows error toast when expense deletion fails", async () => {
    const error = new Error("Failed to delete expenses");
    mockExpenseService.deleteExpenses.mockRejectedValue(error);

    const { result } = renderHook(() => useDeleteExpenses(), {
      wrapper: TestWrapper,
    });

    const expenseIds = ["1", "2"];

    await expect(result.current.mutateAsync(expenseIds)).rejects.toThrow();

    expect(mockToast.error).toHaveBeenCalledWith("Failed to delete expenses", {
      description: "Failed to delete expenses",
    });
  });

  it("shows generic error toast for non-Error objects during deletion", async () => {
    const error = "String error";
    mockExpenseService.deleteExpenses.mockRejectedValue(error);

    const { result } = renderHook(() => useDeleteExpenses(), {
      wrapper: TestWrapper,
    });

    const expenseIds = ["1", "2"];

    await expect(result.current.mutateAsync(expenseIds)).rejects.toThrow();

    expect(mockToast.error).toHaveBeenCalledWith("Failed to delete expenses", {
      description: "An unexpected error occurred",
    });
  });
});

describe("useRandomCatFact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCatFactService.getRandomCatFact.mockResolvedValue({
      fact: "Cats spend 70% of their lives sleeping.",
      length: 35,
    });
  });

  it("fetches random cat fact successfully", async () => {
    const { result } = renderHook(() => useRandomCatFact(), {
      wrapper: TestWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual({
      fact: "Cats spend 70% of their lives sleeping.",
      length: 35,
    });
    expect(mockCatFactService.getRandomCatFact).toHaveBeenCalledTimes(1);
  });
});
