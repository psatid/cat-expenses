import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ExpenseTableView } from "./expense-table-view";
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

describe("ExpenseTableView", () => {
  const mockOnSelectAll = vi.fn();
  const mockOnSelectExpense = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders table with expenses", () => {
    render(
      <ExpenseTableView
        expenses={mockExpenses}
        selectedExpenses={[]}
        topCategory=""
        onSelectAll={mockOnSelectAll}
        onSelectExpense={mockOnSelectExpense}
      />
    );

    // Check table headers
    expect(screen.getByText("Item Name")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();

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
      <ExpenseTableView
        expenses={[]}
        selectedExpenses={[]}
        topCategory=""
        onSelectAll={mockOnSelectAll}
        onSelectExpense={mockOnSelectExpense}
      />
    );

    expect(
      screen.getByText("No expenses yet. Add your first cat expense! 🐱")
    ).toBeInTheDocument();
  });

  it("handles select all functionality", () => {
    render(
      <ExpenseTableView
        expenses={mockExpenses}
        selectedExpenses={[]}
        topCategory=""
        onSelectAll={mockOnSelectAll}
        onSelectExpense={mockOnSelectExpense}
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    const selectAllCheckbox = checkboxes[0]; // First checkbox is the select all
    fireEvent.click(selectAllCheckbox);

    expect(mockOnSelectAll).toHaveBeenCalledWith(true);
  });

  it("handles individual expense selection", () => {
    render(
      <ExpenseTableView
        expenses={mockExpenses}
        selectedExpenses={[]}
        topCategory=""
        onSelectAll={mockOnSelectAll}
        onSelectExpense={mockOnSelectExpense}
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    // Skip the select all checkbox (first one)
    const firstExpenseCheckbox = checkboxes[1];
    fireEvent.click(firstExpenseCheckbox);

    expect(mockOnSelectExpense).toHaveBeenCalledWith("1");
  });

  it("shows selected state for checkboxes", () => {
    render(
      <ExpenseTableView
        expenses={mockExpenses}
        selectedExpenses={["1", "2"]}
        topCategory=""
        onSelectAll={mockOnSelectAll}
        onSelectExpense={mockOnSelectExpense}
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    // Select all should be checked (first 2 out of 3 expenses selected)
    expect(checkboxes[0]).not.toBeChecked();
    // First two expense checkboxes should be checked
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).toBeChecked();
    // Third expense checkbox should not be checked
    expect(checkboxes[3]).not.toBeChecked();
  });

  it("shows select all as checked when all expenses are selected", () => {
    render(
      <ExpenseTableView
        expenses={mockExpenses}
        selectedExpenses={["1", "2", "3"]}
        topCategory=""
        onSelectAll={mockOnSelectAll}
        onSelectExpense={mockOnSelectExpense}
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    const selectAllCheckbox = checkboxes[0]; // First checkbox is the select all
    expect(selectAllCheckbox).toBeChecked();
  });

  it("highlights rows when category matches top category", () => {
    render(
      <ExpenseTableView
        expenses={mockExpenses}
        selectedExpenses={[]}
        topCategory="food"
        onSelectAll={mockOnSelectAll}
        onSelectExpense={mockOnSelectExpense}
      />
    );

    // Find table rows
    const tableRows = screen.getAllByRole("row");

    // Find the row containing "Premium Cat Food" (which has category "food" - the top category)
    const foodRow = tableRows.find((row) =>
      row.textContent?.includes("Premium Cat Food")
    );

    // Find the row containing "Cat Toy" (which has category "furniture" - not top category)
    const furnitureRow = tableRows.find((row) =>
      row.textContent?.includes("Cat Toy")
    );

    // The food row should be highlighted
    expect(foodRow).toHaveClass(
      "bg-primary-50",
      "border-l-4",
      "border-l-primary-500"
    );

    // The furniture row should not be highlighted
    expect(furnitureRow).not.toHaveClass("bg-primary-50");
    expect(furnitureRow).not.toHaveClass("border-l-4");
    expect(furnitureRow).not.toHaveClass("border-l-primary-500");
  });

  it("displays category badges correctly", () => {
    render(
      <ExpenseTableView
        expenses={mockExpenses}
        selectedExpenses={[]}
        topCategory=""
        onSelectAll={mockOnSelectAll}
        onSelectExpense={mockOnSelectExpense}
      />
    );

    expect(screen.getByText("food")).toBeInTheDocument();
    expect(screen.getByText("furniture")).toBeInTheDocument();
    expect(screen.getByText("accessory")).toBeInTheDocument();
  });

  it("displays formatted dates correctly", () => {
    render(
      <ExpenseTableView
        expenses={mockExpenses}
        selectedExpenses={[]}
        topCategory=""
        onSelectAll={mockOnSelectAll}
        onSelectExpense={mockOnSelectExpense}
      />
    );

    // Check that dates are displayed (they should be formatted)
    expect(screen.getByText(/Jan 1, 2024/)).toBeInTheDocument();
    expect(screen.getByText(/Jan 2, 2024/)).toBeInTheDocument();
    expect(screen.getByText(/Jan 3, 2024/)).toBeInTheDocument();
  });
});
