import type { Expense, ExpenseFormData } from "../types/expense";

const EXPENSES_STORAGE_KEY = "cat-expenses";

export class ExpenseService {
  private static getExpensesFromStorage(): Expense[] {
    try {
      const stored = localStorage.getItem(EXPENSES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error reading expenses from storage:", error);
      return [];
    }
  }

  private static saveExpensesToStorage(expenses: Expense[]): void {
    try {
      localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
    } catch (error) {
      console.error("Error saving expenses to storage:", error);
    }
  }

  static getAllExpenses(): Expense[] {
    return this.getExpensesFromStorage();
  }

  static async addExpense(expenseData: ExpenseFormData): Promise<Expense> {
    const expenses = this.getExpensesFromStorage();
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      ...expenseData,
      createdAt: new Date().toISOString(),
    };

    const updatedExpenses = [...expenses, newExpense];
    this.saveExpensesToStorage(updatedExpenses);

    return newExpense;
  }

  static async deleteExpenses(expenseIds: string[]): Promise<void> {
    const expenses = this.getExpensesFromStorage();
    const updatedExpenses = expenses.filter(
      (expense) => !expenseIds.includes(expense.id)
    );
    this.saveExpensesToStorage(updatedExpenses);
  }

  static getExpensesByCategory(): Record<string, number> {
    const expenses = this.getExpensesFromStorage();
    return expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
  }

  static getTopCategories(): string {
    const categoryTotals = this.getExpensesByCategory();
    const maxAmount = Math.max(...Object.values(categoryTotals));

    const topCategories = Object.entries(categoryTotals)
      .filter(([, amount]) => amount === maxAmount)
      .map(([category]) => category);

    // Return the first category if multiple have the same amount, or empty string if no expenses
    return topCategories.length > 0 ? topCategories[0] : "";
  }
}
