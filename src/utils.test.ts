import { describe, expect, it } from "vitest";

describe("isAdult", () => {
  it("should return true for age 18", () => {
    expect(utils.isAdult(18)).toBe(true);
  });

  it("should return true for ages greater than 18", () => {
    expect(utils.isAdult(19)).toBe(true);
    expect(utils.isAdult(25)).toBe(true);
    expect(utils.isAdult(65)).toBe(true);
  });

  it("should return false for ages less than 18", () => {
    expect(utils.isAdult(17)).toBe(false);
    expect(utils.isAdult(16)).toBe(false);
    expect(utils.isAdult(0)).toBe(false);
  });

  it("should handle edge cases", () => {
    expect(utils.isAdult(17.9)).toBe(false);
    expect(utils.isAdult(18.1)).toBe(true);
  });

  it("should handle negative ages", () => {
    expect(utils.isAdult(-1)).toBe(false);
    expect(utils.isAdult(-10)).toBe(false);
  });
});
