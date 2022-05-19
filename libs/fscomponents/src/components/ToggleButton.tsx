import React, { Component } from 'react';

import type { AccessibilityRole, LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';
import { Animated, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

import { palette } from '../styles/variables';

export interface SerializableToggleButtonProps {
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
  accessibilityHint?: string;

  state?: boolean;
  disableAnimation?: boolean;

  // Styles
  containerInactiveColor?: string;
  containerActiveColor?: string;
  wrapperStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  containerActiveStyle?: ViewStyle;
  containerPinStyle?: ViewStyle;
  containerPinActiveStyle?: ViewStyle;
}

export interface ToggleButtonProps
  extends Omit<
    SerializableToggleButtonProps,
    | 'containerActiveStyle'
    | 'containerPinActiveStyle'
    | 'containerPinStyle'
    | 'containerStyle'
    | 'wrapperStyle'
  > {
  renderTogglePin?: () => React.ReactNode;
  onPress?: (state: boolean) => void;

  // Styles
  wrapperStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  containerActiveStyle?: StyleProp<ViewStyle>;
  containerPinStyle?: StyleProp<ViewStyle>;
  containerPinActiveStyle?: StyleProp<ViewStyle>;

  dataSet?: Record<string, ''>;
}

export interface ToggleButtonState {
  isSelected: boolean;
  containerWidth: number;
  containerPinWidth: number;
  containerPinWidthInitialized: boolean;
  pinIndentAnimation: Animated.Value;
}

const TOGGLE_CONTAINER_WIDTH_DEFAULT = 50;
const TOGGLE_CONTAINER_HEIGHT_DEFAULT = 32;
const TOGGLE_PIN_SIZE_DEFAULT = 32;

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    flexDirection: 'column',
    height: TOGGLE_CONTAINER_HEIGHT_DEFAULT,
    justifyContent: 'center',
    width: TOGGLE_CONTAINER_WIDTH_DEFAULT,
  },
  containerPin: {
    backgroundColor: palette.background,
    borderColor: palette.surface,
    borderRadius: TOGGLE_PIN_SIZE_DEFAULT / 2,
    borderWidth: 2,
    height: TOGGLE_PIN_SIZE_DEFAULT,
    width: TOGGLE_PIN_SIZE_DEFAULT,
  },
});

export class ToggleButton extends Component<ToggleButtonProps, ToggleButtonState> {
  constructor(props: ToggleButtonProps) {
    super(props);

    this.state = {
      isSelected: this.props.state || false,
      containerWidth: TOGGLE_CONTAINER_WIDTH_DEFAULT,
      containerPinWidth: TOGGLE_PIN_SIZE_DEFAULT,
      containerPinWidthInitialized: false,
      pinIndentAnimation: new Animated.Value(this.props.state ? 1 : 0),
    };
  }

  private readonly animateTogglePin = (indent: number) => {
    if (!this.props.disableAnimation) {
      Animated.spring(this.state.pinIndentAnimation, {
        bounciness: 0,
        toValue: indent,
        useNativeDriver: false,
      }).start();
    } else {
      this.setState({
        pinIndentAnimation: new Animated.Value(indent),
      });
    }
  };

  private readonly containerOnLayout = (event: LayoutChangeEvent) => {
    const { isSelected } = this.state;
    const { width } = event.nativeEvent.layout;
    this.setState({
      containerWidth: width,
    });
    if (isSelected) {
      this.setState({
        pinIndentAnimation: new Animated.Value(1),
      });
    }
  };

  private readonly pinOnLayout = (event: LayoutChangeEvent) => {
    const { containerPinWidthInitialized, isSelected } = this.state;
    const { width } = event.nativeEvent.layout;
    this.setState({
      containerPinWidth: width,
      containerPinWidthInitialized: true,
    });
    if (isSelected && !containerPinWidthInitialized) {
      this.setState({
        pinIndentAnimation: new Animated.Value(1),
      });
    }
  };

  private readonly toggleAccordion = () => {
    const { isSelected } = this.state;

    this.setState({
      isSelected: !isSelected,
    });

    if (this.props.onPress) {
      this.props.onPress(!isSelected);
    }

    if (isSelected) {
      this.animateTogglePin(0);
    } else {
      this.animateTogglePin(1);
    }
  };

  public render(): JSX.Element {
    const { containerPinWidth, containerWidth, isSelected, pinIndentAnimation } = this.state;

    const indentation = {
      paddingLeft: pinIndentAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, containerWidth - containerPinWidth],
      }),
    };

    const animatedColor = pinIndentAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [
        this.props.containerInactiveColor || palette.surface,
        this.props.containerActiveColor || palette.primary,
      ],
    });

    return (
      <View style={this.props.wrapperStyle} {...{ dataSet: this.props.dataSet }}>
        <TouchableWithoutFeedback
          accessibilityHint={this.props.accessibilityHint}
          accessibilityLabel={this.props.accessibilityLabel}
          accessibilityRole={this.props.accessibilityRole ?? 'button'}
          accessible={this.props.accessible}
          onPress={this.toggleAccordion}
        >
          <Animated.View
            onLayout={this.containerOnLayout}
            style={[
              styles.container,
              this.props.containerStyle,
              {
                backgroundColor: animatedColor,
              },
              isSelected && this.props.containerActiveStyle,
            ]}
          >
            <Animated.View style={indentation}>
              <Animated.View
                onLayout={this.pinOnLayout}
                style={[
                  styles.containerPin,
                  this.props.containerPinStyle,
                  {
                    borderColor: animatedColor,
                  },
                  isSelected && this.props.containerPinActiveStyle,
                ]}
              >
                {this.props.renderTogglePin && this.props.renderTogglePin()}
              </Animated.View>
            </Animated.View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
