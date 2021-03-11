import { fromPairs, memoize, partition } from 'lodash-es';
import { ImageStyle, StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native';

/**
 * Create a style that will be applied based on a given `condition`
 *
 * @template T The schema of the style to apply based on the `condition`
 * @param {boolean | undefined} condition The condition to determine whether a `style`
 * should be applied oer not
 * @param {T} style The style to apply based on the given condition
 * @param {T} elseStyle The style to apply if the condition is not met
 * @returns {T | {}} If the condition is true then this returns the `style` otherwise
 * an empty object.
 *
 * @example
 * const useStyles = makeStyles(({ props }) => ({
 *   root: conditionalStyle(props?.wide, { flex: 1 })
 * }));
 */
export const conditionalStyle = <T extends object>(
  condition: boolean | undefined,
  style: T,
  elseStyle?: T
): T | {} => (condition ? style : elseStyle ?? {});

/**
 * A host style is a style that depends on it's parent, ie flex.
 * Styles like this HAVE to remain directly under their parent and
 * cannot be wrapped in another element without changing the behavior
 */
const HOST_STYLES = [
  /flex$/,
  /flexShrink/,
  /flexGrow/,
  /Self/,
  /padding/,
  /margin/,
  /position/,
  /top/,
  /left/,
  /right/,
  /bottom/,
  /height/,
  /maxHeight/,
  /width/,
  /maxWidth/
];

/**
 * Extracts the styles that are affected by the parent
 *
 * @param {StyleProp<T>} style the style to extract host styles from
 * @returns {[Partial<T>, Partial<T>]} a tuple with the extracted styles
 *
 * @example
 * ```jsx
 * // self styles = padding, margin, display(flex), flex, flexDirection, etc.
 * const original = (
 *   <View style={self}>
 *     <View class="child" />
 *   </View>
 * );
 *
 * // Extract styles that require being under the direct parent
 * const [host, selfWithoutHost] = extractHostStyles(self);
 *
 * // Extract styles that requiring being above children
 * const [container, selfUpdated] = extractContainerStyles(selfWithoutHost);
 *
 * // Should match the styling of original
 * const enhanced = (
 *   <View style={host}>
 *     <View style={selfUpdated}>
 *       <View style={container}>
 *         <Child />
 *       </View>
 *     </View>
 *   </View>
 * );
 * ```
 */
export const extractHostStyles = <T extends ViewStyle | ImageStyle | TextStyle>(
  style?: StyleProp<T>
) => {
  if (!style) {
    return [{}, {}] as [Partial<T>, Partial<T>];
  }

  const styleSheet = StyleSheet.flatten(style);

  if (Object.keys(styleSheet).length === 0) {
    return [{}, {}] as [Partial<T>, Partial<T>];
  }

  const [hostStylePairs, nonHostStylePairs] = partition(Object.entries(styleSheet), ([style]) =>
    HOST_STYLES.some(hostStyle => hostStyle.test(style))
  );
  const hostStyles = fromPairs(hostStylePairs) as T;
  const nonHostStyles: T | { height?: '100%' } | { width?: '100%' } = {
    ...fromPairs(nonHostStylePairs),
    ...conditionalStyle('height' in hostStyles, { height: '100%' }),
    ...conditionalStyle('width' in hostStyles, { width: '100%' })
  };

  return [hostStyles as Partial<T>, nonHostStyles as Partial<T>] as const;
};

/**
 * A nested style is one that affects it's direct children, ie justify content
 * A style like this cannot have it's children wrapped in another element without
 * changing the behavior.
 */

const CONTAINER_STYLES = [/display/, /Content/, /Items/, /flex(?!$)/];

/**
 * Extracts the styles that affect the direct children
 *
 * @param {StyleProp<T>} style the style to extract nested styles from
 * @returns {[Partial<T>, Partial<T>]} a tuple with the extracted styles
 *
 * @example
 * ```jsx
 * // self styles = padding, margin, display(flex), flex, flexDirection, etc.
 * const original = (
 *   <View style={self}>
 *     <Child />
 *   </View>
 * );
 *
 * // Extract styles that require being under the direct parent
 * const [host, selfWithoutHost] = extractHostStyles(self);
 *
 * // Extract styles that requiring being above children
 * const [container, selfUpdated] = extractContainerStyles(selfWithoutHost);
 *
 * // Should match the styling of original
 * const enhanced = (
 *   <View style={host}>
 *     <View style={selfUpdated}>
 *       <View style={container}>
 *         <Child />
 *       </View>
 *     </View>
 *   </View>
 * );
 * ```
 */
export const extractContainerStyles = <T extends ViewStyle | ImageStyle | TextStyle>(
  style?: StyleProp<T>
) => {
  if (!style) {
    return [{}, {}] as [Partial<T>, Partial<T>];
  }

  const styleSheet = StyleSheet.flatten(style);

  if (Object.keys(styleSheet).length === 0) {
    return [{}, {}] as [Partial<T>, Partial<T>];
  }

  const [nestedStyles, nonNestedStyles] = partition(Object.entries(styleSheet), ([style]) =>
    CONTAINER_STYLES.some(nestedStyle => nestedStyle.test(style))
  );

  return [fromPairs(nestedStyles), fromPairs(nonNestedStyles)] as [Partial<T>, Partial<T>];
};

export const extractSandwichedStyles = <T extends ViewStyle | ImageStyle | TextStyle>(
  style?: StyleProp<T>
) => {
  const [host, updatedStyle] = extractHostStyles(style);
  const [container, self] = extractContainerStyles(updatedStyle);
  return [host, self, container] as [Partial<T>, Partial<T>, Partial<T>];
};

export const extractFont = memoize((textStyles: TextStyle | StyleProp<TextStyle>):
  | string
  | undefined => {
  const styles = StyleSheet.flatten(textStyles);

  return `${styles?.fontWeight ?? '400'} ${
    (styles?.fontSize ?? 16) + (styles?.letterSpacing ?? 0) * 4 + 'px'
  }/${(styles?.lineHeight ?? 1.2 * (styles?.fontSize ?? 16)) + 'px'} ${
    styles?.fontFamily ??
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
  }`;
});
