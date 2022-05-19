import React, { Component } from 'react';

import { StyleSheet } from 'react-native';

import { Button } from '../../Button';
import type { ProductItemProps } from '../ProductItem';

export type ProductItemButtonProps = Pick<
  ProductItemProps,
  | 'buttonProps'
  | 'buttonStyle'
  | 'buttonText'
  | 'buttonTextStyle'
  | 'onButtonPress'
  | 'renderButton'
>;

const style = StyleSheet.create({
  button: {
    marginBottom: 10,
    marginTop: 7,
  },
});

export class ProductItemButton extends Component<ProductItemButtonProps> {
  public render(): React.ReactNode {
    const { buttonProps, buttonStyle, buttonText, buttonTextStyle, onButtonPress, renderButton } =
      this.props;

    if (renderButton) {
      return renderButton();
    }

    if (!buttonText || !onButtonPress) {
      return null;
    }

    return (
      <Button
        full
        onPress={onButtonPress}
        style={[style.button, buttonStyle]}
        title={buttonText}
        titleStyle={buttonTextStyle}
        {...buttonProps}
      />
    );
  }
}
