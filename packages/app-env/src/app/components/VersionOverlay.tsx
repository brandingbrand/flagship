import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import {useModal} from '../lib/context';
import {appVersion, buildNumber, envName} from '../lib/env';
import {palette} from '../lib/theme';

import {Text} from './ui';

export type VersionOverlayLocationKind =
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight';

export type VersionOverlayProps = {
  location?: VersionOverlayLocationKind;
  style?: StyleProp<ViewStyle>;
};

export function VersionOverlay({
  location = 'bottomRight',
  style,
}: VersionOverlayProps) {
  const [_, setVisible] = useModal();

  function onPress() {
    setVisible(true);
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, locationStyles[location], style]}>
      <Text type="overlay">{envName}</Text>
      <Text type="overlay">{`v${appVersion} (${buildNumber})`}</Text>
    </TouchableOpacity>
  );
}
const locationStyles = StyleSheet.create({
  topLeft: {
    top: 0,
    left: 0,
  },
  topRight: {
    top: 0,
    right: 0,
  },
  bottomLeft: {
    left: 0,
    bottom: 0,
  },
  bottomRight: {
    right: 0,
    bottom: 0,
  },
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: palette.overlayBg,
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'flex-start',
  },
});
