import React from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  Text,
  TextStyle,
  TouchableHighlight,
  TouchableHighlightProperties,
  View,
  ViewStyle
} from 'react-native';

import { darken } from '../lib/color';
import { border, palette } from '../styles/variables';
import {
  style as S,
  stylesSize,
  stylesTextSize
} from '../styles/Button';
import { Loading } from './Loading';

const DEFAULT_TINT_PERC = 15;

export interface Palette {
  primary: string;
  secondary: string;
  accent: string;
  error: string;
  background: string;
  surface: string;
  onPrimary: string;
  onSecondary: string;
  onAccent: string;
  onBackground: string;
  onSurface: string;
  onError: string;
  [key: string]: string;
}

export interface ButtonProps extends Pick<TouchableHighlightProperties, 'hitSlop'> {
  title: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
  onLongPress?: () => void;
  titleStyle?: StyleProp<TextStyle>;
  underlayColor?: string;
  icon?: ImageSourcePropType;
  iconStyle?: StyleProp<ImageStyle>;
  viewStyle?: StyleProp<ViewStyle>;

  // style
  palette?: typeof palette;
  color?: keyof typeof palette;
  size?: keyof typeof stylesSize;

  // types
  light?: boolean;
  link?: boolean;

  // state
  disabled?: boolean;
  loading?: boolean;

  // expand horizontally
  full?: boolean;
}

export const Button = (props: ButtonProps) => {
  const {
    title,
    style = {},
    onPress,
    onLongPress,
    underlayColor,
    full,
    accessibilityLabel,
    hitSlop,
    size = 'medium',
    color = 'primary',
    light,
    link,
    disabled
  } = props;

  const renderButtonInner = () => {
    const {
      loading,
      icon,
      iconStyle,
      title,
      titleStyle,
      viewStyle,
      size = 'medium',
      color = 'primary',
      light,
      link,
      palette
    } = props;

    // color prop is passed as a string representing the key on palette, ie. "primary" or
    // "onAcccent". Defaults to "primary", and applied to button background color
    const onColor = 'on' + color.charAt(0).toUpperCase() + color.slice(1);
    const newPalette: Palette | undefined = props.palette ? props.palette : palette;
    const newColor = newPalette &&
      { color: light || link ? newPalette[color] : newPalette[onColor] };

    if (loading) {
      return <Loading />;
    } else {
      return (
        <View style={[S.buttonView, viewStyle]}>
          {icon && <Image style={[S.icon, iconStyle]} source={icon} />}
          <Text
            style={[
              S.text,
              newColor,
              stylesTextSize[size],
              titleStyle
            ]}
          >
            {title}
          </Text>
        </View>
      );
    }
  };

  return (
    <TouchableHighlight
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole='button'
      onPress={onPress}
      onLongPress={onLongPress}
      underlayColor={
        underlayColor || darken(palette[color], DEFAULT_TINT_PERC)
      }
      disabled={disabled}
      hitSlop={hitSlop}
      style={[
        S.container,
        {
          backgroundColor: light || link ? 'transparent' : palette[color],
          borderColor: light ? palette[color] : undefined,
          borderWidth: light ? border.width : 0
        },
        stylesSize[size],
        full && S.full,
        style
      ]}
    >
      <View style={S.buttonInner}>
        {renderButtonInner()}
      </View>
    </TouchableHighlight>
  );
};

