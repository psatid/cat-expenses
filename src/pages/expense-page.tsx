import { ExpenseForm } from "@/components/expense-form";
import { ExpenseList } from "@/components/expense-list";
import { Cat } from "lucide-react";

export function ExpensePage() {
  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-4">
          <Cat className="h-12 w-12 text-primary-600" />
          <h1 className="text-4xl font-bold bg-gradient-primary-text">
            Cat Expense Tracker
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Keep track of all your feline friend's expenses! 🐱
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        <div className="flex justify-center">
          <ExpenseForm />
        </div>

        {/* Expense Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <ExpenseList />
        </div>
      </div>
    </div>
  );
}
