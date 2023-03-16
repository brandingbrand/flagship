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
