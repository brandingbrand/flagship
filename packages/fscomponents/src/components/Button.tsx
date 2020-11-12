import React, { PureComponent } from 'react';
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

export interface SerializableButtonProps extends Omit<ButtonProps, 'onPress' | 'onLongPress'> {
  style?: ViewStyle;
  titleStyle?: TextStyle;
  iconStyle?: ImageStyle;
  viewStyle?: ViewStyle;
}

export interface ButtonState {
  palette: any;
  title: string;
}

export class Button extends PureComponent<ButtonProps, ButtonState> {
  state: ButtonState = {
    palette: this.props.palette || palette,
    title: this.titleState
  };

  componentDidUpdate(): void {
    const { title } = this.state;
    const newTitle = this.titleState;
    if (newTitle !== title) {
      this.setState({ title: newTitle });
    }
  }

  render(): any {
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
    } = this.props;

    const { palette } = this.state;

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
          {this.renderButtonInner()}
        </View>
      </TouchableHighlight>
    );
  }

  private renderButtonInner = () => {
    const {
      loading,
      icon,
      iconStyle,
      titleStyle,
      viewStyle,
      size = 'medium',
      color = 'primary',
      light,
      link
    } = this.props;

    const { palette, title } = this.state;
    const onColor = 'on' + color.charAt(0).toUpperCase() + color.slice(1);

    if (loading) {
      return <Loading />;
    } else {
      return (
        <View style={[S.buttonView, viewStyle]}>
          {icon && <Image style={[S.icon, iconStyle]} source={icon} />}
          <Text
            style={[
              S.text,
              { color: light || link ? palette[color] : palette[onColor] },
              stylesTextSize[size],
              titleStyle
            ]}
          >
            {title}
          </Text>
        </View>
      );
    }
  }

  get titleState(): string {
    const {
      title,
      selectedTitleState,
      dynamicTitleStates
     } = this.props;

    if (selectedTitleState === undefined || !dynamicTitleStates ||
      selectedTitleState >= dynamicTitleStates.length) {
      return title;
    }

    return dynamicTitleStates[selectedTitleState];
  }
}
