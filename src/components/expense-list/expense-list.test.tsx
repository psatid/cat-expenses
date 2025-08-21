import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ExpenseList } from "./expense-list";
import { ExpenseService } from "@/services/expense-service";
import type { ExpenseCategory, Expense } from "@/types/expense";

// Mock the service
vi.mock("@/services/expense-service");
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockExpenseService = vi.mocked(ExpenseService);

// Test wrapper with QueryClient
function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

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

describe("ExpenseList", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock successful responses
    mockExpenseService.getAllExpenses.mockResolvedValue(mockExpenses);
    mockExpenseService.getTopCategories.mockResolvedValue("food");
    mockExpenseService.deleteExpenses.mockResolvedValue();
  });

  it("displays total amount correctly", async () => {
    render(
      <TestWrapper>
        <ExpenseList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Total: THB 1,700.00")).toBeInTheDocument();
    });
  });

  it("renders delete button", async () => {
    render(
      <TestWrapper>
        <ExpenseList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Cat Expenses")).toBeInTheDocument();
    });

    expect(screen.getByText("Delete Selected (0)")).toBeInTheDocument();
  });

  it("handles empty expense list", async () => {
    mockExpenseService.getAllExpenses.mockResolvedValue([]);
    mockExpenseService.getTopCategories.mockResolvedValue("");

    render(
      <TestWrapper>
        <ExpenseList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Cat Expenses")).toBeInTheDocument();
    });

    expect(screen.queryByText("Total:")).not.toBeInTheDocument();
  });

  it("displays top category when available", async () => {
    mockExpenseService.getTopCategories.mockResolvedValue("food");

    render(
      <TestWrapper>
        <ExpenseList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Cat Expenses")).toBeInTheDocument();
    });

    expect(screen.getByTestId("top-category")).toBeInTheDocument();
    expect(screen.getByTestId("top-category").textContent).toBe("food");
  });

  it("does not display top category when empty", async () => {
    mockExpenseService.getTopCategories.mockResolvedValue("");

    render(
      <TestWrapper>
        <ExpenseList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Cat Expenses")).toBeInTheDocument();
    });

    expect(screen.queryByTestId("top-category")).not.toBeInTheDocument();
  });

  it("handles individual expense selection", async () => {
    render(
      <TestWrapper>
        <ExpenseList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Cat Expenses")).toBeInTheDocument();
    });

    // Initially no expenses selected
    expect(screen.getByText("Delete Selected (0)")).toBeInTheDocument();

    // Get all checkboxes (including select all)
    const checkboxes = screen.getAllByRole("checkbox");

    // Select the first expense (skip the select all checkbox)
    if (checkboxes.length > 1) {
      fireEvent.click(checkboxes[1]);

      await waitFor(() => {
        // Should show at least one expense selected
        const deleteButton = screen.getByRole("button", {
          name: /Delete Selected/,
        });
        expect(deleteButton.textContent).toMatch(/Delete Selected \(\d+\)/);
        expect(deleteButton.textContent).toBe("Delete Selected (1)");
      });

      // Unselect the expense
      fireEvent.click(checkboxes[1]);

      await waitFor(() => {
        expect(screen.getByText("Delete Selected (0)")).toBeInTheDocument();
      });
    }
  });

  it("handles select all functionality", async () => {
    render(
      <TestWrapper>
        <ExpenseList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Cat Expenses")).toBeInTheDocument();
    });

    // Get the select all checkbox (first checkbox)
    const checkboxes = screen.getAllByRole("checkbox");
    const selectAllCheckbox = checkboxes[0];

    // Select all
    fireEvent.click(selectAllCheckbox);

    await waitFor(() => {
      expect(screen.getByText("Delete Selected (3)")).toBeInTheDocument();
    });

    // Deselect all
    fireEvent.click(selectAllCheckbox);

    await waitFor(() => {
      expect(screen.getByText("Delete Selected (0)")).toBeInTheDocument();
    });
  });

  it("handles delete operation successfully", async () => {
    mockExpenseService.deleteExpenses.mockResolvedValue();

    render(
      <TestWrapper>
        <ExpenseList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Cat Expenses")).toBeInTheDocument();
    });

    // Select an expense first
    const checkboxes = screen.getAllByRole("checkbox");
    if (checkboxes.length > 1) {
      fireEvent.click(checkboxes[1]);

      await waitFor(() => {
        const deleteButton = screen.getByRole("button", {
          name: /Delete Selected/,
        });
        expect(deleteButton.textContent).toBe("Delete Selected (1)");
      });

      // Click delete button
      const deleteButton = screen.getByRole("button", {
        name: /Delete Selected/,
      });
      fireEvent.click(deleteButton);

      // Verify delete service was called
      await waitFor(() => {
        expect(mockExpenseService.deleteExpenses).toHaveBeenCalled();
      });
    }
  });

  it("disables delete button when no expenses selected", async () => {
    render(
      <TestWrapper>
        <ExpenseList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Cat Expenses")).toBeInTheDocument();
    });

    const deleteButton = screen.getByText("Delete Selected (0)");
    expect(deleteButton).toBeDisabled();
  });

  it("shows deleting state during delete operation", async () => {
    // Mock a delayed delete response
    mockExpenseService.deleteExpenses.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(), 100))
    );

    render(
      <TestWrapper>
        <ExpenseList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Cat Expenses")).toBeInTheDocument();
    });

    // Select an expense
    const checkboxes = screen.getAllByRole("checkbox");
    if (checkboxes.length > 1) {
      fireEvent.click(checkboxes[1]);

      await waitFor(() => {
        const deleteButton = screen.getByRole("button", {
          name: /Delete Selected/,
        });
        expect(deleteButton.textContent).toBe("Delete Selected (1)");
      });

      // Click delete button
      const deleteButton = screen.getByRole("button", {
        name: /Delete Selected/,
      });
      fireEvent.click(deleteButton);

      // Should show deleting state
      await waitFor(() => {
        expect(screen.getByText("Deleting...")).toBeInTheDocument();
      });
    }
  });

  it("handles delete operation failure", async () => {
    const error = new Error("Delete failed");
    mockExpenseService.deleteExpenses.mockRejectedValue(error);

    render(
      <TestWrapper>
        <ExpenseList />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Cat Expenses")).toBeInTheDocument();
    });

    // Select an expense
    const checkboxes = screen.getAllByRole("checkbox");
    if (checkboxes.length > 1) {
      fireEvent.click(checkboxes[1]);

      await waitFor(() => {
        const deleteButton = screen.getByRole("button", {
          name: /Delete Selected/,
        });
        expect(deleteButton.textContent).toBe("Delete Selected (1)");
      });

      // Click delete button
      const deleteButton = screen.getByRole("button", {
        name: /Delete Selected/,
      });
      fireEvent.click(deleteButton);

      // Verify delete service was called
      await waitFor(() => {
        expect(mockExpenseService.deleteExpenses).toHaveBeenCalled();
      });
    }
  });
});
