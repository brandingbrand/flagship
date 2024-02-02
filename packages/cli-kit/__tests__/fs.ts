import fs from "../src/lib/fs";
import { FsWarning } from "../src/lib/errors";

jest.mock("fs/promises");

describe("fs", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("doesKeywordExist", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it("should return true if the keyword exists in the file content", async () => {
      const path = "/some/file.txt";
      const keyword = "someKeyword";
      const fileContent = "This is someKeyword content.";

      const spy = jest.spyOn(fs, "readFile").mockResolvedValue(fileContent);

      const result = await fs.doesKeywordExist(path, keyword);

      expect(result).toBe(true);
      expect(spy).toHaveBeenCalledWith(path, "utf-8");
    });

    it("should not return true if the keyword exists in the file content", async () => {
      const path = "/some/file.txt";
      const keyword = "nonexistent";
      const fileContent = "This is someKeyword content.";

      const spy = jest.spyOn(fs, "readFile").mockResolvedValue(fileContent);

      const result = await fs.doesKeywordExist(path, keyword);

      expect(result).toBe(false);
      expect(spy).toHaveBeenCalledWith(path, "utf-8");
    });
  });

  describe("updateFileContent", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it("should throw FsWarning if the keyword does not exist in the file", async () => {
      const path = "/some/file.txt";
      const oldText = /nonexistentKeyword/g;

      jest.spyOn(fs, "readFile").mockResolvedValue("");

      jest.spyOn(fs, "doesKeywordExist").mockResolvedValue(false);

      await expect(fs.update(path, oldText, "newText")).rejects.toThrow(
        FsWarning
      );
    });
  });
});
