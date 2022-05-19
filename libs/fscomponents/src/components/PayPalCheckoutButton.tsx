import type { FunctionComponent } from 'react';
import React, { memo } from 'react';

import type { StyleProp, TextStyle } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';

import FSI18n, { translationKeys } from '@brandingbrand/fsi18n';

import blueLogo from '../../assets/images/paypal-logo-blue.png';
import whiteLogo from '../../assets/images/paypal-logo-white.png';

import { Button } from './Button';
import type { ButtonProps, SerializableFSButtonProps } from './Button';

const componentTranslationKeys = translationKeys.flagship.payPalButton;

type LimitedButtonProps = Omit<ButtonProps, 'color' | 'light' | 'link' | 'palette'>;
type SerializableLimitedButtonProps = Omit<
  SerializableFSButtonProps,
  'color' | 'light' | 'link' | 'palette'
>;
export type ButtonShape = 'pill' | 'rect';
export type ButtonTheme = 'black' | 'blue' | 'gold' | 'silver';

interface SharedInterface {
  shape: ButtonShape;
  theme: ButtonTheme;
  tagLine?: string;
}

export interface PayPalCheckoutButtonProps extends SharedInterface, LimitedButtonProps {
  tagLineStyle?: StyleProp<TextStyle>;
}

export interface SerializablePayPalCheckoutButtonProps
  extends SharedInterface,
    SerializableLimitedButtonProps {
  tagLineStyle?: TextStyle;
}

type DefaultProps = Pick<PayPalCheckoutButtonProps, 'shape' | 'tagLine' | 'theme' | 'title'>;

const themes = {
  gold: {
    bg: '#ffc439',
    bgActive: '#f2bb43',
    text: '#111111',
    icon: blueLogo,
  },
  blue: {
    bg: '#009cde',
    bgActive: '#37afe3',
    text: 'white',
    icon: whiteLogo,
  },
  silver: {
    bg: '#eeeeee',
    bgActive: '#e2e2e2',
    text: '#111111',
    icon: blueLogo,
  },
  black: {
    bg: '#2C2E2F',
    bgActive: '#565859',
    text: 'white',
    icon: whiteLogo,
  },
};

const styles = StyleSheet.create({
  buttonTitle: {
    fontWeight: 'bold',
    lineHeight: 24,
  },
  icon: {
    height: 24,
    width: 99,
  },
  tagLine: {
    textAlign: 'center',
  },
});

export const PayPalCheckoutButton: FunctionComponent<PayPalCheckoutButtonProps> = memo(
  (props): JSX.Element => {
    const defaultProps: DefaultProps = {
      shape: 'rect',
      theme: 'gold',
      title: FSI18n.string(componentTranslationKeys.defaultTitle),
      tagLine: FSI18n.string(componentTranslationKeys.defaultTagLine),
    };

    const { shape, style, tagLine, tagLineStyle, theme, title, titleStyle } = props;

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
        titleStyle,
      ]),
      style: StyleSheet.flatten([
        {
          backgroundColor: selectedTheme.bg,
          borderRadius: shapeVal === 'rect' ? 3 : 23,
        },
        style,
      ]),
    };

    return (
      <View style={{ paddingVertical: 10 }}>
        <Button
          {...buttonProps}
          icon={selectedTheme.icon}
          iconStyle={styles.icon}
          title={titleVal}
          underlayColor={selectedTheme.bgActive}
        />
        {Boolean(tagLineVal) && <Text style={[styles.tagLine, tagLineStyle]}>{tagLineVal}</Text>}
      </View>
    );
  }
);
