import React, { FunctionComponent, memo } from 'react';
import { ImageSourcePropType, StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';
import { Button, ButtonProps } from './Button';
import { Omit } from '@brandingbrand/fsfoundation';
import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';
const componentTranslationKeys = translationKeys.flagship.payPalButton;

type LimitedButtonProps = Omit<ButtonProps, 'color' | 'light' | 'link' | 'palette'>;
export type ButtonShape = 'pill' | 'rect';
export type ButtonTheme = 'gold' | 'blue' | 'silver' | 'black';

export interface SerializablePayPalCheckoutButtonProps extends LimitedButtonProps {
  shape: ButtonShape;
  theme: ButtonTheme;
  tagLine?: string;
  tagLineStyle?: TextStyle;
}

export interface PayPalCheckoutButtonProps extends LimitedButtonProps, Omit<
  SerializablePayPalCheckoutButtonProps,
  'tagLineStyle'
  > {
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
  },
  icon: {
    width: 99,
    height: 24
  }
});

export const PayPalCheckoutButton: FunctionComponent<PayPalCheckoutButtonProps> =
memo((props): JSX.Element => {

  const defaultProps: DefaultProps = {
    shape: 'rect',
    theme: 'gold',
    title: FSI18n.string(componentTranslationKeys.defaultTitle),
    tagLine: FSI18n.string(componentTranslationKeys.defaultTagLine)
  };

  const {
    shape,
    style,
    tagLine,
    tagLineStyle,
    titleStyle,
    title,
    theme
  } = props;

  const shapeVal = shape ? shape : defaultProps.shape;
  const themeVal = theme ? theme : defaultProps.theme;
  const titleVal = title ? title : defaultProps.title;
  const tagLineVal = tagLine ? tagLine : defaultProps.tagLine;

  const selectedTheme = themes[themeVal];

  const buttonProps = {
    ...props,
    titleStyle: StyleSheet.flatten([
      styles.buttonTitle,
      { color: selectedTheme.text },
      titleStyle
    ]),
    style: StyleSheet.flatten([
      {
        backgroundColor: selectedTheme.bg,
        borderRadius: shapeVal === 'rect' ? 3 : 23
      },
      style
    ])
  };

  return (
    <View style={{ paddingVertical: 10 }}>
      <Button
        {...buttonProps}
        title={titleVal}
        icon={selectedTheme.icon}
        iconStyle={styles.icon}
        underlayColor={selectedTheme.bgActive}
      />
      {!!tagLineVal && (
        <Text style={[styles.tagLine, tagLineStyle]}>
          {tagLineVal}
        </Text>
      )}
    </View>
  );
});
