import { fireEvent, render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import { Form } from "../shadcn/form";
import { SelectFormField } from "./select-form-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

describe("SelectFormField", () => {
  const mockOptions = [
    { value: "food", label: "Food" },
    { value: "toys", label: "Toys" },
    { value: "healthcare", label: "Healthcare" },
  ];

  function Wrapper(props: { label?: string; placeholder?: string }) {
    const methods = useForm({ defaultValues: { test: "" } });
    return (
      <Form {...methods}>
        <SelectFormField
          form={methods}
          name="test"
          label={props.label}
          placeholder={props.placeholder}
          options={mockOptions}
        />
      </Form>
    );
  }

  it("renders with label and placeholder", () => {
    render(<Wrapper label="Test Label" placeholder="Test Placeholder" />);
    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
    expect(screen.getByText("Test Placeholder")).toBeInTheDocument();
  });

  it("displays options when opened", () => {
    render(<Wrapper label="Test Label" placeholder="Test Placeholder" />);
    const select = screen.getByLabelText("Test Label");
    fireEvent.click(select);
    
    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("Toys")).toBeInTheDocument();
    expect(screen.getByText("Healthcare")).toBeInTheDocument();
  });

  it("selects an option when clicked", () => {
    render(<Wrapper label="Test Label" placeholder="Test Placeholder" />);
    const select = screen.getByLabelText("Test Label");
    fireEvent.click(select);
    
    const foodOption = screen.getByText("Food");
    fireEvent.click(foodOption);
    
    expect(screen.getByText("Food")).toBeInTheDocument();
  });

  it("shows zod validation error", async () => {
    const schema = z.object({
      test: z.string().min(1, "Please select a category"),
    });
    
    function ZodWrapper() {
      const methods = useForm({
        defaultValues: { test: "" },
        resolver: zodResolver(schema),
      });
      return (
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(() => null)}>
            <SelectFormField
              form={methods}
              name="test"
              label="Test Label"
              placeholder="Test Placeholder"
              options={mockOptions}
            />
            <button type="submit">Submit</button>
          </form>
        </Form>
      );
    }
    
    render(<ZodWrapper />);
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    
    expect(
      await screen.findByText(/please select a category/i)
    ).toBeInTheDocument();
  });

  it("handles empty options array", () => {
    function EmptyOptionsWrapper() {
      const methods = useForm({ defaultValues: { test: "" } });
      return (
        <Form {...methods}>
          <SelectFormField
            form={methods}
            name="test"
            label="Test Label"
            placeholder="Test Placeholder"
            options={[]}
          />
        </Form>
      );
    }
    
    render(<EmptyOptionsWrapper />);
    const select = screen.getByLabelText("Test Label");
    fireEvent.click(select);
    
    // Should not crash and should show no options
    expect(screen.queryByText("Food")).not.toBeInTheDocument();
  });

  it("updates form value when option is selected", () => {
    function TestWrapper() {
      const methods = useForm({ defaultValues: { test: "" } });
      return (
        <Form {...methods}>
          <SelectFormField
            form={methods}
            name="test"
            label="Test Label"
            placeholder="Test Placeholder"
            options={mockOptions}
          />
          <div data-testid="form-value">{methods.watch("test")}</div>
        </Form>
      );
    }
    
    render(<TestWrapper />);
    const select = screen.getByLabelText("Test Label");
    fireEvent.click(select);
    
    const foodOption = screen.getByText("Food");
    fireEvent.click(foodOption);
    
    expect(screen.getByTestId("form-value")).toHaveTextContent("food");
  });
});
