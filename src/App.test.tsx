import { render } from "@testing-library/react";
import App from "./App";
import { describe, it, expect } from "vitest";

describe("App", () => {
  it("renders without crashing", () => {
    render(<App />);
    // You can add more specific assertions based on your app's content
    expect(document.body).toBeDefined();
  });
});
