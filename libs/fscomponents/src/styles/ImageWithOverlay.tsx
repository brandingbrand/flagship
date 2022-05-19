import { StyleSheet } from 'react-native';

const kFlexStart = 'flex-start';

export const style = StyleSheet.create({
  bottomCenter: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bottomLeft: {
    alignItems: kFlexStart,
    justifyContent: 'flex-end',
  },
  bottomRight: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLeft: {
    alignItems: kFlexStart,
    justifyContent: 'center',
  },
  centerRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  overlayContainer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  topCenter: {
    alignItems: 'center',
    justifyContent: kFlexStart,
  },
  topLeft: {
    alignItems: kFlexStart,
    justifyContent: kFlexStart,
  },
  topRight: {
    alignItems: 'flex-end',
    justifyContent: kFlexStart,
  },
});

export type { ImageStyle, RegisteredStyle, TextStyle, ViewStyle } from 'react-native';
