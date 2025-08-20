import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ExpenseCardView } from "./expense-card-view";
import type { Expense, ExpenseCategory } from "@/types/expense";

const mockExpenses: Expense[] = [
  {
    id: "1",
    itemName: "Premium Cat Food",
    category: "food" as ExpenseCategory,
    amount: 500,
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    itemName: "Cat Toy",
    category: "furniture" as ExpenseCategory,
    amount: 200,
    createdAt: "2024-01-02T00:00:00.000Z",
  },
  {
    id: "3",
    itemName: "Cat Collar",
    category: "accessory" as ExpenseCategory,
    amount: 1000,
    createdAt: "2024-01-03T00:00:00.000Z",
  },
];

describe("ExpenseCardView", () => {
  const mockOnSelectExpense = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders cards with expenses", () => {
    render(
      <ExpenseCardView
        expenses={mockExpenses}
        selectedExpenses={[]}
        topCategory=""
        onSelectExpense={mockOnSelectExpense}
      />
    );

    // Check expense data
    expect(screen.getByText("Premium Cat Food")).toBeInTheDocument();
    expect(screen.getByText("Cat Toy")).toBeInTheDocument();
    expect(screen.getByText("Cat Collar")).toBeInTheDocument();
    expect(screen.getByText("THB 500.00")).toBeInTheDocument();
    expect(screen.getByText("THB 200.00")).toBeInTheDocument();
    expect(screen.getByText("THB 1,000.00")).toBeInTheDocument();
  });

  it("renders empty state when no expenses", () => {
    render(
      <ExpenseCardView
        expenses={[]}
        selectedExpenses={[]}
        topCategory=""
        onSelectExpense={mockOnSelectExpense}
      />
    );

    expect(
      screen.getByText("No expenses yet. Add your first cat expense! 🐱")
    ).toBeInTheDocument();
  });

  it("handles individual expense selection", () => {
    render(
      <ExpenseCardView
        expenses={mockExpenses}
        selectedExpenses={[]}
        topCategory=""
        onSelectExpense={mockOnSelectExpense}
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);

    expect(mockOnSelectExpense).toHaveBeenCalledWith("1");
  });

  it("shows selected state for checkboxes", () => {
    render(
      <ExpenseCardView
        expenses={mockExpenses}
        selectedExpenses={["1", "2"]}
        topCategory=""
        onSelectExpense={mockOnSelectExpense}
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    // First two expense checkboxes should be checked
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    // Third expense checkbox should not be checked
    expect(checkboxes[2]).not.toBeChecked();
  });

  it("highlights cards when category matches top category", () => {
    render(
      <ExpenseCardView
        expenses={mockExpenses}
        selectedExpenses={[]}
        topCategory="food"
        onSelectExpense={mockOnSelectExpense}
      />
    );

    // Find the card containing "Premium Cat Food" (which has category "food" - the top category)
    const foodText = screen.getByText("Premium Cat Food");
    const foodCard = foodText.closest('[class*="bg-gradient-accent"]');

    // Find the card containing "Cat Toy" (which has category "furniture" - not top category)
    const furnitureText = screen.getByText("Cat Toy");
    const furnitureCard = furnitureText.closest('[class*="bg-"]');

    // The food card should be highlighted with gradient and border
    expect(foodCard).toHaveClass(
      "bg-gradient-accent",
      "border-l-4",
      "border-primary-500"
    );

    // The furniture card should not have the highlighted gradient
    expect(furnitureCard).not.toHaveClass("bg-gradient-accent");
  });

  it("displays category badges correctly", () => {
    render(
      <ExpenseCardView
        expenses={mockExpenses}
        selectedExpenses={[]}
        topCategory=""
        onSelectExpense={mockOnSelectExpense}
      />
    );

    expect(screen.getByText("food")).toBeInTheDocument();
    expect(screen.getByText("furniture")).toBeInTheDocument();
    expect(screen.getByText("accessory")).toBeInTheDocument();
  });

  it("displays formatted dates correctly", () => {
    render(
      <ExpenseCardView
        expenses={mockExpenses}
        selectedExpenses={[]}
        topCategory=""
        onSelectExpense={mockOnSelectExpense}
      />
    );

    // Check that dates are displayed (they should be formatted)
    expect(screen.getByText(/Jan 1, 2024/)).toBeInTheDocument();
    expect(screen.getByText(/Jan 2, 2024/)).toBeInTheDocument();
    expect(screen.getByText(/Jan 3, 2024/)).toBeInTheDocument();
  });

  it("has proper labels for checkboxes", () => {
    render(
      <ExpenseCardView
        expenses={mockExpenses}
        selectedExpenses={[]}
        topCategory=""
        onSelectExpense={mockOnSelectExpense}
      />
    );

    // Check that labels are properly associated with checkboxes
    expect(screen.getByLabelText("Premium Cat Food")).toBeInTheDocument();
    expect(screen.getByLabelText("Cat Toy")).toBeInTheDocument();
    expect(screen.getByLabelText("Cat Collar")).toBeInTheDocument();
  });

  it("handles card click for selection", () => {
    render(
      <ExpenseCardView
        expenses={mockExpenses}
        selectedExpenses={[]}
        topCategory=""
        onSelectExpense={mockOnSelectExpense}
      />
    );

    // Click on the first card
    const firstCard = screen
      .getByText("Premium Cat Food")
      .closest('[class*="card"]');
    fireEvent.click(firstCard!);

    expect(mockOnSelectExpense).toHaveBeenCalledWith("1");
  });

  it("handles card click to deselect", () => {
    render(
      <ExpenseCardView
        expenses={mockExpenses}
        selectedExpenses={["1"]}
        topCategory=""
        onSelectExpense={mockOnSelectExpense}
      />
    );

    // Click on the first card (which is already selected)
    const firstCard = screen
      .getByText("Premium Cat Food")
      .closest('[class*="card"]');
    fireEvent.click(firstCard!);

    expect(mockOnSelectExpense).toHaveBeenCalledWith("1");
  });
});
