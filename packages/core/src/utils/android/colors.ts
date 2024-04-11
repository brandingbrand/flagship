import * as path from "../path";
import { withXml } from "../xml";

import type { ColorsType } from "../../types/android";

/**
 * The list of tag names that should be handled as arrays.
 *
 * @type {string[]}
 */
const tagNames = ["color"];

/**
 * Applies the specified `callback` function to the `Colors` object in `colors.xml` file.
 *
 * @param {(xml: ColorsType.Colors) => void} callback - The function to apply to the `Colors` object.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
const withColors = async (callback: (xml: ColorsType.Colors) => void) =>
  withXml<ColorsType.Colors>(
    path.android.colorsPath(),
    {
      isArray: (
        tagName: string,
        _jPath: any,
        _isLeafNode: any,
        _isAttribute: any
      ) => {
        if (tagNames.indexOf(tagName) !== -1) {
          return true;
        }

        return false;
      },
    },
    callback
  );

/**
 * Adds a new color with the specified `name` and `hex` value to the `colors.xml` file.
 *
 * @param {string} name - The name of the color to add.
 * @param {string} hex - The hex value of the color to add.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
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
