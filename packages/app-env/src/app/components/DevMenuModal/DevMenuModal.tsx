import React from 'react';
import {Modal, ModalProps, StyleSheet} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

import {useModal, useScreen} from '../../lib/context';

import {DevMenuList} from './DevMenuList';
import {DevMenuModalFooter} from './DevMenuModalFooter';
import {DevMenuModalHeader} from './DevMenuModalHeader';

const DEFAULT_MODAL_PROPS: ModalProps = {
  /**
   * slides in from the bottom
   *
   * @link {https://reactnative.dev/docs/modal#animationtype}
   */
  animationType: 'slide',

  /**
   * covers the screen completely
   *
   * @link {https://reactnative.dev/docs/modal#presentationstyle-ios}
   */
  presentationStyle: 'fullScreen',
};

export function DevMenuModal() {
  const [visible] = useModal();
  const [activeScreen] = useScreen();

  return (
    <Modal {...DEFAULT_MODAL_PROPS} visible={visible}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeAreaContainer}>
          <DevMenuModalHeader />
          {activeScreen ? <activeScreen.Component /> : null}
          <DevMenuList />
          <DevMenuModalFooter />
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
});
