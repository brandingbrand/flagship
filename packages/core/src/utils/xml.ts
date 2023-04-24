import { X2jOptionsOptional, XMLBuilder, XMLParser } from "fast-xml-parser";

import fs from "./fs";

const OPTS = {
  ignoreAttributes: false,
  attributeNamePrefix: "",
  attributesGroupName: "$",
  textNodeName: "_",
};

const BUILD_OPTS = {
  ...OPTS,
  format: true,
  indentBy: "    ",
  suppressBooleanAttributes: false,
  suppressEmptyNode: true,
};

/**
 * Parses XML file, performs given callback with parsed data,
 * and writes the updated XML data back to the file.
 * @template T
 * @param {string} path - Path of the XML file to be parsed.
 * @param {X2jOptionsOptional} options - Options for XML parser.
 * @param {(xml: T) => void} callback - Callback to be performed with parsed data.
 * @returns {Promise<void>} Promise that resolves after writing updated XML to the file.
 */
export const withXml = async <T>(
  path: string,
  options: X2jOptionsOptional,
  callback: (xml: T) => void
) => {
  const contents = await fs.promises.readFile(path);
  const xml = new XMLParser({
    ...OPTS,
    ...options,
  }).parse(contents);

  callback(xml);

  await fs.promises.writeFile(path, new XMLBuilder(BUILD_OPTS).build(xml));
};
