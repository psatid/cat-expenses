import type { CatFact } from "../types/expense";

const CAT_FACT_API_URL = "https://catfact.ninja/fact";

export class CatFactService {
  static async getRandomCatFact(): Promise<CatFact> {
    const response = await fetch(CAT_FACT_API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch cat fact");
    }
    return await response.json();
  }
}
