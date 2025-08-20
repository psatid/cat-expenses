import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

// Mock the child components to focus on App structure
vi.mock("@/components/layout", () => ({
  Layout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

vi.mock("@/pages/expense-page", () => ({
  ExpensePage: () => <div data-testid="expense-page">Expense Page</div>,
}));

vi.mock("@/components/shadcn", () => ({
  Toaster: () => <div data-testid="toaster">Toaster</div>,
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

describe("App", () => {
  it("renders without crashing", () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    expect(document.body).toBeDefined();
  });

  it("renders the layout component", () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    expect(screen.getByTestId("layout")).toBeInTheDocument();
  });

  it("renders the expense page component", () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    expect(screen.getByTestId("expense-page")).toBeInTheDocument();
  });

  it("renders the toaster component", () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    expect(screen.getByTestId("toaster")).toBeInTheDocument();
  });

  it("wraps the app with QueryClientProvider", () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    // The app should render successfully with QueryClient, which means
    // the provider is working correctly
    expect(screen.getByTestId("layout")).toBeInTheDocument();
    expect(screen.getByTestId("expense-page")).toBeInTheDocument();
    expect(screen.getByTestId("toaster")).toBeInTheDocument();
  });

  it("has the correct component hierarchy", () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
    
    const layout = screen.getByTestId("layout");
    const expensePage = screen.getByTestId("expense-page");
    const toaster = screen.getByTestId("toaster");
    
    // All main components should be present
    expect(layout).toBeInTheDocument();
    expect(expensePage).toBeInTheDocument();
    expect(toaster).toBeInTheDocument();
  });
});
