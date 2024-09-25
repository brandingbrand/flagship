import {Modal, ModalProps, StyleSheet, SafeAreaView} from 'react-native';
import React from 'react';

import {useModal, useScreen} from '../lib/context';

import {DevMenuModalFooter} from './DevMenuModalFooter';
import {DevMenuModalHeader} from './DevMenuModalHeader';
import {DevMenuList} from './DevMenuList';

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
  const [Screen] = useScreen();

  return (
    <Modal {...DEFAULT_MODAL_PROPS} visible={visible}>
      <SafeAreaView style={styles.safeAreaContainer}>
        <DevMenuModalHeader />
        {Screen}
        <DevMenuList />
        <DevMenuModalFooter />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
});
