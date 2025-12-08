import {
  Appearance,
  ImageStyle,
  TextStyle,
  ViewStyle,
  useColorScheme,
} from 'react-native';

const darkPalette = {
  bg: '#000',
  bgSecondary: '#121212',
  fg: '#FFF',
  fgSecondary: '#AAA',
};
const lightPalette = {
  bg: '#FFF',
  bgSecondary: '#F3F3F3',
  fg: '#000',
  fgSecondary: '#444',
};

type NamedStyles<T> = {[P in keyof T]: ViewStyle | TextStyle | ImageStyle};
type AppTheme = 'light' | 'dark';
type Palette = typeof darkPalette & typeof lightPalette;

const palettes = {
  dark: darkPalette,
  light: lightPalette,
} satisfies Record<AppTheme, Palette>;

export function useTheme(): AppTheme {
  return useColorScheme() ?? ('light' as AppTheme);
}
export function createStyleSheet<T extends NamedStyles<T> | NamedStyles<any>>(
  styles: (theme: Palette) => T,
): () => T;
export function createStyleSheet<T extends NamedStyles<T> | NamedStyles<any>>(
  styles: T,
): T;
export function createStyleSheet<T extends NamedStyles<T> | NamedStyles<any>>(
  styles: T | ((theme: Palette) => T),
): T | (() => T) {
  if (typeof styles === 'function') {
    let lastTheme = Appearance.getColorScheme() as AppTheme;
    let cache =
      typeof styles === 'function' ? styles(palettes[lastTheme]) : styles;

    return () => {
      const theme = useTheme();
      if (theme !== lastTheme) {
        cache = styles(palettes[theme]);
        lastTheme = theme;
      }

      return cache;
    };
  }

  return styles;
}
