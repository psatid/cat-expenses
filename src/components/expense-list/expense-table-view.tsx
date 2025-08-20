import { Checkbox } from "../shadcn/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../shadcn/table";
import { cn } from "@/utils/ui-utils";
import type { Expense } from "@/types/expense";
import { formatCurrency, formatDate } from "@/utils/formatter";

interface ExpenseTableViewProps {
  expenses: Expense[];
  selectedExpenses: string[];
  topCategories: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectExpense: (expenseId: string, checked: boolean) => void;
}

export function ExpenseTableView({
  expenses,
  selectedExpenses,
  topCategories,
  onSelectAll,
  onSelectExpense,
}: ExpenseTableViewProps) {
  const isTopCategory = (category: string) => topCategories.includes(category);

  return (
    <div className="hidden md:block border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-12">
              <Checkbox
                checked={
                  selectedExpenses.length === expenses.length &&
                  expenses.length > 0
                }
                onCheckedChange={onSelectAll}
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
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
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
                      onSelectExpense(expense.id, checked as boolean)
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
                      expense.category === "food" &&
                        "bg-green-100 text-green-800",
                      expense.category === "furniture" &&
                        "bg-blue-100 text-blue-800",
                      expense.category === "accessory" &&
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
  );
}
