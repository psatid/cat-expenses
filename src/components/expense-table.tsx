import { useState } from "react";
import { Checkbox } from "./shadcn/checkbox";
import { Button } from "./shadcn/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./shadcn/table";
import {
  useExpenses,
  useTopCategories,
  useDeleteExpenses,
} from "../hooks/use-expenses";
import { cn } from "@/utils";

export function ExpenseTable() {
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const { data: expenses = [], isLoading } = useExpenses();
  const { data: topCategories = [] } = useTopCategories();
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

  const isTopCategory = (category: string) => topCategories.includes(category);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
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
        <div className="flex items-center gap-3">
          {selectedExpenses.length > 0 && (
            <Button
              onClick={handleDeleteSelected}
              disabled={deleteExpenses.isPending}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteExpenses.isPending
                ? "Deleting..."
                : `Delete Selected (${selectedExpenses.length})`}
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedExpenses.length === expenses.length &&
                    expenses.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-gray-500"
                >
                  No expenses yet. Add your first cat expense! 🐱
                </TableCell>
              </TableRow>
            ) : (
              expenses.map((expense) => (
                <TableRow
                  key={expense.id}
                  className={cn(
                    isTopCategory(expense.category) &&
                      "bg-gradient-accent border-l-4 border-primary-500"
                  )}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedExpenses.includes(expense.id)}
                      onCheckedChange={(checked) =>
                        handleSelectExpense(expense.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {expense.itemName}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        expense.category === "Food" &&
                          "bg-green-100 text-green-800",
                        expense.category === "Furniture" &&
                          "bg-blue-100 text-blue-800",
                        expense.category === "Accessory" &&
                          "bg-purple-100 text-purple-800"
                      )}
                    >
                      {expense.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(expense.amount)}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatDate(expense.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      {expenses.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Total:{" "}
              {formatCurrency(
                expenses.reduce((sum, expense) => sum + expense.amount, 0)
              )}
            </div>
            {topCategories.length > 0 && (
              <div className="text-sm text-primary-700 font-medium">
                🏆 Top Category{topCategories.length > 1 ? "ies" : "y"}:{" "}
                {topCategories.join(", ")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
