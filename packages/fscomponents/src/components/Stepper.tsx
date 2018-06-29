import React, { PureComponent } from 'react';
import {
  Image,
  ImageURISource,
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

const icons: {[key: string]: ImageURISource} = {
  increase: require('../../assets/images/increaseImage.png'),
  decrease: require('../../assets/images/decreaseImage.png')
};

export interface StepperProps {
  format?: 'horizontalCenter' | 'horizontalLeft' | 'vertical';
  onChange?: (count: number) => void;

  // Stepper style
  stepperStyle?: StyleProp<ViewStyle>;

  // Counter
  count?: number;
  countUpperLimit?: number;
  counterStyle?: StyleProp<TextStyle>;
  editable?: boolean;
  prefix?: string;
  renderText?: (text: string, style: StyleProp<TextStyle>, value: number) => React.ReactNode;

  // Decrease button
  onDecreaseButtonPress: (count: number) => void;
  decreaseButtonImage?: ImageURISource;
  renderDecreaseButton?: (count: number, handlePress: () => void) => React.ReactNode;

  // Increase button
  onIncreaseButtonPress: (count: number) => void;
  increaseButtonImage?: ImageURISource;
  renderIncreaseButton?: (count: number, handlePress: () => void) => React.ReactNode;
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
      renderDecreaseButton
    } = this.props;

    if (renderDecreaseButton) {
      return renderDecreaseButton(this.state.count, this.handleDecreasePress);
    }

    return (
      <TouchableOpacity
        accessibilityLabel='Decrease'
        activeOpacity={this.kButtonTouchabilityOpacity}
        disabled={this.state.count <= 0}
        onPress={this.handleDecreasePress}
      >
        <Image
          resizeMode='contain'
          source={decreaseButtonImage}
          style={[S.buttonImage, style]}
        />
      </TouchableOpacity>
    );
  }

  renderIncreaseButton = (style: {} = {}) => {
    const {
      countUpperLimit,
      increaseButtonImage = icons.increase,
      renderIncreaseButton
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
      >
        <Image
          resizeMode='contain'
          source={increaseButtonImage}
          style={[S.buttonImage, style]}
        />
      </TouchableOpacity>
    );
  }

  renderHorizontalCenter = (
    counterText: string, counterStyle: StyleProp<TextStyle>, stepperStyle: StyleProp<ViewStyle>
  ) => {
    return (
      <View style={stepperStyle ? stepperStyle : S.stepperHorizontalContainer}>
        {this.renderDecreaseButton()}
        {this.renderText(counterStyle ? counterStyle : S.counterHorizontalCenter, counterText)}
        {this.renderIncreaseButton()}
      </View>
    );
  }

  renderHorizontalLeft = (
    counterText: string, counterStyle: StyleProp<TextStyle>, stepperStyle: StyleProp<ViewStyle>
  ) => {
    return (
      <View style={stepperStyle ? stepperStyle : S.stepperHorizontalContainer}>
        {this.renderText(counterStyle ? counterStyle : S.counterHorizontalLeft, counterText)}
        {this.renderDecreaseButton()}
        {this.renderIncreaseButton(S.buttonIncreaseHorizontalLeft)}
      </View>
    );
  }

  renderVertical = (
    counterText: string, counterStyle: StyleProp<TextStyle>, stepperStyle: StyleProp<ViewStyle>
  ) => {
    return (
      <View style={stepperStyle ? stepperStyle : S.stepperVerticalContainer}>
        {this.renderIncreaseButton()}
        {this.renderText(counterStyle ? counterStyle : S.counterVertical, counterText)}
        {this.renderDecreaseButton()}
      </View>
    );
  }

  render(): JSX.Element {
    const {
      counterStyle,
      format,
      prefix,
      stepperStyle
    } = this.props;
    const { count } = this.state;
    const counterText = prefix ? `${prefix} ${count}` : `${count}`;

    switch (format) {
      case 'horizontalCenter':
        return this.renderHorizontalCenter(counterText, counterStyle, stepperStyle);
      case 'horizontalLeft':
        return this.renderHorizontalLeft(counterText, counterStyle, stepperStyle);
      case 'vertical':
        return this.renderVertical(counterText, counterStyle, stepperStyle);
      default:
        return this.renderHorizontalCenter(counterText, counterStyle, stepperStyle);
    }
  }

  private renderText = (counterStyle: StyleProp<TextStyle>, counterText: string) => {
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
      <Text style={counterStyle}>{counterText}</Text>
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
