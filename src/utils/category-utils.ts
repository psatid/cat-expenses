import type { ExpenseCategory } from "@/types/expense";

export function getCategoryBadgeVariant(category: ExpenseCategory) {
  switch (category) {
    case "food":
      return "bg-green-100 text-green-800 border-green-200";
    case "furniture":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "accessory":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}
