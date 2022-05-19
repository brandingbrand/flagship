import React, { PureComponent } from 'react';

import type {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

import decrease from '../../assets/images/decreaseImage.png';
import increase from '../../assets/images/increaseImage.png';
import { style as S } from '../styles/Stepper';

const icons = {
  increase,
  decrease,
} as const;

const nonNumericRegex = /\D/g;

export interface SerializableStepperProps {
  format?: 'horizontalCenter' | 'horizontalLeft' | 'vertical';

  // Stepper style
  stepperStyle?: ViewStyle;

  // Counter
  count?: number;
  countUpperLimit?: number;
  countLowerLimit?: number;
  editable?: boolean;
  prefix?: string;

  // Text style that applies to both the prefix and quantity text
  counterStyle?: TextStyle;

  // Text style that only applies to the prefix text
  prefixStyle?: TextStyle;

  // Text style that only applies to the quantity text
  qtyStyle?: TextStyle;

  // Decrease button
  decreaseButtonImage?: ImageSourcePropType;

  // Increase button
  increaseButtonImage?: ImageSourcePropType;

  // Remove button image that will replace the decrease button image if count is one.
  removeButtonImage?: ImageSourcePropType;

  // Styles that will apply to the Touchable wrapping the quantity steppers
  qtyChangeButtonStyle?: ViewStyle;

  // Styles that will apply to the quantity stepper images
  qtyChangeImageStyle?: ImageStyle;
}

export interface StepperProps
  extends Omit<
    SerializableStepperProps,
    'counterStyle' | 'qtyChangeButtonStyle' | 'qtyChangeImageStyle' | 'stepperStyle'
  > {
  onChange?: (count: number) => void;

  // Stepper style
  stepperStyle?: StyleProp<ViewStyle>;

  // Counter
  counterStyle?: StyleProp<TextStyle>;
  renderText?: (text: string, style: StyleProp<TextStyle>, value: number) => React.ReactNode;

  // Decrease button
  onDecreaseButtonPress: (count: number) => void;
  renderDecreaseButton?: (count: number, handlePress: () => void) => React.ReactNode;

  // Increase button
  onIncreaseButtonPress: (count: number) => void;
  renderIncreaseButton?: (count: number, handlePress: () => void) => React.ReactNode;

  // Styles that will apply to the Touchable wrapping the quantity steppers
  qtyChangeButtonStyle?: StyleProp<ViewStyle>;

  // Styles that will apply to the quantity stepper images
  qtyChangeImageStyle?: StyleProp<ImageStyle>;
}

export interface StepperState {
  count: number;
}

export class Stepper extends PureComponent<StepperProps, StepperState> {
  public static defaultProps: Partial<StepperProps> = {
    increaseButtonImage: icons.increase,
    decreaseButtonImage: icons.decrease,
  };

  public static getDerivedStateFromProps(props: StepperProps, state: StepperState) {
    if (props.count && props.count !== state.count) {
      return {
        count: props.count,
      };
    }

    return null;
  }

  constructor(props: StepperProps) {
    super(props);

    this.state = {
      count: props.count || 0,
    };
  }

  private readonly kButtonTouchabilityOpacity: number = 0.5;

  private readonly handleDecreasePress = () => {
    const newCount = this.state.count - 1;

    this.setState({ count: newCount });
    if (this.props.onDecreaseButtonPress) {
      this.props.onDecreaseButtonPress(newCount);
    }
    if (this.props.onChange) {
      this.props.onChange(newCount);
    }
  };

  private readonly handleIncreasePress = () => {
    const newCount = this.state.count + 1;

    this.setState({ count: newCount });
    if (this.props.onIncreaseButtonPress) {
      this.props.onIncreaseButtonPress(newCount);
    }
    if (this.props.onChange) {
      this.props.onChange(newCount);
    }
  };

  private readonly renderDecreaseButton = (style: {} = {}) => {
    const {
      decreaseButtonImage = icons.decrease,
      removeButtonImage,
      renderDecreaseButton,
      qtyChangeButtonStyle,
      qtyChangeImageStyle,
      countLowerLimit = 0,
    } = this.props;
    const { count } = this.state;
    const icon =
      count <= countLowerLimit + 1 && removeButtonImage !== undefined
        ? removeButtonImage
        : decreaseButtonImage;

    if (renderDecreaseButton) {
      return renderDecreaseButton(count, this.handleDecreasePress);
    }

    return (
      <TouchableOpacity
        accessibilityLabel="Decrease"
        activeOpacity={this.kButtonTouchabilityOpacity}
        disabled={count <= countLowerLimit}
        onPress={this.handleDecreasePress}
        style={qtyChangeButtonStyle}
      >
        <Image
          resizeMode="contain"
          source={icon}
          style={[S.buttonImage, style, qtyChangeImageStyle]}
        />
      </TouchableOpacity>
    );
  };

  private readonly renderIncreaseButton = (style: {} = {}) => {
    const {
      countUpperLimit,
      increaseButtonImage = icons.increase,
      renderIncreaseButton,
      qtyChangeButtonStyle,
      qtyChangeImageStyle,
    } = this.props;

    if (renderIncreaseButton) {
      return renderIncreaseButton(this.state.count, this.handleIncreasePress);
    }

    return (
      <TouchableOpacity
        accessibilityLabel="Increase"
        activeOpacity={this.kButtonTouchabilityOpacity}
        disabled={!countUpperLimit || this.state.count >= countUpperLimit}
        onPress={this.handleIncreasePress}
        style={qtyChangeButtonStyle}
      >
        <Image
          resizeMode="contain"
          source={increaseButtonImage}
          style={[S.buttonImage, style, qtyChangeImageStyle]}
        />
      </TouchableOpacity>
    );
  };

  private readonly renderHorizontalCenter = (
    counterStyle: StyleProp<TextStyle>,
    stepperStyle: StyleProp<ViewStyle>
  ) => (
    <View style={stepperStyle ? stepperStyle : S.stepperHorizontalContainer}>
      {this.renderDecreaseButton()}
      {this.renderText(counterStyle ? counterStyle : S.counterHorizontalCenter)}
      {this.renderIncreaseButton()}
    </View>
  );

  private readonly renderHorizontalLeft = (
    counterStyle: StyleProp<TextStyle>,
    stepperStyle: StyleProp<ViewStyle>
  ) => (
    <View style={stepperStyle ? stepperStyle : S.stepperHorizontalContainer}>
      {this.renderText(counterStyle ? counterStyle : S.counterHorizontalLeft)}
      {this.renderDecreaseButton()}
      {this.renderIncreaseButton(S.buttonIncreaseHorizontalLeft)}
    </View>
  );

  private readonly renderVertical = (
    counterStyle: StyleProp<TextStyle>,
    stepperStyle: StyleProp<ViewStyle>
  ) => (
    <View style={stepperStyle ? stepperStyle : S.stepperVerticalContainer}>
      {this.renderIncreaseButton()}
      {this.renderText(counterStyle ? counterStyle : S.counterVertical)}
      {this.renderDecreaseButton()}
    </View>
  );

  private readonly renderText = (counterStyle: StyleProp<TextStyle>) => {
    const { count } = this.state;
    const { prefix, prefixStyle, qtyStyle } = this.props;
    const counterText = prefix ? `${prefix} ${count}` : `${count}`;

    if (this.props.renderText) {
      return this.props.renderText(counterText, counterStyle, this.state.count);
    }
    if (this.props.editable) {
      return (
        <TextInput
          keyboardType="phone-pad"
          onChangeText={this.onTextChange}
          style={counterStyle}
          value={counterText}
        />
      );
    }
    return (
      <Text style={counterStyle}>
        {Boolean(prefix) && <Text style={prefixStyle}>{prefix}</Text>}
        <Text style={qtyStyle}>{count}</Text>
      </Text>
    );
  };

  private readonly onTextChange = (text: string) => {
    text = text.replace(nonNumericRegex, '');
    let value = Number.parseInt(text, 10);
    if (!isNaN(value)) {
      if (this.props.countUpperLimit && value > this.props.countUpperLimit) {
        value = this.props.countUpperLimit;
      }
      this.setState({ count: value });
      if (this.props.onChange) {
        this.props.onChange(value);
      }
    }
  };

  public render(): JSX.Element {
    const { counterStyle, format, stepperStyle } = this.props;
    switch (format) {
      case 'horizontalCenter':
        return this.renderHorizontalCenter(counterStyle, stepperStyle);
      case 'horizontalLeft':
        return this.renderHorizontalLeft(counterStyle, stepperStyle);
      case 'vertical':
        return this.renderVertical(counterStyle, stepperStyle);
      default:
        return this.renderHorizontalCenter(counterStyle, stepperStyle);
    }
  }
}
