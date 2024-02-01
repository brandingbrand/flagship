import plist from "simple-plist";

import { withInfoPlist, withPlist } from "../src/parsers/plist";

jest.mock("simple-plist");

describe("withPlist", () => {
  it("should read, modify, and write plist file", async () => {
    const path = "/path/to/plist";
    const originalData = { key: "value" };
    const modifiedData = { key: "modifiedValue" };

    jest
      .spyOn(plist, "readFileSync")
      .mockImplementationOnce(() => originalData);
    jest.spyOn(plist, "writeFileSync").mockImplementationOnce(() => {});

    await withPlist(path, (data) => {
      expect(data).toEqual(originalData);

      return modifiedData;
    });

    expect(plist.readFileSync).toHaveBeenCalledWith(path);
    expect(plist.writeFileSync).toHaveBeenCalledWith(path, modifiedData);
  });
});

describe("withInfoPlist", () => {
  it("should read, modify, and write info plist file", async () => {
    const path = "/path/to/plist";
    const originalData = { key: "value" };
    const modifiedData = { key: "modifiedValue" };

    jest
      .spyOn(plist, "readFileSync")
      .mockImplementationOnce(() => originalData);
    jest.spyOn(plist, "writeFileSync").mockImplementationOnce(() => {});

    await withInfoPlist((data) => {
      expect(data).toEqual(originalData);

      return modifiedData;
    });

    expect(plist.readFileSync).toHaveBeenCalledWith(path);
    expect(plist.writeFileSync).toHaveBeenCalledWith(path, modifiedData);
  });
});
