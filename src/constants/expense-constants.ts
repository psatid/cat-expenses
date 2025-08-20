import type { ExpenseCategory } from "@/types/expense";

export const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string }[] = [
  { value: "food", label: "Food" },
  { value: "furniture", label: "Furniture" },
  { value: "accessory", label: "Accessory" },
] as const;
