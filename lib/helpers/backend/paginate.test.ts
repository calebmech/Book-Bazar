import { paginate } from "./paginate";

describe("test paginate", () => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  test("should return the first page", () => {
    expect(paginate(data, 5, 0)).toStrictEqual([1, 2, 3, 4, 5]);
  });

  test("should return less items on the last page", () => {
    expect(paginate(data, 5, 1)).toStrictEqual([6, 7, 8, 9]);
  });

  test("should be empty when accessing past end", () => {
    expect(paginate(data, 5, 2)).toStrictEqual([]);
  });

  test("should error with negative or zero page size", () => {
    expect(() => paginate(data, -1, 1)).toThrow();
    expect(() => paginate(data, 0, 1)).toThrow();
  });

  test("should error when trying to access negative page number", () => {
    expect(() => paginate(data, 5, -2)).toThrow();
  });
});
