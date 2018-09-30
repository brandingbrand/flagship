import React, { Component } from 'react';
import { ImageSourcePropType, StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';
import { Button, ButtonProps } from './Button';
import { Omit } from '@brandingbrand/fsfoundation';

type LimitedButtonProps = Omit<ButtonProps, 'color' | 'light' | 'link' | 'palette'>;

export interface PayPalCheckoutButtonProps extends LimitedButtonProps {
  shape: 'pill' | 'rect';
  theme: 'gold' | 'blue' | 'silver' | 'black';
  tagLine?: string;
  tagLineStyle?: StyleProp<TextStyle>;
}
type DefaultProps = Pick<PayPalCheckoutButtonProps, 'shape' | 'theme' | 'title' | 'tagLine'>;

const blueLogo: ImageSourcePropType = require('../../assets/images/paypal-logo-blue.png');
const whiteLogo: ImageSourcePropType = require('../../assets/images/paypal-logo-white.png');

const themes = {
  gold: {
    bg: '#ffc439',
    bgActive: '#f2bb43',
    text: '#111111',
    icon: blueLogo
  },
  blue: {
    bg: '#009cde',
    bgActive: '#37afe3',
    text: 'white',
    icon: whiteLogo
  },
  silver: {
    bg: '#eeeeee',
    bgActive: '#e2e2e2',
    text: '#111111',
    icon: blueLogo
  },
  black: {
    bg: '#2C2E2F',
    bgActive: '#565859',
    text: 'white',
    icon: whiteLogo
  }
};

const styles = StyleSheet.create({
  buttonTitle: {
    fontWeight: 'bold',
    lineHeight: 24
  },
  tagLine: {
    textAlign: 'center'
  }
});

export class PayPalCheckoutButton extends Component<PayPalCheckoutButtonProps> {
  static defaultProps: DefaultProps = {
    shape: 'rect',
    theme: 'gold',
    title: 'Checkout',
    tagLine: 'The safer, easier way to pay'
  };

  render(): JSX.Element {
    const {
      shape,
      style,
      tagLine,
      tagLineStyle,
      titleStyle,
      theme
    } = this.props;
    const selectedTheme = themes[theme];

    const buttonProps = {
      ...this.props,
      titleStyle: StyleSheet.flatten([
        styles.buttonTitle,
        { color: selectedTheme.text },
        titleStyle
      ]),
      style: StyleSheet.flatten([
        {
          backgroundColor: selectedTheme.bg,
          borderRadius: shape === 'rect' ? 3 : 23
        },
        style
      ])
    };

    return (
      <View style={{paddingVertical: 10}}>
        <Button
          icon={selectedTheme.icon}
          underlayColor={selectedTheme.bgActive}
          {...buttonProps}
        />
        {!!tagLine && (
          <Text style={[styles.tagLine, tagLineStyle]}>
            {tagLine}
          </Text>
        )}
      </View>
    );
  }
}
