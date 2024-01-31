import { FsWarning, StringWarning } from "../src/lib/errors";

describe("FsWarning Class", () => {
  it("should be an instance of Error", () => {
    const fsWarning = new FsWarning("File system warning");

    expect(fsWarning).toBeInstanceOf(Error);
  });

  it("should have correct name and message properties", () => {
    const errorMessage = "File system warning";
    const fsWarning = new FsWarning(errorMessage);

    expect(fsWarning.name).toBe("FsWarning");
    expect(fsWarning.message).toBe(`[FsWarning]: ${errorMessage}`);
  });
});

describe("StringWarning Class", () => {
  it("should be an instance of Error", () => {
    const stringWarning = new StringWarning("String warning");

    expect(stringWarning).toBeInstanceOf(Error);
  });

  it("should have correct name and message properties", () => {
    const errorMessage = "String warning";
    const stringWarning = new StringWarning(errorMessage);

    expect(stringWarning.name).toBe("StringWarning");
    expect(stringWarning.message).toBe(`[StringWarning]: ${errorMessage}`);
  });
});
