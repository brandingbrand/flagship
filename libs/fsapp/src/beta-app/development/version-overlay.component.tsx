import React, { FC, useMemo } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { useApp } from '../app/context';
import { useModals } from '../modal';

import { shouldShowDevMenu } from './utils';
import { DevMenu } from './dev-menu.component';
import { styles } from './version-overlay.styles';

const Version: FC = () => {
  const app = useApp();
  const modals = useModals();

  const openDevMenu = () => {
    modals.showModal(DevMenu).catch(() => undefined);
  };

  return (
    <TouchableOpacity
      accessible={true}
      accessibilityLabel={'development menu'}
      style={styles.devNoteContainer}
      onPress={openDevMenu}
    >
      <Text style={styles.devNote}>{app?.version}</Text>
    </TouchableOpacity>
  );
};

export const VersionOverlay: FC = ({ children }) => {
  const showDevMenu = useMemo(shouldShowDevMenu, []);

  if (!showDevMenu) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <Version />
    </>
  );
};
