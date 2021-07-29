import React, { PureComponent } from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
// @ts-ignore TODO: Update react-native-masked-text to support typing
import { TextInputMask } from 'react-native-masked-text';
import { style as S } from '../styles/Stepper';

const icons: {[key: string]: ImageSourcePropType} = {
  increase: require('../../assets/images/increaseImage.png'),
  decrease: require('../../assets/images/decreaseImage.png')
};

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

export interface StepperProps extends Omit<
  SerializableStepperProps,
  'counterStyle' |
  'stepperStyle' |
  'qtyChangeButtonStyle' |
  'qtyChangeImageStyle'
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
  static defaultProps: Partial<StepperProps> = {
    increaseButtonImage: icons.increase,
    decreaseButtonImage: icons.decrease
  };

  private readonly kButtonTouchabilityOpacity: number = 0.5;

  constructor(props: StepperProps) {
    super(props);

    this.state = {
      count: props.count || 0
    };
  }

  handleDecreasePress = () => {
    const newCount = this.state.count - 1;

    this.setState({ count: newCount });
    if (this.props.onDecreaseButtonPress) {
      this.props.onDecreaseButtonPress(newCount);
    }
    if (this.props.onChange) {
      this.props.onChange(newCount);
    }
  }

  handleIncreasePress = () => {
    const newCount = this.state.count + 1;

    this.setState({ count: newCount });
    if (this.props.onIncreaseButtonPress) {
      this.props.onIncreaseButtonPress(newCount);
    }
    if (this.props.onChange) {
      this.props.onChange(newCount);
    }
  }

  renderDecreaseButton = (style: {} = {}) => {
    const {
      decreaseButtonImage = icons.decrease,
      removeButtonImage,
      renderDecreaseButton,
      qtyChangeButtonStyle,
      qtyChangeImageStyle,
      countLowerLimit = 0
    } = this.props;
    const { count } = this.state;
    const icon = count <= countLowerLimit + 1 && !!removeButtonImage ?
      removeButtonImage :
      decreaseButtonImage;

    if (renderDecreaseButton) {
      return renderDecreaseButton(count, this.handleDecreasePress);
    }

    return (
      <TouchableOpacity
        accessibilityLabel='Decrease'
        activeOpacity={this.kButtonTouchabilityOpacity}
        disabled={count <= countLowerLimit}
        onPress={this.handleDecreasePress}
        style={qtyChangeButtonStyle}
      >
        <Image
          resizeMode='contain'
          source={icon}
          style={[S.buttonImage, style, qtyChangeImageStyle]}
        />
      </TouchableOpacity>
    );
  }

  renderIncreaseButton = (style: {} = {}) => {
    const {
      countUpperLimit,
      increaseButtonImage = icons.increase,
      renderIncreaseButton,
      qtyChangeButtonStyle,
      qtyChangeImageStyle
    } = this.props;

    if (renderIncreaseButton) {
      return renderIncreaseButton(this.state.count, this.handleIncreasePress);
    }

    return (
      <TouchableOpacity
        accessibilityLabel='Increase'
        activeOpacity={this.kButtonTouchabilityOpacity}
        disabled={!countUpperLimit || this.state.count >= countUpperLimit}
        onPress={this.handleIncreasePress}
        style={qtyChangeButtonStyle}
      >
        <Image
          resizeMode='contain'
          source={increaseButtonImage}
          style={[S.buttonImage, style, qtyChangeImageStyle]}
        />
      </TouchableOpacity>
    );
  }

  renderHorizontalCenter = (
    counterStyle: StyleProp<TextStyle>,
    stepperStyle: StyleProp<ViewStyle>
  ) => {
    return (
      <View style={stepperStyle ? stepperStyle : S.stepperHorizontalContainer}>
        {this.renderDecreaseButton()}
        {this.renderText(counterStyle ? counterStyle : S.counterHorizontalCenter)}
        {this.renderIncreaseButton()}
      </View>
    );
  }

  renderHorizontalLeft = (
    counterStyle: StyleProp<TextStyle>,
    stepperStyle: StyleProp<ViewStyle>
  ) => {
    return (
      <View style={stepperStyle ? stepperStyle : S.stepperHorizontalContainer}>
        {this.renderText(counterStyle ? counterStyle : S.counterHorizontalLeft)}
        {this.renderDecreaseButton()}
        {this.renderIncreaseButton(S.buttonIncreaseHorizontalLeft)}
      </View>
    );
  }

  renderVertical = (
    counterStyle: StyleProp<TextStyle>,
    stepperStyle: StyleProp<ViewStyle>
  ) => {
    return (
      <View style={stepperStyle ? stepperStyle : S.stepperVerticalContainer}>
        {this.renderIncreaseButton()}
        {this.renderText(counterStyle ? counterStyle : S.counterVertical)}
        {this.renderDecreaseButton()}
      </View>
    );
  }

  render(): JSX.Element {
    const {
      counterStyle,
      format,
      stepperStyle
    } = this.props;
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

  private renderText = (counterStyle: StyleProp<TextStyle>) => {
    const { count } = this.state;
    const { prefix, prefixStyle, qtyStyle } = this.props;
    const counterText = prefix ? `${prefix} ${count}` : `${count}`;

    if (this.props.renderText) {
      return this.props.renderText(counterText, counterStyle, this.state.count);
    }
    if (this.props.editable) {
      return (
        <TextInputMask
          keyboardType={'phone-pad'}
          onChangeText={this.onTextChange}
          style={counterStyle}
          type='only-numbers'
          value={counterText}
        />
      );
    }
    return (
      <Text style={counterStyle}>
        {!!prefix && <Text style={prefixStyle}>{prefix}</Text>}
        <Text style={qtyStyle}>{count}</Text>
      </Text>
    );
  }

  private onTextChange = (text: string) => {
    let value = parseInt(text, 10);
    if (!isNaN(value)) {
      if (this.props.countUpperLimit && value > this.props.countUpperLimit) {
        value = this.props.countUpperLimit;
      }
      this.setState({ count: value });
      if (this.props.onChange) {
        this.props.onChange(value);
      }
    }
  }
}
