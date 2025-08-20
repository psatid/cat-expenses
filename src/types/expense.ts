export type ExpenseCategory = "Food" | "Furniture" | "Accessory";

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

export interface ExpenseFormData {
  itemName: string;
  category: ExpenseCategory;
  amount: number;
}
