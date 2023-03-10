/* eslint-disable @typescript-eslint/no-unused-vars */

import * as path from "../path";
import { withXml } from "../xml";

import type { ColorsType } from "../../types/android";

const tagNames = ["color"];

const withColors = async (callback: (xml: ColorsType.Colors) => void) =>
  withXml<ColorsType.Colors>(
    path.android.colorsPath(),
    {
      isArray: (tagName, _jPath, _isLeafNode, _isAttribute) => {
        if (tagNames.indexOf(tagName) !== -1) {
          return true;
        }

        return false;
      },
    },
    callback
  );

export const addColor = async (name: string, hex: string) =>
  withColors((xml) => {
    if (typeof xml.resources === "string") {
      xml.resources = {
        color: [{ $: { name }, _: hex }],
      };
    } else {
      xml.resources.color
        ? xml.resources.color.push({ $: { name }, _: hex })
        : (xml.resources.color = [{ $: { name }, _: hex }]);
    }
  });
