import * as path from "../path";
import { withXml } from "../xml";

import type { StringsType } from "../../types/android";

/**
 * The list of tag names that should be handled as arrays.
 *
 * @type {string[]}
 */
const tagNames = ["string", "string-array", "item", "plurals"];

/**
 * Wraps the XML object with a withXml function call.
 *
 * @param callback - The callback function to call with the XML object.
 */
const withStrings = async (callback: (xml: StringsType.Strings) => void) =>
  withXml<StringsType.Strings>(
    path.android.stringsPath(),
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

/**
 * Gets a string array element by name.
 *
 * @param strings - The StringsType.Strings object to search in.
 * @param name - The name of the string array element.
 * @returns The matching string array element or null.
 */
const getStringArray = (strings: StringsType.Strings, name: string) =>
  strings.resources["string-array"]?.find((it) => it.$.name === name);

/**
 * Gets a plurals element by name.
 *
 * @param strings - The StringsType.Strings object to search in.
 * @param name - The name of the plurals element.
 * @returns The matching plurals element or null.
 */
const getPlurals = (strings: StringsType.Strings, name: string) =>
  strings.resources.plurals?.find((it) => it.$.name === name);

/**
 * Adds new resources elements to the XML object.
 *
 * @param elements - The elements to add to the XML object.
 */
export const addResourcesElements = (elements: StringsType.StringsElements) =>
  withStrings((xml) => {
    elements.plurals?.forEach((it) =>
      xml.resources.plurals
        ? xml.resources.plurals.push(it)
        : (xml.resources.plurals = [it])
    );

    elements.string?.forEach((it) =>
      xml.resources.string
        ? xml.resources.string.push(it)
        : (xml.resources.string = [it])
    );

    elements["string-array"]?.forEach((it) =>
      xml.resources["string-array"]
        ? xml.resources["string-array"].push(it)
        : (xml.resources["string-array"] = [it])
    );
  });

/**
 * Adds new items to an existing string array element.
 *
 * @param elements - The elements to add to the string array element.
 * @param name - The name of the string array element.
 */
export const addStringArrayElements = (
  elements: StringsType.StringArrayElements,
  name: string
) =>
  withStrings((xml) => {
    const stringArray = getStringArray(xml, name);

    if (!stringArray) return;

    elements.item.forEach((it) =>
      stringArray.item ? stringArray.item.push(it) : (stringArray.item = [it])
    );
  });

/**
 * Adds new items to an existing plurals element.
 *
 * @param elements - The elements to add to the plurals element.
 * @param name - The name of the plurals element.
 */
export const addPluralsElements = (
  elements: StringsType.PluralsElements,
  name: string
) =>
  withStrings((xml) => {
    const plurals = getPlurals(xml, name);

    if (!plurals) return;

    elements.item.forEach((it) =>
      plurals.item ? plurals.item.push(it) : (plurals.item = [it])
    );
  });
