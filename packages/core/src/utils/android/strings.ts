/* eslint-disable @typescript-eslint/no-unused-vars */

import * as path from "../path";
import { withXml } from "../xml";

import type { StringsType } from "../../types/android";

const tagNames = ["string", "string-array", "item", "plurals"];

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

const getStringArray = (strings: StringsType.Strings, name: string) =>
  strings.resources["string-array"]?.find((it) => it.$.name === name);

const getPlurals = (strings: StringsType.Strings, name: string) =>
  strings.resources.plurals?.find((it) => it.$.name === name);

export const addResourcesElements = (elements: StringsType.StringsElements) =>
  withStrings((xml) => {
    elements.plurals?.forEach((it) => xml.resources.plurals?.push(it));

    elements.string?.forEach((it) => xml.resources.string?.push(it));

    elements["string-array"]?.forEach((it) =>
      xml.resources["string-array"]?.push(it)
    );
  });

export const addStringArrayElements = (
  elements: StringsType.StringArrayElements,
  name: string
) =>
  withStrings((xml) => {
    const stringArray = getStringArray(xml, name);

    elements.item.forEach((it) => stringArray?.item.push(it));
  });

export const addPluralsElements = (
  elements: StringsType.PluralsElements,
  name: string
) =>
  withStrings((xml) => {
    const plurals = getPlurals(xml, name);

    elements.item.forEach((it) => plurals?.item.push(it));
  });
