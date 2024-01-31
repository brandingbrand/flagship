import fs from "fs/promises";

import { withUTF8 } from "../src/parsers/utf-8";

jest.mock("fs/promises");

describe("withUTF8", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should read, transform, and write file content", async () => {
    const filePath = "/path/to/file.txt";
    const content = "original content";
    const transformedContent = "transformed content";

    jest.spyOn(fs, "readFile").mockResolvedValue(content);
    jest.spyOn(fs, "writeFile").mockResolvedValue();

    await withUTF8(filePath, (inputContent: string) => {
      expect(inputContent).toBe(content);

      return transformedContent;
    });

    expect(fs.readFile).toHaveBeenCalledWith(filePath, "utf-8");
    expect(fs.writeFile).toHaveBeenCalledWith(
      filePath,
      transformedContent,
      "utf-8"
    );
  });
});
