import fs from "fs/promises";

import * as localFs from "../src/lib/fs";
import { FsWarning } from "../src/lib/errors";

describe("doesKeywordExist", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return true if the keyword exists in the file content", async () => {
    const path = "/some/file.txt";
    const keyword = "someKeyword";
    const fileContent = "This is someKeyword content.";

    const spy = jest
      .spyOn(fs, "readFile")
      .mockResolvedValue({ toString: () => fileContent } as string);

    const result = await localFs.doesKeywordExist(path, keyword);

    expect(result).toBe(true);
    expect(spy).toHaveBeenCalledWith(path);
  });

  it("should not return true if the keyword exists in the file content", async () => {
    const path = "/some/file.txt";
    const keyword = "nonexistent";
    const fileContent = "This is someKeyword content.";

    const spy = jest
      .spyOn(fs, "readFile")
      .mockResolvedValue({ toString: () => fileContent } as string);

    const result = await localFs.doesKeywordExist(path, keyword);

    expect(result).toBe(false);
    expect(spy).toHaveBeenCalledWith(path);
  });
});

describe("update", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should throw FsWarning if the keyword does not exist in the file", async () => {
    const path = "/some/file.txt";
    const oldText = /nonexistentKeyword/g;

    jest
      .spyOn(fs, "readFile")
      .mockResolvedValue({ toString: () => "" } as string);

    jest.spyOn(localFs, "doesKeywordExist").mockResolvedValue(false);

    await expect(localFs.update(path, oldText, "newText")).rejects.toThrow(
      FsWarning
    );
  });
});
