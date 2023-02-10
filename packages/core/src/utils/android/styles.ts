/* eslint-disable @typescript-eslint/no-unused-vars */

import * as path from "../path";
import { withXml } from "../xml";

import type { StylesType } from "../../types/android";

const tagNames = ["style", "item"];

const withStyles = async (callback: (xml: StylesType.Styles) => void) =>
  withXml<StylesType.Styles>(
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

const getStyle = (styles: StylesType.Styles, name = "AppTheme") =>
  styles.resources.style.find((it) => it.$.name === name);

export const setAppThemeAttributes = (
  attributes: Partial<StylesType.StyleAttributes>
) =>
  withStyles((xml) => {
    const style = getStyle(xml);

    if (!style) return;

    style.$ = {
      ...style?.$,
      ...attributes,
    };
  });

export const addAppThemeElements = (elements: StylesType.StyleElements) =>
  withStyles((xml) => {
    const style = getStyle(xml);

    if (!style) return;

    elements.item?.forEach((it) => style.item?.push(it));
  });
