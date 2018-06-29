import React, { Component } from 'react';
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
export class StepIndicator extends Component<StepIndicatorProps> {
  render(): JSX.Element {
    return (
      <View style={[styles.container, this.props.style]}>
        {this.props.stepTitles.map(this.renderStep)}
      </View>
    );
  }

  private renderStep = (title: string, index: number): JSX.Element => {
    const completed = index < this.props.currentStep;
    let stepStyle = this.props.defaultStyle;
    let textStyle = this.props.defaultTextStyle;

    if (index === this.props.currentStep) {
      stepStyle = this.props.currentStyle;
      textStyle = this.props.currentTextStyle;
    } else if (completed) {
      stepStyle = this.props.completedStyle;
      textStyle = this.props.completedTextStyle;
    }

    return (
      <Step
        completed={completed}
        completedIcon={this.props.completedIcon}
        completedIconStyle={this.props.completedIconStyle}
        key={`step-indicator-step-${index}`}
        onPress={this.stepPressed(index, title)}
        stepNumber={index + 1}
        style={stepStyle}
        title={title}
        titleStyle={textStyle}
      />
    );
  }

  private stepPressed = (index: number, title: string): () => void => {
    return () => {
      if (this.props.onStepPressed) {
        this.props.onStepPressed(index, title);
      }
    };
  }
}
