import fs from "fs/promises";
import { X2jOptions, XMLParser, XMLBuilder } from "fast-xml-parser";

import { BUILD_OPTS, OPTS, withXml } from "../src/parsers/xml";

jest.mock("fs/promises");
jest.mock("fast-xml-parser");

describe("withXml", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should parse, modify, and write XML file", async () => {
    const path = "/path/to/xml";
    const originalXml = { root: { element: "value" } };
    const modifiedXml = { root: { element: "modifiedValue" } };
    const options: X2jOptions = {};

    jest.spyOn(fs, "readFile").mockResolvedValue(JSON.stringify(originalXml));
    jest.spyOn(XMLParser.prototype, "parse").mockReturnValue(originalXml);
    jest.spyOn(fs, "writeFile").mockResolvedValue();

    await withXml(path, options, (xml: any) => {
      expect(xml).toEqual(originalXml);

      xml.root.element = "modifiedValue";
    });

    expect(fs.readFile).toHaveBeenCalledWith(path);
    expect(XMLParser).toHaveBeenCalledWith({
      ...options,
      ...OPTS,
    });
    expect(fs.writeFile).toHaveBeenCalledWith(
      path,
      new XMLBuilder({ ...BUILD_OPTS, format: true }).build(modifiedXml)
    );
  });
});
