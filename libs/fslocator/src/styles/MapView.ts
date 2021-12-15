import { ImageStyle, RegisteredStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

export { RegisteredStyle, ViewStyle, TextStyle, ImageStyle };

export const style = StyleSheet.create({
  markerImage: {
    width: 22,
    height: 32,
  },
  markerImageSelected: {
    width: 32,
    height: 48,
  },
  markerImageWeb: {
    width: 22,
    height: 32,
    marginLeft: -11,
    marginTop: -32,
  },
  markerImageSelectedWeb: {
    width: 32,
    height: 48,
    marginLeft: -16,
    marginTop: -48,
  },
});
