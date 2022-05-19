import type { FunctionComponent } from 'react';
import React, { memo } from 'react';

import type { ImageStyle, ImageURISource, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Image, StyleSheet, Text, View } from 'react-native';

import checkIcon from '../../assets/images/check.png';
import { palette } from '../styles/variables';

import { Step } from './Step';

export interface IdStep {
  id: number;
  name: string;
}

export interface SerializableStepIndicatorProps {
  completedStyle?: ViewStyle;
  completedTextStyle?: TextStyle;
  completedIconStyle?: ImageStyle;
  incompleteStyle?: ViewStyle;
  incompleteTextStyle?: TextStyle;
  incompleteIconStyle?: ImageStyle;
  currentStyle?: ViewStyle;
  currentStep: number;
  currentTextStyle?: TextStyle;
  defaultStyle?: ViewStyle;
  defaultTextStyle?: TextStyle;
  style?: ViewStyle;
  stepTitles: Array<IdStep | string>;
  line?: boolean;
}

export interface StepIndicatorProps
  extends Omit<
    SerializableStepIndicatorProps,
    | 'completedIconStyle'
    | 'completedStyle'
    | 'completedTextStyle'
    | 'currentStyle'
    | 'currentTextStyle'
    | 'defaultStyle'
    | 'defaultTextStyle'
    | 'style'
  > {
  completedStyle?: StyleProp<ViewStyle>;
  completedTextStyle?: StyleProp<TextStyle>;
  completedIcon?: ImageURISource;
  completedIconStyle?: StyleProp<ImageStyle>;
  currentStyle?: StyleProp<ViewStyle>;
  currentTextStyle?: StyleProp<TextStyle>;
  defaultStyle?: StyleProp<ViewStyle>;
  defaultTextStyle?: StyleProp<TextStyle>;
  onStepPressed?: (step: number, title: string) => void;
  style?: StyleProp<ViewStyle>;

  // Renders
  renderComplete?: (step: IdStep | string) => JSX.Element;
  renderActive?: (step: IdStep | string) => JSX.Element;
  renderIncomplete?: (step: IdStep | string) => JSX.Element;
}

const styles = StyleSheet.create({
  active: {
    alignItems: 'center',
    backgroundColor: palette.secondary,
    borderRadius: 50,
    display: 'flex',
    flexDirection: 'row',
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  activeNumber: {
    color: palette.onPrimary,
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  activeTitleStyles: {
    color: palette.secondary,
    fontWeight: '600',
  },
  complete: {
    alignItems: 'center',
    backgroundColor: palette.background,
    borderColor: palette.primary,
    borderRadius: 50,
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  completeImage: {
    height: 16,
    width: 16,
  },
  container: {
    alignSelf: 'stretch',
    flexDirection: 'row',
  },
  incomplete: {
    alignItems: 'center',
    backgroundColor: palette.secondary,
    borderRadius: 50,
    display: 'flex',
    flexDirection: 'row',
    height: 11,
    justifyContent: 'center',
    width: 11,
  },
  incompleteCircle: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    height: 30,
  },
  indicatorTitle: {
    color: palette.secondary,
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: 0.5,
    position: 'absolute',
    top: '100%',
  },
  indicatorWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  largeContainer: {
    flex: 1,
    paddingBottom: 45,
    paddingHorizontal: 40,
    paddingTop: 10,
  },
  line: {
    backgroundColor: palette.secondary,
    flex: 1,
    height: 1,
  },
  lineActive: {
    backgroundColor: palette.secondary,
  },
  stepContainer: {
    flex: 1,
  },
  stepIndicatorContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wrap: {
    display: 'flex',
    position: 'relative',
  },
});

/**
 * StepIndicator component for displaying a series of steps in their completed state
 */
export const StepIndicator: FunctionComponent<StepIndicatorProps> = memo((props): JSX.Element => {
  const { currentStep, stepTitles } = props;

  const stepPressed =
    (index: number, title: string): (() => void) =>
    () => {
      if (props.onStepPressed) {
        props.onStepPressed(index, title);
      }
    };

  const renderStep = (step: IdStep | string, index: number): JSX.Element => {
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

    const stepTitle = typeof step === 'string' ? step : `${step.id}. ${step.name}`;

    return (
      <Step
        completed={completed}
        completedIcon={props.completedIcon}
        completedIconStyle={props.completedIconStyle}
        key={`step-indicator-step-${index}`}
        onPress={stepPressed(index, stepTitle)}
        stepNumber={index + 1}
        style={stepStyle}
        title={stepTitle}
        titleStyle={textStyle}
      />
    );
  };

  const ownRenderComplete = (step: IdStep | string): JSX.Element => {
    if (props.renderComplete) {
      return props.renderComplete(step);
    }

    return (
      <View style={[styles.complete, props.completedStyle]}>
        <Image resizeMode="contain" source={checkIcon} style={styles.completeImage} />
      </View>
    );
  };

  const ownRenderActive = (step: IdStep | string): JSX.Element => {
    if (props.renderActive) {
      return props.renderActive(step);
    }

    return (
      <View style={[styles.active, props.currentStyle]}>
        <Text style={styles.activeNumber}>{typeof step === 'string' ? step : step.id}</Text>
      </View>
    );
  };

  const ownRenderIncomplete = (step: IdStep | string): JSX.Element => {
    if (props.renderIncomplete) {
      return props.renderIncomplete(step);
    }

    return (
      <View style={styles.incompleteCircle}>
        <View style={[styles.incomplete, props.incompleteStyle]} />
      </View>
    );
  };

  const renderStepIndicator = (step: IdStep | string, index: number): JSX.Element => {
    const isActive = index === currentStep;
    const isComplete = index < currentStep;
    const isIncomplete = index > currentStep;
    const isLast = index === stepTitles.length - 1;

    return (
      <React.Fragment>
        <View key={index} style={styles.indicatorWrap}>
          <View style={styles.wrap}>
            {isComplete && ownRenderComplete(step)}
            {isActive && ownRenderActive(step)}
            {isIncomplete && ownRenderIncomplete(step)}
          </View>
          <Text
            style={[
              styles.indicatorTitle,
              props.defaultTextStyle,
              isActive && styles.activeTitleStyles,
              isActive && props.currentTextStyle,
            ]}
          >
            {typeof step === 'string' ? step : step.name}
          </Text>
        </View>
        {!isLast && <View style={[styles.line, isComplete && styles.lineActive]} />}
      </React.Fragment>
    );
  };

  if (props.line) {
    return (
      <View style={[styles.largeContainer, props.style]}>
        <View style={styles.stepIndicatorContainer}>
          {props.stepTitles.map(renderStepIndicator)}
        </View>
      </View>
    );
  }

  return <View style={[styles.container, props.style]}>{props.stepTitles.map(renderStep)}</View>;
});
