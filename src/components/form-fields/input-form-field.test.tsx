import { fireEvent, render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import { Form } from "../shadcn/form";
import { InputFormField } from "./input-form-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, Eye } from "lucide-react";

describe("InputFormField", () => {
  function Wrapper(props: { label?: string; placeholder?: string }) {
    const methods = useForm({ defaultValues: { test: "" } });
    return (
      <Form {...methods}>
        <InputFormField
          form={methods}
          name="test"
          label={props.label}
          placeholder={props.placeholder}
        />
      </Form>
    );
  }

  it("renders with label and placeholder", () => {
    render(<Wrapper label="Test Label" placeholder="Test Placeholder" />);
    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Test Placeholder")).toBeInTheDocument();
  });

  it("handles input change", () => {
    render(<Wrapper label="Test Label" placeholder="Test Placeholder" />);
    const input = screen.getByLabelText("Test Label");
    fireEvent.change(input, { target: { value: "hello" } });
    expect((input as HTMLInputElement).value).toBe("hello");
  });

  it("shows zod validation error", async () => {
    const schema = z.object({
      test: z.string().min(3, "Must be at least 3 characters"),
    });
    function ZodWrapper() {
      const methods = useForm({
        defaultValues: { test: "" },
        resolver: zodResolver(schema),
      });
      return (
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(() => null)}>
            <InputFormField
              form={methods}
              name="test"
              label="Test Label"
              placeholder="Test Placeholder"
            />
            <button type="submit">Submit</button>
          </form>
        </Form>
      );
    }
    render(<ZodWrapper />);
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    expect(
      await screen.findByText(/must be at least 3 characters/i)
    ).toBeInTheDocument();
  });

  it("renders leftIcon when provided", () => {
    const LeftIcon = <Search data-testid="left-icon" />;
    function IconWrapper() {
      const methods = useForm({ defaultValues: { test: "" } });
      return (
        <Form {...methods}>
          <InputFormField
            form={methods}
            name="test"
            label="Test Label"
            leftIcon={LeftIcon}
          />
        </Form>
      );
    }
    render(<IconWrapper />);
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
  });

  it("renders rightIcon when provided", () => {
    const RightIcon = <Eye data-testid="right-icon" />;
    function IconWrapper() {
      const methods = useForm({ defaultValues: { test: "" } });
      return (
        <Form {...methods}>
          <InputFormField
            form={methods}
            name="test"
            label="Test Label"
            rightIcon={RightIcon}
          />
        </Form>
      );
    }
    render(<IconWrapper />);
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });
});
