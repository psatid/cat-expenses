import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi } from "vitest";
import { ExpensePage } from "./expense-page";

// Mock the child components
vi.mock("@/components/expense-form", () => ({
  ExpenseForm: () => <div data-testid="expense-form">Expense Form</div>,
}));

vi.mock("@/components/expense-list", () => ({
  ExpenseList: () => <div data-testid="expense-list">Expense List</div>,
}));

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

describe("ExpensePage", () => {
  it("renders the page title and description", () => {
    render(
      <TestWrapper>
        <ExpensePage />
      </TestWrapper>
    );
    
    expect(screen.getByText("Cat Expense Tracker")).toBeInTheDocument();
    expect(screen.getByText("Keep track of all your feline friend's expenses! 🐱")).toBeInTheDocument();
  });

  it("renders the cat icon", () => {
    render(
      <TestWrapper>
        <ExpensePage />
      </TestWrapper>
    );
    
    // The cat icon should be present (Lucide React icons are rendered as SVGs)
    const catIcon = document.querySelector('svg');
    expect(catIcon).toBeInTheDocument();
  });

  it("renders the expense form component", () => {
    render(
      <TestWrapper>
        <ExpensePage />
      </TestWrapper>
    );
    
    expect(screen.getByTestId("expense-form")).toBeInTheDocument();
  });

  it("renders the expense list component", () => {
    render(
      <TestWrapper>
        <ExpensePage />
      </TestWrapper>
    );
    
    expect(screen.getByTestId("expense-list")).toBeInTheDocument();
  });

  it("has proper layout structure", () => {
    render(
      <TestWrapper>
        <ExpensePage />
      </TestWrapper>
    );
    
    // Check that the main sections are present
    expect(screen.getByText("Cat Expense Tracker")).toBeInTheDocument();
    expect(screen.getByTestId("expense-form")).toBeInTheDocument();
    expect(screen.getByTestId("expense-list")).toBeInTheDocument();
  });

  it("applies correct styling classes", () => {
    render(
      <TestWrapper>
        <ExpensePage />
      </TestWrapper>
    );
    
    // Check that the main container has the expected classes
    const mainContainer = screen.getByText("Cat Expense Tracker").closest('div');
    expect(mainContainer).toHaveClass("flex", "flex-col", "md:flex-row", "items-center", "justify-center", "gap-3", "mb-4");
  });
});
