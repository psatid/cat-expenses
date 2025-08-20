import { describe, expect, it } from "vitest";
import { getCategoryBadgeVariant } from "./category-utils";

describe("getCategoryBadgeVariant", () => {
  it("returns correct variant for food category", () => {
    expect(getCategoryBadgeVariant("food")).toBe(
      "bg-green-100 text-green-800 border-green-200"
    );
  });

  it("returns correct variant for furniture category", () => {
    expect(getCategoryBadgeVariant("furniture")).toBe(
      "bg-blue-100 text-blue-800 border-blue-200"
    );
  });

  it("returns correct variant for accessory category", () => {
    expect(getCategoryBadgeVariant("accessory")).toBe(
      "bg-purple-100 text-purple-800 border-purple-200"
    );
  });
});
