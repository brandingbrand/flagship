import React, { FunctionComponent, memo } from 'react';
import {
  Image,
  ImageStyle,
  ImageURISource,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { Step } from './Step';
import { palette } from '../styles/variables';

const checkIcon = require('../../assets/images/check.png');

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
  stepTitles: (string | IdStep)[];
  line?: boolean;
}

export interface StepIndicatorProps extends Omit<SerializableStepIndicatorProps,
  'completedStyle' |
  'completedTextStyle' |
  'completedIconStyle' |
  'currentStyle' |
  'currentTextStyle' |
  'defaultStyle' |
  'defaultTextStyle' |
  'style'
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
  renderComplete?: (step: string | IdStep) => JSX.Element;
  renderActive?: (step: string | IdStep) => JSX.Element;
  renderIncomplete?: (step: string | IdStep) => JSX.Element;
}

const styles = StyleSheet.create({
  largeContainer: {
    flex: 1,
    paddingHorizontal: 40,
    paddingBottom: 45,
    paddingTop: 10
  },
  stepIndicatorContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  indicatorWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  indicatorTitle: {
    position: 'absolute',
    top: '100%',
    fontWeight: '400',
    color: palette.secondary,
    fontSize: 13,
    letterSpacing: 0.5
  },
  complete: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: palette.primary,
    backgroundColor: palette.background
  },
  completeImage: {
    width: 16,
    height: 16
  },
  line: {
    height: 1,
    flex: 1,
    backgroundColor: palette.secondary
  },
  lineActive: {
    backgroundColor: palette.secondary
  },
  active: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    backgroundColor: palette.secondary,
    borderRadius: 50
  },
  activeNumber: {
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.5,
    color: palette.onPrimary
  },
  incompleteCircle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 30
  },
  incomplete: {
    width: 11,
    height: 11,
    borderRadius: 50,
    backgroundColor: palette.secondary,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  wrap: {
    position: 'relative',
    display: 'flex'
  },
  activeTitleStyles: {
    fontWeight: '600',
    color: palette.secondary
  },
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
  const {
    stepTitles,
    currentStep
  } = props;

  const stepPressed = (index: number, title: string): () => void => {
    return () => {
      if (props.onStepPressed) {
        props.onStepPressed(index, title);
      }
    };
  };

  const renderStep = (step: string | IdStep, index: number): JSX.Element => {
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

    const stepTitle = typeof step === 'string' ? step : step.id + '. ' + step.name;

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

  const ownRenderComplete = (step: string | IdStep): JSX.Element => {
    if (props.renderComplete) {
      return props.renderComplete(step);
    }

    return (
      <View style={[styles.complete, props.completedStyle]}>
        <Image
          style={styles.completeImage}
          source={checkIcon}
          resizeMode={'contain'}
        />
      </View>
    );
  };

  const ownRenderActive = (step: string | IdStep): JSX.Element => {
    if (props.renderActive) {
      return props.renderActive(step);
    }

    return (
      <View style={[styles.active, props.currentStyle]}>
        <Text style={styles.activeNumber}>
          {typeof step === 'string' ? step : step.id}
        </Text>
      </View>
    );
  };

  const ownRenderIncomplete = (step: string | IdStep): JSX.Element => {
    if (props.renderIncomplete) {
      return props.renderIncomplete(step);
    }

    return (
      <View style={[styles.incompleteCircle]}>
        <View style={[styles.incomplete, props.incompleteStyle]} />
      </View>
    );
  };

  const renderStepIndicator = (
    step: string | IdStep,
    index: number
  ): JSX.Element => {
    const isActive = index === currentStep;
    const isComplete = index < currentStep;
    const isIncomplete = index > currentStep;
    const isLast = index === stepTitles.length - 1;

    return (
      <>
        <View key={index} style={[styles.indicatorWrap]}>
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
              isActive && props.currentTextStyle
            ]}
          >
            {typeof step === 'string' ? step : step.name}
          </Text>
        </View>
        {!isLast && (
          <View style={[styles.line, isComplete && styles.lineActive]} />
        )}
      </>
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

  return (
    <View style={[styles.container, props.style]}>
      {props.stepTitles.map(renderStep)}
    </View>
  );
});
