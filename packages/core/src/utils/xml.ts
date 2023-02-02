import { XMLParser, X2jOptionsOptional } from "fast-xml-parser";

import fs from "./fs";
import type { Config } from "../types/types";
import * as logger from "./logger";

export abstract class Xml<T> {
  config: Config;
  filePath: string;
  xml: T;

  constructor(config: Config, filePath: string, options: X2jOptionsOptional) {
    this.config = config;
    this.filePath = filePath;

    this.xml = new XMLParser({
      ...options,
      ignoreAttributes: false,
      attributesGroupName: "$",
      isArray: (tagName, jPath, isLeafNode, isAttribute) => {
        if (!isAttribute) return true;

        return false;
      },
    }).parse(fs.readFileSync(filePath));
  }

  async write() {
    await fs
      .writeFile(this.filePath, this.xml)
      .catch((e) => logger.logError(e));
  }
}
