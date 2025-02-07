import {useMemo} from 'react';

import {resolveColorToken, type ColorToken} from '../lib/theme';

import {useTheme} from './useTheme';

/**
 * Provides the hex color value of the provided {@link ColorToken} for the current theme.
 */
export function useColorTokens(token: ColorToken): string;
/**
 * Maps the provided array of {@link ColorToken}s to hex color values for the current theme.
 */
export function useColorTokens<const TokenT extends ColorToken[]>(
  token: [...TokenT],
): {[I in keyof TokenT]: string};
export function useColorTokens<const TokenT extends ColorToken[]>(
  token: ColorToken | [...TokenT],
): string | {[I in keyof TokenT]: string} {
  const theme = useTheme();
  return Array.isArray(token)
    ? (token.map(it => resolveColorToken(it, theme)) as {
        [I in keyof TokenT]: string;
      })
    : resolveColorToken(token, theme);
}

type KeyedColor<KT extends string> = {[k in KT]: {[key in k]: string}}[KT];
/**
 * Creates a style object with the color value associated with the provided {@link token} assigned to the provided {@link styleKey}
 */
export function useColorTokenStyle<const KT extends string>(
  token: ColorToken,
  styleKey: KT,
): KeyedColor<KT> {
  const theme = useTheme();

  return useMemo(() => {
    return {
      [styleKey]: resolveColorToken(token, theme),
    } as KeyedColor<KT>;
  }, [theme, token, styleKey]);
}
