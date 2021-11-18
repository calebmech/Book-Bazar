import { isAlmostSubstring } from "./search";

describe("test isAlmostSubstring", () => {
  test("exact match", () => {
    const text = "asdfMatched";
    expect(isAlmostSubstring(text, text)).toBe(true);
  });

  test("exact substring", () => {
    expect(isAlmostSubstring("asdf", "asdf1234")).toBe(true);
    expect(isAlmostSubstring("asdf1234", "asdf")).toBe(true);
  });

  test("substring with exactly half match", () => {
    expect(isAlmostSubstring("asqw", "asdf1234")).toBe(true);
    expect(isAlmostSubstring("asdf1234", "asqw")).toBe(true);
  });

  test("substring with under half match", () => {
    expect(isAlmostSubstring("aqwe", "asdf1234")).toBe(false);
    expect(isAlmostSubstring("asdf1234", "aqwe")).toBe(false);
  });

  test("no match between strings", () => {
    expect(isAlmostSubstring("qwer", "asdf1234")).toBe(false);
    expect(isAlmostSubstring("asdf1234", "qwer")).toBe(false);
  });

  test("empty string is almost a substring", () => {
    expect(isAlmostSubstring("", "asdf1234")).toBe(true);
  });

  test("case insensitive", () => {
    expect(isAlmostSubstring("cheese", "CHEESE")).toBe(true);
  });
});
