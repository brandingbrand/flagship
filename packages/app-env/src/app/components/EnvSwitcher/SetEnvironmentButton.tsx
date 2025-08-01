import AppRestart from '@brandingbrand/react-native-app-restart';
import React from 'react';

import {useEnvSwitcher} from '../../lib/context';
import {envName, setEnv} from '../../lib/env';
import {useDevMenu} from '../../lib/hooks';
import {Button} from '../ui';

export function SetEnvironmentButton() {
  const {onEnvChange} = useDevMenu();
  const [env] = useEnvSwitcher();
  const isActiveSelected = env === envName;

  async function handleSetEnv() {
    if (isActiveSelected) {
      return;
    }
    await onEnvChange?.(env);
    setEnv(env);
    AppRestart.restartApplication();
  }

  return (
    <Button
      disabled={isActiveSelected}
      type={isActiveSelected ? 'primaryDisabled' : 'primary'}
      onPress={handleSetEnv}>
      {isActiveSelected ? 'Current Environment' : `Set Environment`}
    </Button>
  );
}
