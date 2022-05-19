import React, { useState } from 'react';

import type { TextStyle, ViewStyle } from 'react-native';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import closeIcon from '../../assets/images/iconClose.png';

import type { ButtonProps } from './Button';
import { Button } from './Button';
import type { ModalHalfScreenProps } from './ModalHalfScreen';
import { ModalHalfScreen } from './ModalHalfScreen';

const styles = StyleSheet.create({
  button: {
    margin: 5,
  },
  closeBtn: {
    position: 'absolute',
    right: 5,
  },
  closeIcon: {
    height: 12,
    margin: 10,
    width: 12,
  },
  modalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  modalTitle: {
    flexGrow: 1,
    fontSize: 16,
    paddingVertical: 22,
    textAlign: 'center',
  },
});

export interface NestingButtonsProps {
  showMoreTitle: string;
  buttonsProps: ButtonProps[];
  /**
   * Inclusive maximum number of buttons to be displayed before collapsing.
   *
   * @default 3
   */
  maxCount?: number;
  showMoreButtonProps?: Omit<ButtonProps, 'onPress' | 'title'>;
  containerStyle?: ViewStyle;
  modalContainerStyle?: ViewStyle;
  modalTitle?: string;
  modalTitleStyle?: TextStyle;
  modalProps?: Omit<ModalHalfScreenProps, 'onRequestClose' | 'visible'>;
}

export const NestingButtons: React.FC<NestingButtonsProps> = React.memo((props) => {
  const [modalVisible, setModalVisibile] = useState<boolean>(false);
  const toggleModal = () => {
    setModalVisibile(!modalVisible);
  };
  const {
    buttonsProps,
    containerStyle,
    maxCount = 3,
    modalContainerStyle,
    modalProps,
    modalTitle,
    modalTitleStyle,
    showMoreButtonProps,
    showMoreTitle,
  } = props;

  const buttons = buttonsProps.map((buttonProps, index) => (
    <Button key={index} {...buttonProps} style={[styles.button, buttonProps.style]} />
  ));

  if (buttons.length <= maxCount) {
    return <View style={containerStyle}>{buttons}</View>;
  }

  return (
    <View style={containerStyle}>
      <Button
        {...showMoreButtonProps}
        onPress={toggleModal}
        style={[styles.button, showMoreButtonProps?.style]}
        title={showMoreTitle}
      />
      <ModalHalfScreen onRequestClose={toggleModal} visible={modalVisible} {...modalProps}>
        <ScrollView style={modalContainerStyle}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, modalTitleStyle]}>{modalTitle}</Text>
            <TouchableOpacity onPress={toggleModal} style={styles.closeBtn}>
              <Image source={closeIcon} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>
          {buttons}
        </ScrollView>
      </ModalHalfScreen>
    </View>
  );
});
