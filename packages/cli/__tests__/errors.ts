import { isWarning } from "../src/lib/errors";

describe("isWarning function", () => {
  it("should return true for a warning error object", () => {
    const warningError = new Error("This is a warning");

    warningError.name = "Warning";

    expect(isWarning(warningError)).toBe(true);
  });

  it("should return true for a custom warning error object", () => {
    class CustomWarning extends Error {
      constructor(message: string) {
        super(message);
        this.name = "CustomWarning";
      }
    }

    const customWarning = new CustomWarning("This is a custom warning");

    expect(isWarning(customWarning)).toBe(true);
  });

  it("should return false for a non-warning error object", () => {
    const error = new Error("This is an error");

    expect(isWarning(error)).toBe(false);
  });

  it("should return false for an object with no 'name' property", () => {
    const objWithoutName = { message: "This is not an error" };

    expect(isWarning(objWithoutName)).toBe(false);
  });

  it("should return false for an object with 'name' property of non-string type", () => {
    const objWithNameNotString = { name: 123, message: "This is not an error" };

    expect(isWarning(objWithNameNotString)).toBe(false);
  });

  it("should return false for an object with 'name' property not containing 'warning'", () => {
    const objWithNonWarningName = {
      name: "Error",
      message: "This is not an error",
    };

    expect(isWarning(objWithNonWarningName)).toBe(false);
  });

  it("should return true for a warning error object with 'warning' in the name in any case", () => {
    const warningError = new Error("This is a WARNING");
    warningError.name = "myWARNING";

    expect(isWarning(warningError)).toBe(false);
  });
});
