import { string } from "../src/lib/string";
import { StringWarning } from "../src/lib/errors";

describe("replace function", () => {
  it("should replace occurrences of a specified substring with a new substring", () => {
    const originalContent = "Hello, world!";
    const newText = string.replace(originalContent, /world/i, "there");
    expect(newText).toBe("Hello, there!");
  });

  it("should replace occurrences of a specified substring when oldText is a string", () => {
    const originalContent = "Hello, world!";
    const newText = string.replace(originalContent, "world", "there");
    expect(newText).toBe("Hello, there!");
  });

  it("should throw a StringWarning if the original content does not contain oldText", () => {
    const originalContent = "Hello, world!";
    const invalidReplace = () =>
      string.replace(originalContent, "nonexistent", "there");
    expect(invalidReplace).toThrow(StringWarning);
    expect(invalidReplace).toThrow(
      "string does not contain value: nonexistent"
    );
  });

  it("should throw a StringWarning if the original content does not match the regular expression", () => {
    const originalContent = "Hello, world!";
    const invalidReplace = () =>
      string.replace(originalContent, /earth/i, "there");
    expect(invalidReplace).toThrow(StringWarning);
    expect(invalidReplace).toThrow("string does not contain value: /earth/i");
  });
});
