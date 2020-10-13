import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { Button, ButtonProps } from './Button';
import { ModalHalfScreen, ModalHalfScreenProps } from './ModalHalfScreen';

const styles = StyleSheet.create({
  button: {
    margin: 5
  }
});

export interface NestingButtonsProps {
  showMoreTitle: string;
  buttonsProps: ButtonProps[];
  maxCount?: number;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
  showMoreButtonProps?: ButtonProps;
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
    style,
    maxCount = 3
  } = props;

  const buttons = buttonsProps.map((buttonProps, index) => (
    <Button
      key={index}
      {...buttonProps}
      style={[styles.button, buttonProps.style]}
    />
  ));

  const buttonsContainer = (
    <View style={style}>
      {buttons}
    </View>
  );

  if (buttons.length <= maxCount) {
    return buttonsContainer;
  }

  return (
    <View style={containerStyle}>
      <Button
        title={showMoreTitle}
        onPress={toggleModal}
        {...showMoreButtonProps}
        style={[styles.button, showMoreButtonProps?.style]}
      />
      <ModalHalfScreen
        visible={modalVisible}
        onRequestClose={toggleModal}
        {...modalProps}
      >
        <ScrollView>
          {buttonsContainer}
        </ScrollView>
      </ModalHalfScreen>
    </View>
  );
});
