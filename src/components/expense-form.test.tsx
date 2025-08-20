import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ExpenseForm } from "./expense-form";
import { ExpenseService } from "@/services/expense-service";
import { CatFactService } from "@/services/cat-fact-service";

// Mock the services
vi.mock("@/services/expense-service");
vi.mock("@/services/cat-fact-service");
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockExpenseService = vi.mocked(ExpenseService);
const mockCatFactService = vi.mocked(CatFactService);

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

describe("ExpenseForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock successful cat fact response
    mockCatFactService.getRandomCatFact.mockResolvedValue({
      fact: "Cats spend 70% of their lives sleeping.",
      length: 35,
    });
    
    // Mock successful expense addition
    mockExpenseService.addExpense.mockResolvedValue({
      id: "1",
      itemName: "Premium Cat Food",
      category: "food",
      amount: 500,
      createdAt: new Date().toISOString(),
    });
  });

  it("renders the add expense button", () => {
    render(
      <TestWrapper>
        <ExpenseForm />
      </TestWrapper>
    );
    
    expect(screen.getByRole("button", { name: /add expense/i })).toBeInTheDocument();
  });

  it("opens dialog when add expense button is clicked", async () => {
    render(
      <TestWrapper>
        <ExpenseForm />
      </TestWrapper>
    );
    
    const addButton = screen.getByRole("button", { name: /add expense/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText("Add Cat Expense")).toBeInTheDocument();
    });
  });

  it("displays cat fact when dialog opens", async () => {
    render(
      <TestWrapper>
        <ExpenseForm />
      </TestWrapper>
    );
    
    const addButton = screen.getByRole("button", { name: /add expense/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      // The cat fact text is wrapped in quotes, so we need to match it differently
      expect(screen.getByText(/Cats spend 70% of their lives sleeping/)).toBeInTheDocument();
    });
  });

  it("shows loading state for cat fact", async () => {
    // Mock delayed response
    mockCatFactService.getRandomCatFact.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ fact: "Test fact", length: 10 }), 100))
    );
    
    render(
      <TestWrapper>
        <ExpenseForm />
      </TestWrapper>
    );
    
    const addButton = screen.getByRole("button", { name: /add expense/i });
    fireEvent.click(addButton);
    
    expect(screen.getByText("Loading cat fact...")).toBeInTheDocument();
  });

  it("renders form fields correctly", async () => {
    render(
      <TestWrapper>
        <ExpenseForm />
      </TestWrapper>
    );
    
    const addButton = screen.getByRole("button", { name: /add expense/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByLabelText("Item Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Category")).toBeInTheDocument();
      expect(screen.getByLabelText("Amount (THB)")).toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    render(
      <TestWrapper>
        <ExpenseForm />
      </TestWrapper>
    );
    
    const addButton = screen.getByRole("button", { name: /add expense/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      const itemNameInput = screen.getByLabelText("Item Name");
      const amountInput = screen.getByLabelText("Amount (THB)");
      const submitButton = screen.getByRole("button", { name: /add expense/i });
      
      fireEvent.change(itemNameInput, { target: { value: "Premium Cat Food" } });
      fireEvent.change(amountInput, { target: { value: "500" } });
      fireEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(mockExpenseService.addExpense).toHaveBeenCalledWith({
        itemName: "Premium Cat Food",
        category: "food", // default value
        amount: 500,
      });
    });
  });

  it("validates required fields", async () => {
    render(
      <TestWrapper>
        <ExpenseForm />
      </TestWrapper>
    );
    
    const addButton = screen.getByRole("button", { name: /add expense/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      const submitButton = screen.getByRole("button", { name: /add expense/i });
      fireEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText("Item name is required")).toBeInTheDocument();
    });
  });

  it("validates amount is positive", async () => {
    render(
      <TestWrapper>
        <ExpenseForm />
      </TestWrapper>
    );
    
    const addButton = screen.getByRole("button", { name: /add expense/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      const itemNameInput = screen.getByLabelText("Item Name");
      const amountInput = screen.getByLabelText("Amount (THB)");
      const submitButton = screen.getByRole("button", { name: /add expense/i });
      
      fireEvent.change(itemNameInput, { target: { value: "Test Item" } });
      fireEvent.change(amountInput, { target: { value: "-100" } });
      fireEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText("Amount is required")).toBeInTheDocument();
    });
  });

  it("closes dialog after successful submission", async () => {
    render(
      <TestWrapper>
        <ExpenseForm />
      </TestWrapper>
    );
    
    const addButton = screen.getByRole("button", { name: /add expense/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      const itemNameInput = screen.getByLabelText("Item Name");
      const amountInput = screen.getByLabelText("Amount (THB)");
      const submitButton = screen.getByRole("button", { name: /add expense/i });
      
      fireEvent.change(itemNameInput, { target: { value: "Premium Cat Food" } });
      fireEvent.change(amountInput, { target: { value: "500" } });
      fireEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(screen.queryByText("Add Cat Expense")).not.toBeInTheDocument();
    });
  });

  it("resets form after successful submission", async () => {
    render(
      <TestWrapper>
        <ExpenseForm />
      </TestWrapper>
    );
    
    const addButton = screen.getByRole("button", { name: /add expense/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      const itemNameInput = screen.getByLabelText("Item Name");
      const amountInput = screen.getByLabelText("Amount (THB)");
      const submitButton = screen.getByRole("button", { name: /add expense/i });
      
      fireEvent.change(itemNameInput, { target: { value: "Premium Cat Food" } });
      fireEvent.change(amountInput, { target: { value: "500" } });
      fireEvent.click(submitButton);
    });
    
    // Open dialog again
    fireEvent.click(addButton);
    
    await waitFor(() => {
      const itemNameInput = screen.getByLabelText("Item Name");
      expect((itemNameInput as HTMLInputElement).value).toBe("");
    });
  });

  it("shows loading state during submission", async () => {
    // Mock delayed response
    mockExpenseService.addExpense.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        id: "1",
        itemName: "Premium Cat Food",
        category: "food",
        amount: 500,
        createdAt: new Date().toISOString(),
      }), 100))
    );
    
    render(
      <TestWrapper>
        <ExpenseForm />
      </TestWrapper>
    );
    
    const addButton = screen.getByRole("button", { name: /add expense/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      const itemNameInput = screen.getByLabelText("Item Name");
      const amountInput = screen.getByLabelText("Amount (THB)");
      const submitButton = screen.getByRole("button", { name: /add expense/i });
      
      fireEvent.change(itemNameInput, { target: { value: "Premium Cat Food" } });
      fireEvent.change(amountInput, { target: { value: "500" } });
      fireEvent.click(submitButton);
    });
    
    expect(screen.getByText("Adding...")).toBeInTheDocument();
  });

  it("handles cat fact error gracefully", async () => {
    mockCatFactService.getRandomCatFact.mockRejectedValue(new Error("API Error"));
    
    render(
      <TestWrapper>
        <ExpenseForm />
      </TestWrapper>
    );
    
    const addButton = screen.getByRole("button", { name: /add expense/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText("Add Cat Expense")).toBeInTheDocument();
    });
  });
});
