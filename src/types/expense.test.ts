import { describe, it, expect } from "vitest";
import { expenseSchema, type ExpenseFormData } from "./expense";

describe("expenseSchema", () => {
  it("validates correct expense data", () => {
    const validExpense: ExpenseFormData = {
      itemName: "Premium Cat Food",
      category: "food",
      amount: 500,
    };

    const result = expenseSchema.safeParse(validExpense);
    expect(result.success).toBe(true);
  });

  it("requires itemName", () => {
    const invalidExpense = {
      category: "food",
      amount: 500,
    };

    const result = expenseSchema.safeParse(invalidExpense);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Required");
    }
  });

  it("requires itemName to be non-empty", () => {
    const invalidExpense: ExpenseFormData = {
      itemName: "",
      category: "food",
      amount: 500,
    };

    const result = expenseSchema.safeParse(invalidExpense);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Item name is required");
    }
  });

  it("accepts whitespace-only itemName (schema doesn't trim)", () => {
    const validExpense: ExpenseFormData = {
      itemName: "   ",
      category: "food",
      amount: 500,
    };

    const result = expenseSchema.safeParse(validExpense);
    expect(result.success).toBe(true);
  });

  it("requires category", () => {
    const invalidExpense = {
      itemName: "Premium Cat Food",
      amount: 500,
    };

    const result = expenseSchema.safeParse(invalidExpense);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Required");
    }
  });

  it("validates category enum values", () => {
    const validCategories = ["food", "furniture", "accessory"];

    validCategories.forEach((category) => {
      const validExpense = {
        itemName: "Test Item",
        category: category,
        amount: 500,
      };

      const result = expenseSchema.safeParse(validExpense);
      expect(result.success).toBe(true);
    });
  });

  it("rejects invalid category values", () => {
    const invalidExpense = {
      itemName: "Test Item",
      category: "invalid",
      amount: 500,
    };

    const result = expenseSchema.safeParse(invalidExpense);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("Invalid enum value");
    }
  });

  it("requires amount", () => {
    const invalidExpense = {
      itemName: "Premium Cat Food",
      category: "food",
    };

    const result = expenseSchema.safeParse(invalidExpense);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Amount is required");
    }
  });

  it("requires amount to be a number", () => {
    const invalidExpense = {
      itemName: "Premium Cat Food",
      category: "food",
      amount: "500",
    };

    const result = expenseSchema.safeParse(invalidExpense);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Amount is required");
    }
  });

  it("requires amount to be greater than 0", () => {
    const invalidExpense: ExpenseFormData = {
      itemName: "Premium Cat Food",
      category: "food",
      amount: 0,
    };

    const result = expenseSchema.safeParse(invalidExpense);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Amount is required");
    }
  });

  it("rejects negative amounts", () => {
    const invalidExpense: ExpenseFormData = {
      itemName: "Premium Cat Food",
      category: "food",
      amount: -100,
    };

    const result = expenseSchema.safeParse(invalidExpense);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Amount is required");
    }
  });

  it("accepts decimal amounts", () => {
    const validExpense: ExpenseFormData = {
      itemName: "Premium Cat Food",
      category: "food",
      amount: 500.5,
    };

    const result = expenseSchema.safeParse(validExpense);
    expect(result.success).toBe(true);
  });

  it("handles multiple validation errors", () => {
    const invalidExpense = {
      itemName: "",
      category: "invalid",
      amount: -100,
    };

    const result = expenseSchema.safeParse(invalidExpense);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0);
      expect(
        result.error.issues.some(
          (issue) => issue.message === "Item name is required"
        )
      ).toBe(true);
      expect(
        result.error.issues.some((issue) =>
          issue.message.includes("Invalid enum value")
        )
      ).toBe(true);
      expect(
        result.error.issues.some(
          (issue) => issue.message === "Amount is required"
        )
      ).toBe(true);
    }
  });

  it("transforms valid data correctly", () => {
    const validExpense = {
      itemName: "  Premium Cat Food  ",
      category: "food",
      amount: 500,
    };

    const result = expenseSchema.parse(validExpense);
    expect(result.itemName).toBe("  Premium Cat Food  "); // No trimming in schema
    expect(result.category).toBe("food");
    expect(result.amount).toBe(500);
  });
});
