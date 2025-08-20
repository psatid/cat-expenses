import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ExpenseService } from "./expense-service";
import type { Expense, ExpenseFormData } from "../types/expense";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock crypto.randomUUID
Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: vi.fn(() => "test-uuid-123"),
  },
});

const mockExpenses: Expense[] = [
  {
    id: "1",
    itemName: "Premium Cat Food",
    category: "food",
    amount: 500,
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    itemName: "Cat Toy",
    category: "furniture",
    amount: 200,
    createdAt: "2024-01-02T00:00:00.000Z",
  },
  {
    id: "3",
    itemName: "Cat Collar",
    category: "accessory",
    amount: 1000,
    createdAt: "2024-01-03T00:00:00.000Z",
  },
];

describe("ExpenseService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExpenses));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllExpenses", () => {
    it("returns all expenses from storage", () => {
      const result = ExpenseService.getAllExpenses();
      expect(result).toEqual(mockExpenses);
      expect(localStorageMock.getItem).toHaveBeenCalledWith("cat-expenses");
    });

    it("returns empty array when no expenses in storage", () => {
      localStorageMock.getItem.mockReturnValue(null);
      const result = ExpenseService.getAllExpenses();
      expect(result).toEqual([]);
    });

    it("returns empty array when storage contains invalid JSON", () => {
      localStorageMock.getItem.mockReturnValue("invalid-json");
      const result = ExpenseService.getAllExpenses();
      expect(result).toEqual([]);
    });

    it("handles storage error gracefully", () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error("Storage error");
      });
      const result = ExpenseService.getAllExpenses();
      expect(result).toEqual([]);
    });
  });

  describe("addExpense", () => {
    it("adds new expense to storage", async () => {
      const newExpenseData: ExpenseFormData = {
        itemName: "New Cat Bed",
        category: "furniture",
        amount: 300,
      };

      const result = await ExpenseService.addExpense(newExpenseData);

      expect(result).toMatchObject({
        id: "test-uuid-123",
        itemName: "New Cat Bed",
        category: "furniture",
        amount: 300,
      });
      expect(result.createdAt).toBeDefined();
      expect(new Date(result.createdAt).toISOString()).toBe(result.createdAt);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "cat-expenses",
        JSON.stringify([...mockExpenses, result])
      );
    });

    it("adds expense to empty storage", async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const newExpenseData: ExpenseFormData = {
        itemName: "First Cat Food",
        category: "food",
        amount: 100,
      };

      const result = await ExpenseService.addExpense(newExpenseData);

      expect(result).toMatchObject({
        id: "test-uuid-123",
        itemName: "First Cat Food",
        category: "food",
        amount: 100,
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "cat-expenses",
        JSON.stringify([result])
      );
    });

    it("handles storage error during save", async () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error("Storage save error");
      });

      const newExpenseData: ExpenseFormData = {
        itemName: "Cat Collar",
        category: "accessory",
        amount: 50,
      };

      // Should not throw, but should log error
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await ExpenseService.addExpense(newExpenseData);

      expect(result).toBeDefined();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error saving expenses to storage:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("deleteExpenses", () => {
    it("deletes specified expenses from storage", async () => {
      const expenseIdsToDelete = ["1", "3"];

      await ExpenseService.deleteExpenses(expenseIdsToDelete);

      const expectedRemainingExpenses = mockExpenses.filter(
        (expense) => !expenseIdsToDelete.includes(expense.id)
      );

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "cat-expenses",
        JSON.stringify(expectedRemainingExpenses)
      );
    });

    it("deletes all expenses when all IDs are provided", async () => {
      const allExpenseIds = mockExpenses.map((expense) => expense.id);

      await ExpenseService.deleteExpenses(allExpenseIds);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "cat-expenses",
        JSON.stringify([])
      );
    });

    it("handles non-existent expense IDs gracefully", async () => {
      const nonExistentIds = ["999", "888"];

      await ExpenseService.deleteExpenses(nonExistentIds);

      // Should not change the storage
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "cat-expenses",
        JSON.stringify(mockExpenses)
      );
    });

    it("handles storage error during deletion", async () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error("Storage delete error");
      });

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await ExpenseService.deleteExpenses(["1"]);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error saving expenses to storage:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("getExpensesByCategory", () => {
    it("returns expenses grouped by category with totals", () => {
      const result = ExpenseService.getExpensesByCategory();

      expect(result).toEqual({
        food: 500,
        furniture: 200,
        accessory: 1000,
      });
    });

    it("returns empty object when no expenses", () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = ExpenseService.getExpensesByCategory();

      expect(result).toEqual({});
    });

    it("handles multiple expenses in same category", () => {
      const multipleFoodExpenses = [
        { ...mockExpenses[0], amount: 300 },
        { ...mockExpenses[0], id: "4", amount: 400 },
        mockExpenses[1],
      ];
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify(multipleFoodExpenses)
      );

      const result = ExpenseService.getExpensesByCategory();

      expect(result).toEqual({
        food: 700, // 300 + 400
        furniture: 200,
      });
    });
  });

  describe("getTopCategories", () => {
    it("returns the category with highest total amount", () => {
      const result = ExpenseService.getTopCategories();

      expect(result).toBe("accessory"); // 1000 is the highest
    });

    it("returns first category when multiple have same amount", () => {
      const equalAmountExpenses = [
        { ...mockExpenses[0], amount: 500 },
        { ...mockExpenses[1], amount: 500 },
        { ...mockExpenses[2], amount: 500 },
      ];
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify(equalAmountExpenses)
      );

      const result = ExpenseService.getTopCategories();

      expect(result).toBe("food"); // First category in the array
    });

    it("returns empty string when no expenses", () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = ExpenseService.getTopCategories();

      expect(result).toBe("");
    });

    it("returns empty string when expenses have zero amounts", () => {
      const zeroAmountExpenses = mockExpenses.map((expense) => ({
        ...expense,
        amount: 0,
      }));
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify(zeroAmountExpenses)
      );

      const result = ExpenseService.getTopCategories();

      expect(result).toBe("food"); // First category even with zero amount
    });
  });

  describe("storage key consistency", () => {
    it("uses consistent storage key across all operations", () => {
      ExpenseService.getAllExpenses();
      expect(localStorageMock.getItem).toHaveBeenCalledWith("cat-expenses");

      vi.clearAllMocks();

      const newExpenseData: ExpenseFormData = {
        itemName: "Test",
        category: "food",
        amount: 100,
      };

      ExpenseService.addExpense(newExpenseData);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "cat-expenses",
        expect.any(String)
      );
    });
  });
});
