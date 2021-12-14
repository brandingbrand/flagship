import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { Button, ButtonProps } from './Button';
import { ModalHalfScreen, ModalHalfScreenProps } from './ModalHalfScreen';

const closeIcon = require('../../assets/images/iconClose.png');
const styles = StyleSheet.create({
  button: {
    margin: 5
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  modalTitle: {
    flexGrow: 1,
    textAlign: 'center',
    fontSize: 16,
    paddingVertical: 22
  },
  closeBtn: {
    position: 'absolute',
    right: 5
  },
  closeIcon: {
    margin: 10,
    width: 12,
    height: 12
  }
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
  showMoreButtonProps?: Omit<ButtonProps, 'title' | 'onPress'>;
  containerStyle?: ViewStyle;
  modalContainerStyle?: ViewStyle;
  modalTitle?: string;
  modalTitleStyle?: TextStyle;
  modalProps?: Omit<ModalHalfScreenProps, 'visible' | 'onRequestClose'>;
}

export const NestingButtons: React.FC<NestingButtonsProps> = React.memo(props => {
  const [modalVisible, setModalVisibile] = useState<boolean>(false);
  const toggleModal = () => setModalVisibile(!modalVisible);
  const {
    buttonsProps,
    showMoreTitle,
    showMoreButtonProps,
    modalProps,
    containerStyle,
    maxCount = 3,
    modalTitle,
    modalTitleStyle,
    modalContainerStyle
  } = props;

  const buttons = buttonsProps.map((buttonProps, index) => (
    <Button
      key={index}
      {...buttonProps}
      style={[styles.button, buttonProps.style]}
    />
  ));

  if (buttons.length <= maxCount) {
    return (
      <View style={containerStyle}>
        {buttons}
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <Button
        {...showMoreButtonProps}
        onPress={toggleModal}
        title={showMoreTitle}
        style={[styles.button, showMoreButtonProps?.style]}
      />
      <ModalHalfScreen
        visible={modalVisible}
        onRequestClose={toggleModal}
        {...modalProps}
      >
        <ScrollView style={modalContainerStyle}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, modalTitleStyle]}>
              {modalTitle}
            </Text>
            <TouchableOpacity
              onPress={toggleModal}
              style={styles.closeBtn}
            >
              <Image
                source={closeIcon}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
          </View>
          {buttons}
        </ScrollView>
      </ModalHalfScreen>
    </View>
  );
});
