import { X2jOptionsOptional, XMLBuilder, XMLParser } from "fast-xml-parser";

import fs from "./fs";

const OPTS = {
  ignoreAttributes: false,
  attributeNamePrefix: "",
  attributesGroupName: "$",
};

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

  await fs.promises.writeFile(
    path,
    new XMLBuilder({
      ...OPTS,
      format: true,
      indentBy: "    ",
      suppressBooleanAttributes: false,
      suppressUnpairedNode: false,
      suppressEmptyNode: false,
    }).build(xml)
  );
};
