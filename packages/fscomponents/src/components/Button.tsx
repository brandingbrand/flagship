import React, { PureComponent } from 'react';
import {
  Image,
  ImageStyle,
  ImageURISource,
  StyleProp,
  Text,
  TextStyle,
  TouchableHighlight,
  TouchableHighlightProperties,
  View,
  ViewStyle
} from 'react-native';

import { darken } from '../lib/color';
import {
  style as S,
  stylesSize,
  stylesTextColor,
  stylesTextSize
} from '../styles/Button';
import { Loading } from './Loading';

const DEFAULT_TINT_PERC = 15;

export interface StylesColor {
  primary: string;
  secondary: string;
  success: string;
  info: string;
  warning: string;
  alert: string;
  dark: string;
  light: string;
  disabled: string;
  link: string;
}

export interface ButtonProps extends Pick<TouchableHighlightProperties, 'hitSlop'> {
  title: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
  onLongPress?: () => void;
  titleStyle?: StyleProp<TextStyle>;
  underlayColor?: string;
  variables?: {
    color: any;
  };
  icon?: ImageURISource;
  iconStyle?: StyleProp<ImageStyle>;

  // color
  primary?: boolean;
  secondary?: boolean;
  success?: boolean;
  warning?: boolean;
  alert?: boolean;
  dark?: boolean;
  light?: boolean;
  link?: boolean;

  // state
  disabled?: boolean;
  loading?: boolean;

  // size
  large?: boolean;
  small?: boolean;
  full?: boolean;
}

export class Button extends PureComponent<ButtonProps> {
  stylesColor: StylesColor;

  constructor(props: ButtonProps) {
    super(props);

    const { variables = { color: {} } } = props;

    // TODO: stylesColor should be state and this should run inside getDerivedStateFromProps
    this.stylesColor = {
      alert: variables.color.alert || '#f9373e',
      dark: variables.color.dark || '#555555',
      disabled: variables.color.disabled || '#eeeeee',
      info: variables.color.info || '#3adb76',
      light: variables.color.light || '#eeeeee',
      link: 'transparent',
      primary: variables.color.primary || '#4078c0',
      secondary: variables.color.secondary || '#707070',
      success: variables.color.success || '#3adb76',
      warning: variables.color.warning || '#ffae00'
    };
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
      hitSlop
    } = this.props;

    const color = this.getColor(this.props);
    const size = this.getSize(this.props);

    return (
      <TouchableHighlight
        accessibilityLabel={accessibilityLabel || title}
        onPress={onPress}
        onLongPress={onLongPress}
        underlayColor={
          underlayColor || darken(this.stylesColor[color], DEFAULT_TINT_PERC)
        }
        hitSlop={hitSlop}
        style={[
          S.container,
          { backgroundColor: this.stylesColor[color] },
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
      title,
      titleStyle
    } = this.props;

    const color = this.getColor(this.props);
    const size = this.getSize(this.props);

    if (loading) {
      return <Loading />;
    } else {
      return (
        <View style={S.buttonView}>
          {icon && <Image style={[S.icon, iconStyle]} source={icon} />}
          <Text
            style={[
              S.text,
              {
                color:
                  color === 'link'
                    ? this.stylesColor.primary
                    : stylesTextColor[color]
              },
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

  private getColor = (props: ButtonProps) => {
    if (props.primary) {
      return 'primary';
    }
    if (props.secondary) {
      return 'secondary';
    }
    if (props.success) {
      return 'success';
    }
    if (props.warning) {
      return 'warning';
    }
    if (props.alert) {
      return 'alert';
    }
    if (props.dark) {
      return 'dark';
    }
    if (props.light) {
      return 'light';
    }
    if (props.disabled) {
      return 'disabled';
    }
    if (props.link) {
      return 'link';
    }
    return 'primary';
  }

  private getSize = (props: ButtonProps) => {
    if (props.small) {
      return 'small';
    }
    return 'large';
  }
}
