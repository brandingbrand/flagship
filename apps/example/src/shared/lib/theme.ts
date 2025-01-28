import * as darkPalette from './__tokens__/dark';
import * as lightPalette from './__tokens__/light';

export type AppTheme = 'light' | 'dark';
export type Themeable<T> = Record<AppTheme, T>;

export type Palette = typeof lightPalette & typeof darkPalette;
export type ColorTokenKey = keyof Palette;
export type ColorToken = ColorTokenKey | Themeable<ColorTokenKey>;

/**
 * NOTE: Direct usage of `palette` in UI code is discouraged. Avoid exporting this.
 * Prefer using the current theme palette via `createStyleSheet`/`useStyles`, or `variant()`.
 * If single color values are required outside of a stylesheet, use `useColorToken` or `useColorTokenStyle`.
 */
const palette = {
  light: lightPalette,
  dark: darkPalette,
} as const satisfies Themeable<Palette>;

/**
 * An object containing a light and dark theme color value.
 * This is primarily a stand-in for react-native-navigation's internal "ThemeColor" type, as it is not exported.
 */
export type ThemeColor = Themeable<string>;

/**
 * Get the {@link ThemeColor} for a provided {@link ColorTokenKey}.
 */
export function getThemeColor(token: ColorTokenKey): ThemeColor {
  return {
    light: lightPalette[token],
    dark: darkPalette[token],
  } as const;
}

/**
 * Get the color value of a {@link ColorToken} for the provided {@link AppTheme}.
 */
export const resolveColorToken = (
  token: ColorToken,
  theme: AppTheme,
): string => {
  const themePalette = palette[theme];
  const tokenKey = typeof token === 'string' ? token : token[theme];

  return themePalette[tokenKey];
};

export type PaletteFunction<RT> = (palette: Palette) => RT;
/**
 * Apply the {@link Palette} for the provided {@link AppTheme} to the provided {@link PaletteFunction}.
 */
export const resolvePaletteFunction = <RT>(
  func: PaletteFunction<RT>,
  theme: AppTheme,
) => func(palette[theme]);
