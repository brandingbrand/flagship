import React, { FunctionComponent, memo } from 'react';
import {
  ImageStyle,
  ImageURISource,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { Step } from './Step';


export interface StepIndicatorProps {
  completedStyle: StyleProp<ViewStyle>;
  completedTextStyle: StyleProp<TextStyle>;
  completedIcon?: ImageURISource;
  completedIconStyle?: StyleProp<ImageStyle>;
  currentStyle: StyleProp<ViewStyle>;
  currentStep: number;
  currentTextStyle: StyleProp<TextStyle>;
  defaultStyle: StyleProp<ViewStyle>;
  defaultTextStyle: StyleProp<TextStyle>;
  onStepPressed?: (step: number, title: string) => void;
  stepTitles: string[];
  style?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    flexDirection: 'row'
  },
  stepContainer: {
    flex: 1
  }
});

/**
 * StepIndicator component for displaying a series of steps in their completed state
 */
export const StepIndicator: FunctionComponent<StepIndicatorProps> = memo((props): JSX.Element => {
  const stepPressed = (index: number, title: string): () => void => {
    return () => {
      if (props.onStepPressed) {
        props.onStepPressed(index, title);
      }
    };
  };

  const renderStep = (title: string, index: number): JSX.Element => {
    const completed = index < props.currentStep;
    let stepStyle = props.defaultStyle;
    let textStyle = props.defaultTextStyle;

    if (index === props.currentStep) {
      stepStyle = props.currentStyle;
      textStyle = props.currentTextStyle;
    } else if (completed) {
      stepStyle = props.completedStyle;
      textStyle = props.completedTextStyle;
    }

    return (
      <Step
        completed={completed}
        completedIcon={props.completedIcon}
        completedIconStyle={props.completedIconStyle}
        key={`step-indicator-step-${index}`}
        onPress={stepPressed(index, title)}
        stepNumber={index + 1}
        style={stepStyle}
        title={title}
        titleStyle={textStyle}
      />
    );
  };

  return (
    <View style={[styles.container, props.style]}>
      {props.stepTitles.map(renderStep)}
    </View>
  );
});
