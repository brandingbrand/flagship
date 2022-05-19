import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  markerImage: {
    height: 32,
    width: 22,
  },
  markerImageSelected: {
    height: 48,
    width: 32,
  },
  markerImageSelectedWeb: {
    height: 48,
    marginLeft: -16,
    marginTop: -48,
    width: 32,
  },
  markerImageWeb: {
    height: 32,
    marginLeft: -11,
    marginTop: -32,
    width: 22,
  },
});

export type { ImageStyle, RegisteredStyle, TextStyle, ViewStyle } from 'react-native';
