/* eslint-disable @typescript-eslint/no-unused-vars */

import * as path from "../path";
import { withXml } from "../xml";

import type {
  Styles,
  StyleAttributes,
  StyleElements,
} from "../../types/android";

const tagNames = ["style", "item"];

const withStyles = async (callback: (xml: Styles) => void) =>
  withXml<Styles>(
    path.android.stylesPath(),
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

const getStyle = (styles: Styles, name = "AppTheme") =>
  styles.resources.style.find((it) => it.$.name === name);

export const setAppThemeAttributes = (attributes: Partial<StyleAttributes>) =>
  withStyles((xml) => {
    const style = getStyle(xml);

    if (!style) return;

    style.$ = {
      ...style?.$,
      ...attributes,
    };
  });

export const addAppThemeElements = (elements: StyleElements) =>
  withStyles((xml) => {
    const style = getStyle(xml);

    if (!style) return;

    elements.item?.forEach((it) => style.item?.push(it));
  });
