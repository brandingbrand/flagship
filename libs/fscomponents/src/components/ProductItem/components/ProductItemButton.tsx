import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Button } from '../../Button';
import { ProductItemProps } from '../ProductItem';

export type ProductItemButtonProps = Pick<
  ProductItemProps,
  'buttonText' |
  'buttonStyle' |
  'buttonTextStyle' |
  'buttonProps' |
  'onButtonPress' |
  'renderButton'
>;

const style = StyleSheet.create({
  button: {
    marginTop: 7,
    marginBottom: 10
  }
});

export class ProductItemButton extends Component<ProductItemButtonProps> {
  render(): React.ReactNode {
    const {
      buttonText,
      buttonStyle,
      buttonTextStyle,
      buttonProps,
      onButtonPress,
      renderButton
    } = this.props;

    if (renderButton) {
      return renderButton();
    }

    if (!buttonText || !onButtonPress) {
      return null;
    }

    return (
      <Button
        full
        title={buttonText}
        style={[style.button, buttonStyle]}
        titleStyle={buttonTextStyle}
        onPress={onButtonPress}
        {...buttonProps}
      />
    );
  }
}
