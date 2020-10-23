import React from 'react';
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

export interface SerializableStatelessStepperProps {
  format?: 'horizontalCenter' | 'horizontalLeft' | 'vertical';

  // Stepper style
  stepperStyle?: ViewStyle;

  // Counter
  count: number;
  countUpperLimit?: number;
  counterStyle?: TextStyle;
  editable?: boolean;
  prefix?: string;
}

export interface StatelessStepperProps extends Omit<SerializableStatelessStepperProps,
  'stepperStyle' |
  'counterStyle'
  > {
  onChange?: (count: number) => void;

  // Stepper style
  stepperStyle?: StyleProp<ViewStyle>;

  // Counter
  counterStyle?: StyleProp<TextStyle>;
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

const defaultProps: Partial<StatelessStepperProps> = {
  increaseButtonImage: icons.increase,
  decreaseButtonImage: icons.decrease
};

export const StatelessStepper = (props = defaultProps): JSX.Element => {

  const kButtonTouchabilityOpacity: number = 0.5;
  const handleDecreasePress = () => {
    const oldCount = props.count;
    const newCount = oldCount && oldCount - 1;

    if (props.onDecreaseButtonPress && newCount) {
      props.onDecreaseButtonPress(newCount);
    }

    if (props.onChange && newCount) {
      props.onChange(newCount);
    }
  };

  const handleIncreasePress = () => {
    const newCount = props.count && props.count + 1;

    if (props.onIncreaseButtonPress && newCount) {
      props.onIncreaseButtonPress(newCount);
    }

    if (props.onChange && newCount) {
      props.onChange(newCount);
    }
  };

  const renderDecreaseButton = (style: {} = {}) => {
    const {
      decreaseButtonImage = icons.decrease,
      renderDecreaseButton,
      count
    } = props;

    if (renderDecreaseButton && count) {
      return renderDecreaseButton(count, handleDecreasePress);
    }

    return (
      <TouchableOpacity
        accessibilityLabel='Decrease'
        activeOpacity={kButtonTouchabilityOpacity}
        disabled={props.count && props.count <= 0 || true}
        onPress={handleDecreasePress}
      >
        <Image
          resizeMode='contain'
          source={decreaseButtonImage}
          style={[S.buttonImage, style]}
        />
      </TouchableOpacity>
    );
  };

  const renderIncreaseButton = (style: {} = {}) => {
    const {
      countUpperLimit,
      increaseButtonImage = icons.increase,
      renderIncreaseButton
    } = props;

    if (renderIncreaseButton && props.count) {
      return renderIncreaseButton(props.count, handleIncreasePress);
    }

    return (
      <TouchableOpacity
        accessibilityLabel='Increase'
        activeOpacity={kButtonTouchabilityOpacity}
        disabled={!countUpperLimit || props.count && props.count >= countUpperLimit || true}
        onPress={handleIncreasePress}
      >
        <Image
          resizeMode='contain'
          source={increaseButtonImage}
          style={[S.buttonImage, style]}
        />
      </TouchableOpacity>
    );
  };

  const onTextChange = (text: string) => {
    let value = parseInt(text, 10);

    if (!isNaN(value)) {
      if (props.countUpperLimit && value > props.countUpperLimit) {
        value = props.countUpperLimit;
      }

      if (props.onChange) {
        props.onChange(value);
      }
    }
  };

  const renderText = (counterStyle: StyleProp<TextStyle>, counterText: string) => {
    if (props.renderText && props.count) {
      return props.renderText(counterText, counterStyle, props.count);
    }

    if (props.editable) {
      return (
        <TextInputMask
          keyboardType={'phone-pad'}
          onChangeText={onTextChange}
          style={counterStyle}
          type='only-numbers'
          value={counterText}
        />
      );
    }

    return (
      <Text style={counterStyle}>{counterText}</Text>
    );
  };


  const renderHorizontalCenter = (
    counterText: string, counterStyle: StyleProp<TextStyle>, stepperStyle: StyleProp<ViewStyle>
  ) => {
    return (
      <View style={stepperStyle ? stepperStyle : S.stepperHorizontalContainer}>
        {renderDecreaseButton()}
        {renderText(counterStyle ? counterStyle : S.counterHorizontalCenter, counterText)}
        {renderIncreaseButton()}
      </View>
    );
  };

  const renderHorizontalLeft = (
    counterText: string, counterStyle: StyleProp<TextStyle>, stepperStyle: StyleProp<ViewStyle>
  ) => {
    return (
      <View style={stepperStyle ? stepperStyle : S.stepperHorizontalContainer}>
        {renderText(counterStyle ? counterStyle : S.counterHorizontalLeft, counterText)}
        {renderDecreaseButton()}
        {renderIncreaseButton(S.buttonIncreaseHorizontalLeft)}
      </View>
    );
  };

  const renderVertical = (
    counterText: string, counterStyle: StyleProp<TextStyle>, stepperStyle: StyleProp<ViewStyle>
  ) => {
    return (
      <View style={stepperStyle ? stepperStyle : S.stepperVerticalContainer}>
        {renderIncreaseButton()}
        {renderText(counterStyle ? counterStyle : S.counterVertical, counterText)}
        {renderDecreaseButton()}
      </View>
    );
  };

  const {
      counterStyle,
      format,
      prefix,
      stepperStyle
    } = props;
  const { count } = props;
  const counterText = prefix ? `${prefix} ${count}` : `${count}`;

  switch (format) {
    case 'horizontalCenter':
      return renderHorizontalCenter(counterText, counterStyle, stepperStyle);
    case 'horizontalLeft':
      return renderHorizontalLeft(counterText, counterStyle, stepperStyle);
    case 'vertical':
      return renderVertical(counterText, counterStyle, stepperStyle);
    default:
      return renderHorizontalCenter(counterText, counterStyle, stepperStyle);
  }

};

