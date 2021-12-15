import { ImageStyle, RegisteredStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
export { RegisteredStyle, ViewStyle, TextStyle, ImageStyle };

const kFlexStart = 'flex-start';

export const style = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  bottomLeft: {
    justifyContent: 'flex-end',
    alignItems: kFlexStart,
  },
  bottomCenter: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bottomRight: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  centerLeft: {
    justifyContent: 'center',
    alignItems: kFlexStart,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerRight: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  topLeft: {
    justifyContent: kFlexStart,
    alignItems: kFlexStart,
  },
  topCenter: {
    justifyContent: kFlexStart,
    alignItems: 'center',
  },
  topRight: {
    justifyContent: kFlexStart,
    alignItems: 'flex-end',
  },
});
