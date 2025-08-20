import type { Expense } from "@/types/expense";
import { getCategoryBadgeVariant } from "@/utils/category-utils";
import { formatCurrency, formatDate } from "@/utils/formatter";
import { cn } from "@/utils/ui-utils";
import { Badge } from "../shadcn/badge";
import { Checkbox } from "../shadcn/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../shadcn/table";

interface ExpenseTableViewProps {
  expenses: Expense[];
  selectedExpenses: string[];
  topCategory: string;
  onSelectAll: (checked: boolean) => void;
  onSelectExpense: (expenseId: string) => void;
}

export function ExpenseTableView({
  expenses,
  selectedExpenses,
  topCategory,
  onSelectAll,
  onSelectExpense,
}: ExpenseTableViewProps) {
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
                  expense.category === topCategory &&
                    "bg-primary-50 border-l-4 border-l-primary-500"
                )}
                onClick={() => {
                  onSelectExpense(expense.id);
                }}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedExpenses.includes(expense.id)}
                    onCheckedChange={() => onSelectExpense(expense.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {expense.itemName}
                </TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      "capitalize",
                      getCategoryBadgeVariant(expense.category)
                    )}
                  >
                    {expense.category}
                  </Badge>
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
