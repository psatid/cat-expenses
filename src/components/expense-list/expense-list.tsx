import { useState } from "react";
import { Button } from "../shadcn/button";
import {
  useExpenses,
  useTopCategories,
  useDeleteExpenses,
} from "../../hooks/use-expenses";
import { ExpenseTableView } from "./expense-table-view";
import { ExpenseCardView } from "./expense-card-view";
import { formatCurrency } from "@/utils/formatter";

export function ExpenseList() {
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const { data: expenses = [], isLoading } = useExpenses();
  const { data: topCategory = "" } = useTopCategories();
  const deleteExpenses = useDeleteExpenses();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedExpenses(expenses.map((expense) => expense.id));
    } else {
      setSelectedExpenses([]);
    }
  };

  const handleSelectExpense = (expenseId: string, checked: boolean) => {
    if (checked) {
      setSelectedExpenses((prev) => [...prev, expenseId]);
    } else {
      setSelectedExpenses((prev) => prev.filter((id) => id !== expenseId));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedExpenses.length === 0) return;

    try {
      await deleteExpenses.mutateAsync(selectedExpenses);
      setSelectedExpenses([]);
    } catch (error) {
      console.error("Error deleting expenses:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading expenses...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Cat Expenses</h2>
        <Button
          onClick={handleDeleteSelected}
          disabled={deleteExpenses.isPending || selectedExpenses.length === 0}
          variant="destructive"
        >
          {deleteExpenses.isPending
            ? "Deleting..."
            : `Delete Selected (${selectedExpenses.length})`}
        </Button>
      </div>

      {/* Desktop Table View */}
      <ExpenseTableView
        expenses={expenses}
        selectedExpenses={selectedExpenses}
        topCategory={topCategory}
        onSelectAll={handleSelectAll}
        onSelectExpense={handleSelectExpense}
      />

      {/* Mobile Card View */}
      <ExpenseCardView
        expenses={expenses}
        selectedExpenses={selectedExpenses}
        topCategory={topCategory}
        onSelectExpense={handleSelectExpense}
      />

      {/* Summary */}
      {expenses.length > 0 && (
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">
            Total:{" "}
            {formatCurrency(
              expenses.reduce((sum, expense) => sum + expense.amount, 0)
            )}
          </div>
          {topCategory && (
            <div className="text-sm text-primary-700 font-medium text-right">
              🏆 Top Category: <span className="font-bold">{topCategory}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
