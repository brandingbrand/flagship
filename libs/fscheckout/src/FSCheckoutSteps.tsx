import React, { Component, StatelessComponent } from 'react';
import { Animated } from 'react-native';
import StepManager from './StepManager';
import { Step } from './types';

export interface FSCheckoutStepsProps {
  steps: (Step & { component: StatelessComponent<any> })[];
  activeStep: Step;
  stepManager: StepManager;
  checkoutState?: any;
  checkoutActions?: { [key: string]: any };
  animated?: boolean;
}

export default class FSCheckoutSteps extends Component<FSCheckoutStepsProps> {
  animatedOpacity: Animated.Value;
  animatedTranslateX: Animated.Value;

  constructor(props: FSCheckoutStepsProps) {
    super(props);
    this.animatedOpacity = new Animated.Value(1);
    this.animatedTranslateX = new Animated.Value(1);
  }

  componentDidUpdate(prevProps: FSCheckoutStepsProps): void {
    if (prevProps.activeStep !== this.props.activeStep) {
      const direciton = this.getAnimatedDirection(prevProps.activeStep, this.props.activeStep);

      this.animatedOpacity.setValue(0);
      this.animatedTranslateX.setValue(direciton === 'left' ? 30 : -30);

      Animated.parallel([
        Animated.timing(this.animatedOpacity, {
          useNativeDriver: true,
          duration: 300,
          toValue: 1,
        }),
        Animated.timing(this.animatedTranslateX, {
          useNativeDriver: true,
          duration: 300,
          toValue: 0,
        }),
      ]).start();
    }
  }

  getAnimatedDirection = (prevStep: Step, currStep: Step) => {
    const prevStepIndex = this.props.steps.findIndex((step) => step.name === prevStep.name);
    const currStepIndex = this.props.steps.findIndex((step) => step.name === currStep.name);
    return currStepIndex > prevStepIndex ? 'left' : 'right';
  };

  render(): JSX.Element | null {
    if (!this.props.activeStep) {
      return null;
    }

    const activeStepObject = this.props.steps.find(
      (step) => step.name === this.props.activeStep.name
    );

    if (!activeStepObject) {
      return null;
    }

    const animatedStyle = this.props.animated
      ? {
          opacity: this.animatedOpacity,
          transform: [{ translateX: this.animatedTranslateX }],
        }
      : null;

    return (
      <Animated.View style={animatedStyle}>
        <activeStepObject.component
          checkoutState={this.props.checkoutState}
          checkoutActions={this.props.checkoutActions}
          stepManager={this.props.stepManager}
        />
      </Animated.View>
    );
  }
}
