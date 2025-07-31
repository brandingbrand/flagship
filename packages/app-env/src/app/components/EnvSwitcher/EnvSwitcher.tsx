import React from 'react';
import {StyleSheet, View} from 'react-native';

import {EnvSwitcherProvider} from '../../lib/context';
import {defineDevMenuScreen} from '../../lib/define-screen';
import {envs} from '../../lib/env';

import {EnvSwitcherContentPreview} from './EnvSwitcherContentPreview';
import {EnvSwitcherList} from './EnvSwitcherList';
import {SetEnvironmentButton} from './SetEnvironmentButton';

export const EnvSwitcher = defineDevMenuScreen(
  'Env Switcher',
  function EnvSwitcher() {
    return (
      <EnvSwitcherProvider>
        <EnvSwitcherList environments={Object.keys(envs)} />
        <View style={styles.container}>
          <EnvSwitcherContentPreview />
          <View style={styles.buttonContainer}>
            <SetEnvironmentButton />
          </View>
        </View>
      </EnvSwitcherProvider>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
