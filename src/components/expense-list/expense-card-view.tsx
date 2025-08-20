import type { Expense } from "@/types/expense";
import {
  getCategoryBadgeVariant,
  getCategoryDisplayName,
} from "@/utils/category-utils";
import { formatCurrency, formatDate } from "@/utils/formatter";
import { cn } from "@/utils/ui-utils";
import { Badge } from "../shadcn/badge";
import { Card, CardContent, CardHeader } from "../shadcn/card";
import { Checkbox } from "../shadcn/checkbox";
import { Label } from "../shadcn/label";

interface ExpenseCardViewProps {
  expenses: Expense[];
  selectedExpenses: string[];
  topCategory: string;
  onSelectExpense: (expenseId: string, checked: boolean) => void;
}

export function ExpenseCardView({
  expenses,
  selectedExpenses,
  topCategory,
  onSelectExpense,
}: ExpenseCardViewProps) {
  return (
    <div className="md:hidden space-y-4">
      {expenses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No expenses yet. Add your first cat expense! 🐱
        </div>
      ) : (
        expenses.map((expense) => (
          <Card
            key={expense.id}
            className={cn(
              "transition-all duration-200",
              expense.category === topCategory &&
                "bg-gradient-accent border-l-4 border-primary-500"
            )}
            onClick={() => {
              onSelectExpense(
                expense.id,
                !selectedExpenses.includes(expense.id)
              );
            }}
          >
            <CardHeader className="pb-3 flex flex-row justify-between items-center gap-2">
              <div className="flex flex-row items-center gap-2 flex-1 truncate m-0">
                <Checkbox
                  id={expense.id}
                  checked={selectedExpenses.includes(expense.id)}
                />
                <Label htmlFor={expense.id}>{expense.itemName}</Label>
              </div>

              <Badge className={getCategoryBadgeVariant(expense.category)}>
                {getCategoryDisplayName(expense.category)}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex flex-row items-center justify-between">
                <div className="text-md font-bold text-primary-600">
                  {formatCurrency(expense.amount)}
                </div>
                <span className="text-xs text-gray-500">
                  {formatDate(expense.createdAt)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
