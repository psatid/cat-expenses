import z from "zod";

export type ExpenseCategory = "food" | "furniture" | "accessory";

export interface Expense {
  id: string;
  itemName: string;
  category: ExpenseCategory;
  amount: number;
  createdAt: string;
}

export interface CatFact {
  fact: string;
  length: number;
}

export const expenseSchema = z.object({
  itemName: z.string().min(1, "Item name is required"),
  category: z.enum(["food", "furniture", "accessory"] as const),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;
