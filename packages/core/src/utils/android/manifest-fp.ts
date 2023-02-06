/* eslint-disable @typescript-eslint/no-unused-vars */

import * as path from "../path";
import { withXml } from "../xml-fp";

import type {
  AndroidManifest,
  AndroidManifestAttributes,
} from "../../types/manifest";

const arr = [
  "intent-filter",
  "action",
  "data",
  "category",
  "activity",
  "service",
  "receiver",
  "meta-data",
  "uses-library",
  "permission",
  "uses-permission",
  "uses-permission-sdk-23",
  "uses-feature",
  "application",
];

const withManifest = async (
  callback: (xml: AndroidManifest) => AndroidManifest
) =>
  withXml<AndroidManifest>(
    path.android.manifestPath(),
    {
      isArray: (_tagName, jPath, _isLeafNode, _isAttribute) => {
        if (arr.indexOf(jPath) !== -1) {
          return true;
        }

        return false;
      },
    },
    callback
  );

export const setManifestAttributes = async (
  attributes: AndroidManifestAttributes
) =>
  withManifest((xml) => {
    xml.manifest.$ = {
      ...xml.manifest.$,
      ...attributes,
    };

    return xml;
  });
