import { Checkbox } from "../shadcn/checkbox";
import { Card, CardHeader, CardTitle } from "../shadcn/card";
import { cn } from "@/utils/ui-utils";
import type { Expense } from "@/types/expense";
import { formatCurrency, formatDate } from "@/utils/formatter";

interface ExpenseCardViewProps {
  expenses: Expense[];
  selectedExpenses: string[];
  topCategories: string[];
  onSelectExpense: (expenseId: string, checked: boolean) => void;
}

export function ExpenseCardView({
  expenses,
  selectedExpenses,
  topCategories,
  onSelectExpense,
}: ExpenseCardViewProps) {
  const isTopCategory = (category: string) => topCategories.includes(category);

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
              isTopCategory(expense.category) &&
                "bg-gradient-accent border-l-4 border-primary-500",
              selectedExpenses.includes(expense.id) && "ring-2 ring-primary-500"
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedExpenses.includes(expense.id)}
                    onCheckedChange={(checked) =>
                      onSelectExpense(expense.id, checked as boolean)
                    }
                  />
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      {expense.itemName}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
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
                      <span className="text-sm text-gray-500">
                        {formatDate(expense.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary-600">
                    {formatCurrency(expense.amount)}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))
      )}
    </div>
  );
}
