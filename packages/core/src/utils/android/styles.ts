import * as path from "../path";
import { withXml } from "../xml";

import type { StylesType } from "../../types/android";

/**
 * The list of tag names that should be handled as arrays.
 *
 * @type {string[]}
 */
const tagNames = ["style", "item"];

/**
 * Asynchronously reads the Android styles XML file at the specified path and invokes the provided callback function.
 *
 * @async
 * @function
 * @param {function} callback - The callback function to invoke with the parsed XML data.
 * @returns {Promise<void>}
 */
const withStyles = async (callback: (xml: StylesType.Styles) => void) =>
  withXml<StylesType.Styles>(
    path.android.stylesPath(),
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
 * Returns the style object with the specified name.
 *
 * @param {StylesType.Styles} styles - The parsed XML data.
 * @param {string} [name="AppTheme"] - The name of the style.
 * @returns {StylesType.Style | undefined} The style object, or undefined if not found.
 */
const getStyle = (styles: StylesType.Styles, name = "AppTheme") =>
  styles.resources.style.find((it) => it.$.name === name);

/**
 * Sets the specified attributes for the AppTheme style.
 *
 * @param {Partial<StylesType.StyleAttributes>} attributes - The attributes to set.
 * @returns {void}
 */
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

/**
 * Adds the specified elements to the AppTheme style.
 *
 * @param {StylesType.StyleElements} elements - The elements to add.
 * @returns {void}
 */
export const addAppThemeElements = (elements: StylesType.StyleElements) =>
  withStyles((xml) => {
    const style = getStyle(xml);

    if (!style) return;

    elements.item?.forEach((it) =>
      style.item ? style.item.push(it) : (style.item = [it])
    );
  });
