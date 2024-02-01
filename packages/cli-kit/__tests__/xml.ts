import fs from "fs/promises";
import { X2jOptions, XMLParser, XMLBuilder } from "fast-xml-parser";

import {
  BUILD_OPTS,
  OPTS,
  withColors,
  withManifest,
  withNetworkSecurityConfig,
  withStrings,
  withStyles,
  withXml,
} from "../src/parsers/xml";
import { paths } from "../src/lib/paths";

jest.mock("fs/promises");
jest.mock("fast-xml-parser");

const originalXml = { root: { element: "value" } };
const modifiedXml = { root: { element: "modifiedValue" } };

jest.spyOn(fs, "readFile").mockResolvedValue(JSON.stringify(originalXml));
jest.spyOn(fs, "writeFile").mockResolvedValue();
jest.spyOn(XMLParser.prototype, "parse").mockReturnValue(originalXml);

describe("withXml", () => {
  it("should parse, modify, and write XML file", async () => {
    const path = "/path/to/xml";

    await withXml(path, {}, (xml: any) => {
      expect(xml).toEqual(originalXml);

      xml.root.element = "modifiedValue";
    });

    expect(fs.readFile).toHaveBeenCalledWith(path);
    expect(XMLParser).toHaveBeenCalledWith({
      ...OPTS,
    });
    expect(fs.writeFile).toHaveBeenCalledWith(
      path,
      new XMLBuilder({ ...BUILD_OPTS, format: true }).build(modifiedXml)
    );
  });
});

describe("withColors", () => {
  it("should parse, modify, and write color XML file", async () => {
    await withColors((xml: any) => {
      expect(xml).toEqual(originalXml);

      xml.root.element = "modifiedValue";
    });

    expect(fs.readFile).toHaveBeenCalledWith(paths.android.colors());
    expect(fs.writeFile).toHaveBeenCalledWith(
      paths.android.colors(),
      new XMLBuilder({ ...BUILD_OPTS, format: true }).build(modifiedXml)
    );
  });
});

describe("withStyles", () => {
  it("should parse, modify, and write styles XML file", async () => {
    await withStyles((xml: any) => {
      expect(xml).toEqual(originalXml);

      xml.root.element = "modifiedValue";
    });

    expect(fs.readFile).toHaveBeenCalledWith(paths.android.styles());
    expect(fs.writeFile).toHaveBeenCalledWith(
      paths.android.styles(),
      new XMLBuilder({ ...BUILD_OPTS, format: true }).build(modifiedXml)
    );
  });
});

describe("withManifest", () => {
  it("should parse, modify, and write android manifest XML file", async () => {
    await withManifest((xml: any) => {
      expect(xml).toEqual(originalXml);

      xml.root.element = "modifiedValue";
    });

    expect(fs.readFile).toHaveBeenCalledWith(paths.android.androidManifest());
    expect(fs.writeFile).toHaveBeenCalledWith(
      paths.android.androidManifest(),
      new XMLBuilder({ ...BUILD_OPTS, format: true }).build(modifiedXml)
    );
  });
});

describe("withNetworkSecurityConfig", () => {
  it("should parse, modify, and write network security config XML file", async () => {
    await withNetworkSecurityConfig((xml: any) => {
      expect(xml).toEqual(originalXml);

      xml.root.element = "modifiedValue1";
    });

    expect(fs.readFile).toHaveBeenCalledWith(
      paths.android.networkSecurityConfig()
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      paths.android.networkSecurityConfig(),
      new XMLBuilder({ ...BUILD_OPTS, format: true }).build(modifiedXml)
    );
  });
});

describe("withStrings", () => {
  it("should parse, modify, and write strings XML file", async () => {
    await withStrings((xml: any) => {
      expect(xml).toEqual(originalXml);

      xml.root.element = "modifiedValue";
    });

    expect(fs.readFile).toHaveBeenCalledWith(paths.android.strings());
    expect(fs.writeFile).toHaveBeenCalledWith(
      paths.android.strings(),
      new XMLBuilder({ ...BUILD_OPTS, format: true }).build(modifiedXml)
    );
  });
});
