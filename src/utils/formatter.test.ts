import { describe, it, expect } from "vitest";
import { formatCurrency } from "./formatter";

describe("formatCurrency", () => {
  it("formats positive numbers correctly", () => {
    expect(formatCurrency(0)).toContain("0.00");
    expect(formatCurrency(0)).toContain("THB");
    expect(formatCurrency(100)).toContain("100.00");
    expect(formatCurrency(1000)).toContain("1,000.00");
    expect(formatCurrency(10000)).toContain("10,000.00");
    expect(formatCurrency(100000)).toContain("100,000.00");
    expect(formatCurrency(1234567)).toContain("1,234,567.00");
  });

  it("formats decimal numbers correctly", () => {
    expect(formatCurrency(100.5)).toContain("100.50");
    expect(formatCurrency(1000.25)).toContain("1,000.25");
    expect(formatCurrency(1234.56)).toContain("1,234.56");
  });

  it("handles negative numbers", () => {
    expect(formatCurrency(-100)).toContain("100.00");
    expect(formatCurrency(-100)).toContain("-");
    expect(formatCurrency(-1000)).toContain("1,000.00");
    expect(formatCurrency(-1234.56)).toContain("1,234.56");
  });

  it("handles very large numbers", () => {
    expect(formatCurrency(999999999)).toContain("999,999,999.00");
    expect(formatCurrency(1000000000)).toContain("1,000,000,000.00");
  });

  it("handles zero and small numbers", () => {
    expect(formatCurrency(0)).toContain("0.00");
    expect(formatCurrency(0.01)).toContain("0.01");
    expect(formatCurrency(0.1)).toContain("0.10");
    expect(formatCurrency(1)).toContain("1.00");
  });

  it("includes THB currency in all outputs", () => {
    expect(formatCurrency(100)).toContain("THB");
    expect(formatCurrency(-100)).toContain("THB");
    expect(formatCurrency(0)).toContain("THB");
  });
});
