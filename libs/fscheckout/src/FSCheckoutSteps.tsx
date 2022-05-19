import type { StatelessComponent } from 'react';
import React, { Component } from 'react';

import { Animated } from 'react-native';

import type StepManager from './StepManager';
import type { Step } from './types';

export interface FSCheckoutStepsProps {
  steps: Array<Step & { component: StatelessComponent<any> }>;
  activeStep: Step;
  stepManager: StepManager;
  checkoutState?: any;
  checkoutActions?: Record<string, any>;
  animated?: boolean;
}

export default class FSCheckoutSteps extends Component<FSCheckoutStepsProps> {
  private readonly animatedOpacity = new Animated.Value(1);
  private readonly animatedTranslateX = new Animated.Value(1);

  private readonly getAnimatedDirection = (prevStep: Step, currStep: Step) => {
    const prevStepIndex = this.props.steps.findIndex((step) => step.name === prevStep.name);
    const currStepIndex = this.props.steps.findIndex((step) => step.name === currStep.name);
    return currStepIndex > prevStepIndex ? 'left' : 'right';
  };

  public componentDidUpdate(prevProps: FSCheckoutStepsProps): void {
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

  public render(): JSX.Element | null {
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
          checkoutActions={this.props.checkoutActions}
          checkoutState={this.props.checkoutState}
          stepManager={this.props.stepManager}
        />
      </Animated.View>
    );
  }
}
