import * as glob from "glob";
import fs from "fs/promises";

import { globAndReplace } from "../src/lib/glob";

jest.mock("glob");
jest.mock("fs/promises");

describe("glob", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("", async () => {
    jest.spyOn(glob, "glob").mockResolvedValue(["file1.txt", "file2.txt"]);
    jest.spyOn(fs, "readFile").mockResolvedValue("Old text in file");
    jest.spyOn(fs, "writeFile").mockImplementation(jest.fn());

    await globAndReplace("*.txt", /Old text/, "New text");

    expect(glob.glob).toHaveBeenCalledWith("*.txt");
    expect(fs.readFile).toHaveBeenCalledWith(expect.any(String), "utf-8");
    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.any(String),
      "New text in file",
      "utf-8"
    );
  });
});
