import { ExpenseForm } from "@/components/expense-form";
import { ExpenseList } from "@/components/expense-list";
import { Button } from "@/components/shadcn/button";
import { Cat, Plus } from "lucide-react";
import { useState } from "react";

export function ExpensePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

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
        {/* Action Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-gradient-primary hover:bg-gradient-primary-hover text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Expense
          </Button>
        </div>

        {/* Expense Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <ExpenseList />
        </div>
      </div>

      {/* Expense Form Dialog */}
      <ExpenseForm open={isFormOpen} onOpenChange={setIsFormOpen} />
    </div>
  );
}
