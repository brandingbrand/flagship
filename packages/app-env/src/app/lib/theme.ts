import {Platform} from 'react-native';

export const palette = {
  neutralBg: '#FFFFFF',
  neutralBgStrong: '#f0f1f3',
  neutralFg: '#14161b',
  neutralFgSecondary: 'rgba(42, 46, 55, 0.75)',
  neutralBorder: '#d0d3d9',
  overlayBg: 'rgba(0,0,0,0.36)',
  overlayFg: '#FFFFFF',
  brandBg: '#14161b',
  brandBgWeakest: '#EDEDED',
  brandFg: '#EDEDED',
} as const;

export const font = {
  monospace: Platform.select({
    ios: 'Courier New',
    default: 'monospace',
  }),
};
