import type { CatFact } from "../types/expense";

const CAT_FACT_API_URL = "https://catfact.ninja/fact";

export class CatFactService {
  static async getRandomCatFact(): Promise<CatFact> {
    try {
      const response = await fetch(CAT_FACT_API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch cat fact");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching cat fact:", error);
      // Return a fallback cat fact
      return {
        fact: "Cats are amazing creatures that bring joy to our lives! 😸",
        length: 65,
      };
    }
  }
}
