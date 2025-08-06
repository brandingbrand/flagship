import AppRestart from '@brandingbrand/react-native-app-restart';
import React from 'react';
import {StyleSheet, View} from 'react-native';

import {useModal} from '../../lib/context';
import {useDevMenu} from '../../lib/hooks';
import {Button} from '../ui';
import {palette} from '../../lib/theme';

export function DevMenuModalFooter() {
  const {onRestart} = useDevMenu();
  const [, setVisible] = useModal();

  async function onPressRestart() {
    await onRestart?.();
    AppRestart.restartApplication();
  }

  async function onPressClose() {
    setVisible(false);
  }

  return (
    <View style={styles.container}>
      <Button onPress={onPressClose} style={styles.button}>
        Close
      </Button>
      <Button onPress={onPressRestart} style={styles.button}>
        Reload App
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: palette.neutralBorder,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  button: {
    flex: 1,
  },
});
