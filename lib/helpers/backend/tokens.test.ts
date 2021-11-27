import { hashToken } from "./tokens";

describe("test", () => {
  test("hash token", () => {
    expect(hashToken("asdf1234")).toBe(
      "312433c28349f63c4f387953ff337046e794bea0f9b9ebfcb08e90046ded9c76"
    );
  });
});
