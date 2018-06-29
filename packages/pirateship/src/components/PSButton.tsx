import React, { Component } from 'react';
import { StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Button, ButtonProps } from '@brandingbrand/fscomponents';
import { color, palette } from '../styles/variables';

const styles = StyleSheet.create({
  button: {
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth
  },
  buttonSecondary: {
    borderColor: color.darkGray
  },
  buttonSecondaryText: {
    color: color.darkGray
  },
  buttonWarningText: {
    color: color.darkGray
  },
  buttonLight: {
    borderColor: color.darkGray
  },
  buttonLightText: {
    color: color.darkGray
  },
  buttonLink: {
    borderWidth: 0
  },
  buttonLinkText: {
    color: palette.secondary
  }
});

export type PSButtonProps = ButtonProps;

const buttonVariables = {
  color: {
    primary: color.darkGray,
    warning: color.yellow,
    light: color.white
  }
};

export default class PSButton extends Component<PSButtonProps> {
  render(): JSX.Element {
    const { style, titleStyle, ...passthroughProps } = this.props;

    return (
      <Button
        style={[styles.button, this.getButtonStyle(), style]}
        titleStyle={[this.getButtonTextStyle(), titleStyle]}
        variables={buttonVariables}
        {...passthroughProps}
      />
    );
  }

  getButtonStyle = (): StyleProp<ViewStyle> => {
    if (this.props.secondary) {
      return styles.buttonSecondary;
    } else if (this.props.light) {
      return styles.buttonLight;
    } else if (this.props.link) {
      return styles.buttonLink;
    } else {
      return null;
    }
  }
  getButtonTextStyle = (): StyleProp<TextStyle> => {
    if (this.props.secondary) {
      return styles.buttonSecondaryText;
    } else if (this.props.warning) {
      return styles.buttonWarningText;
    } else if (this.props.light) {
      return styles.buttonLightText;
    } else if (this.props.link) {
      return styles.buttonLinkText;
    } else {
      return null;
    }
  }
}
