import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { CatFactService } from "./cat-fact-service";
import type { CatFact } from "../types/expense";

// Mock fetch globally
global.fetch = vi.fn();

const mockFetch = vi.mocked(fetch);

describe("CatFactService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getRandomCatFact", () => {
    it("fetches and returns a random cat fact successfully", async () => {
      const mockResponse: CatFact = {
        fact: "Cats spend 70% of their lives sleeping.",
        length: 35,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await CatFactService.getRandomCatFact();

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith("https://catfact.ninja/fact");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("handles different cat fact responses", async () => {
      const mockResponse: CatFact = {
        fact: "A group of cats is called a clowder.",
        length: 42,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await CatFactService.getRandomCatFact();

      expect(result).toEqual(mockResponse);
      expect(result.fact).toBe("A group of cats is called a clowder.");
      expect(result.length).toBe(42);
    });

    it("throws error on network errors", async () => {
      const networkError = new Error("Network error");
      mockFetch.mockRejectedValueOnce(networkError);

      await expect(CatFactService.getRandomCatFact()).rejects.toThrow(
        "Network error"
      );
      expect(mockFetch).toHaveBeenCalledWith("https://catfact.ninja/fact");
    });

    it("throws error on HTTP error responses", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      } as Response);

      await expect(CatFactService.getRandomCatFact()).rejects.toThrow(
        "Failed to fetch cat fact"
      );
    });

    it("throws error on 404 errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
      } as Response);

      await expect(CatFactService.getRandomCatFact()).rejects.toThrow(
        "Failed to fetch cat fact"
      );
    });

    it("throws error on malformed JSON responses", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      } as unknown as Response);

      await expect(CatFactService.getRandomCatFact()).rejects.toThrow(
        "Invalid JSON"
      );
    });

    it("accepts any valid API response structure", async () => {
      // The service doesn't validate response structure, it just returns what the API gives
      const mockResponse = { fact: "Cats are amazing.", length: 20 };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await CatFactService.getRandomCatFact();

      expect(result).toEqual(mockResponse);
    });

    it("accepts response with different data types", async () => {
      // The service doesn't validate data types, it just returns what the API gives
      const mockResponse = { fact: "Cats are amazing.", length: "20" };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await CatFactService.getRandomCatFact();

      expect(result).toEqual(mockResponse);
    });

    it("handles very long cat facts", async () => {
      const longFact = "A".repeat(1000);
      const mockResponse: CatFact = {
        fact: longFact,
        length: 1000,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await CatFactService.getRandomCatFact();

      expect(result).toEqual(mockResponse);
      expect(result.fact.length).toBe(1000);
    });

    it("handles special characters in cat facts", async () => {
      const specialFact = "Cats can make over 100 different vocal sounds! 🐱";
      const mockResponse: CatFact = {
        fact: specialFact,
        length: 45,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await CatFactService.getRandomCatFact();

      expect(result).toEqual(mockResponse);
      expect(result.fact).toContain("🐱");
    });
  });

  describe("API endpoint consistency", () => {
    it("always calls the correct API endpoint", async () => {
      const mockResponse: CatFact = {
        fact: "Test fact",
        length: 10,
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await CatFactService.getRandomCatFact();
      await CatFactService.getRandomCatFact();
      await CatFactService.getRandomCatFact();

      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(mockFetch).toHaveBeenNthCalledWith(
        1,
        "https://catfact.ninja/fact"
      );
      expect(mockFetch).toHaveBeenNthCalledWith(
        2,
        "https://catfact.ninja/fact"
      );
      expect(mockFetch).toHaveBeenNthCalledWith(
        3,
        "https://catfact.ninja/fact"
      );
    });
  });

  describe("error handling consistency", () => {
    it("consistently throws errors for different error types", async () => {
      // Network error
      mockFetch.mockRejectedValueOnce(new Error("Network error"));
      await expect(CatFactService.getRandomCatFact()).rejects.toThrow(
        "Network error"
      );

      // HTTP error
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      } as Response);
      await expect(CatFactService.getRandomCatFact()).rejects.toThrow(
        "Failed to fetch cat fact"
      );

      // Invalid response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ invalid: "response" }),
      } as Response);
      const result = await CatFactService.getRandomCatFact();
      expect(result).toEqual({ invalid: "response" });
    });
  });
});
