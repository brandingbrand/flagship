import React, { PureComponent } from 'react';

import type {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TextStyle,
  TouchableHighlightProperties,
  ViewStyle,
} from 'react-native';
import { Image, Text, TouchableHighlight, View } from 'react-native';

import { darken } from '../lib/color';
import { style as S, stylesSize, stylesTextSize } from '../styles/Button';
import { border, palette } from '../styles/variables';

import { Loading } from './Loading';

const DEFAULT_TINT_PERC = 15;

export interface ButtonProps extends Pick<TouchableHighlightProperties, 'hitSlop'> {
  title: string;
  dynamicTitleStates?: string[];
  selectedTitleState?: number;
  accessibilityLabel?: string;
  onPress: () => void;
  onLongPress?: () => void;
  underlayColor?: string;
  icon?: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
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

export interface SerializableFSButtonProps extends Omit<ButtonProps, 'onLongPress' | 'onPress'> {
  style?: ViewStyle;
  titleStyle?: TextStyle;
  iconStyle?: ImageStyle;
  viewStyle?: ViewStyle;
}

export interface ButtonState {
  palette: Record<string, string>;
  title: string;
}

export class Button extends PureComponent<ButtonProps, ButtonState> {
  private readonly renderButtonInner = (): JSX.Element => {
    const {
      color = 'primary',
      icon,
      iconStyle,
      light,
      link,
      loading,
      size = 'medium',
      titleStyle,
      viewStyle,
    } = this.props;

    const { palette, title } = this.state;
    const onColor = `on${color.charAt(0).toUpperCase()}${color.slice(1)}`;

    if (loading) {
      return <Loading />;
    }
    return (
      <View style={[S.buttonView, viewStyle]}>
        {icon && <Image source={icon} style={[S.icon, iconStyle]} />}
        <Text
          style={[
            S.text,
            { color: light || link ? palette[color] : palette[onColor] },
            stylesTextSize[size],
            titleStyle,
          ]}
        >
          {title}
        </Text>
      </View>
    );
  };

  public state: ButtonState = {
    palette: this.props.palette || palette,
    title: this.titleState,
  };

  public componentDidUpdate(): void {
    const { title } = this.state;
    const newTitle = this.titleState;
    if (newTitle !== title) {
      this.setState({ title: newTitle });
    }
  }

  public render(): JSX.Element {
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
      disabled,
    } = this.props;

    const { palette } = this.state;

    return (
      <TouchableHighlight
        accessibilityLabel={accessibilityLabel || title}
        accessibilityRole="button"
        disabled={disabled}
        hitSlop={hitSlop}
        onLongPress={onLongPress}
        onPress={onPress}
        style={[
          S.container,
          {
            backgroundColor: light || link ? 'transparent' : palette[color],
            borderColor: light ? palette[color] : undefined,
            borderWidth: light ? border.width : 0,
          },
          stylesSize[size],
          full && S.full,
          style,
        ]}
        underlayColor={underlayColor || darken(palette[color] as string, DEFAULT_TINT_PERC)}
      >
        <View style={S.buttonInner}>{this.renderButtonInner()}</View>
      </TouchableHighlight>
    );
  }

  public get titleState(): string {
    const { dynamicTitleStates, selectedTitleState, title } = this.props;

    if (selectedTitleState === undefined) {
      return title;
    }
    if (!dynamicTitleStates || selectedTitleState >= dynamicTitleStates.length) {
      return title;
    }
    const dynamicTitle = dynamicTitleStates[selectedTitleState];

    return dynamicTitle ?? title;
  }
}
