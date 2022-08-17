import type { ComponentClass, StatelessComponent } from 'react';
import React, { Component } from 'react';

import type { StyleProp, ViewStyle } from 'react-native';
import { ActivityIndicator, BackHandler, ScrollView, StyleSheet, View } from 'react-native';

import FSCheckoutSteps from './FSCheckoutSteps';
import StepManager from './StepManager';
import type { StepTrackerProps } from './components/StepTracker';
import StepTracker from './components/StepTracker';
import type { Omit, Step } from './types';

const styles = StyleSheet.create({
  constainer: {
    flex: 1,
  },
  hide: {
    display: 'none',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingInner: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 5,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
});

export interface FSCheckoutProps {
  /**
   * An array description of all checkout steps. Component, identifer, display
   * name and status.
   *
   * @example [{
   *   name: 'shipping',
   *   displayName: 'Shipping',
   *   status: 'active',
   *   component: StepShipping
   * }]
   */
  steps: Array<Step & { component: StatelessComponent<unknown> }>;

  /**
   * Your entire checkout state; this usually is `this.state`
   * It includes checkout data from api, and internal states like
   * `isSameAsShipping`, form values, selected checkbox value for
   * shipping methods and payment methods
   */
  checkoutState: unknown;

  /**
   * An object that defines checkout actions that interact with
   * checkout state. This is usually where you make a request to
   * the API and update checkout state, or update your internal
   * state like changing selected shipping method.
   */
  checkoutActions: Record<string, unknown>;

  /**
   * A flag to turn on/off global loading view. The loading view
   * masks the user interaction, and you can use custom render to
   * override it.
   */
  isLoading?: boolean;

  /**
   * An event hook for registering listener on step changes. This
   * can be useful for analytics tracking of each step's page view.
   */
  onStepChange?: (prevSteps: Step[], nextSteps: Step[]) => void;

  /**
   * Function to get a reference to step manager; you can use the
   * reference to jump to any step. This is useful when you want
   * to jump to the last step of checkout when user is logged in or
   * with an existing checkout session.
   */
  stepManagerRef?: (ref: StepManager) => void;

  /**
   * Function to get a reference to ScrollView; you can use the
   * reference to scroll to certain positions on the page.
   */
  scrollViewRef?: (ref: unknown) => void;

  /**
   * Function to filter which steps you want to show in the step
   * trackers. This is usually used to hide the sign in and receipt
   * steps in the step tracker.
   */
  filterStepTracker?: (step: Step) => boolean;

  /**
   * Custom render function for loading view. Used to override
   * the built-in loading view.
   */
  renderLoading?: (isLoading?: boolean) => JSX.Element;

  /**
   * Custom render function for step tracker. Used to override
   * the built-in step tracker.
   */
  renderStepTracker?: (steps: Step[], activeStep: Step) => JSX.Element;

  /**
   * Extra props that you want to pass to the underlying StepTracker
   * component. You usually want to use this to style the StepTracker
   * when you don't want roll out your own.
   */
  StepTrackerProps?: Omit<StepTrackerProps, 'steps'>;

  /**
   * Style for container view of the checkout; you can use this when you want
   * to change the global margin or background.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Component class for using custom scroll view; this can be used to replace
   * ScrollView with a regular View.
   */
  CustomScrollView?: ComponentClass<unknown>;

  /**
   * Extra props to pass to ScrollView or CustomScrollView
   */
  ScrollViewProps?: unknown;

  /**
   * Flag to turn on/off the animation.
   */
  animated?: boolean;
}

/**
 * Interface that can be used by the project to standardize the props for
 * each step component.
 */
export interface FSCheckoutStepProps<CheckoutActions, CheckoutState> {
  checkoutState: CheckoutState;
  checkoutActions: CheckoutActions;
  stepManager: StepManager;
}

/**
 * Step's status is managed internally be the `StepManager`; project can also modify it
 * by using the reference of step manager with `stepManagerRef`.
 */
export interface FSCheckoutState {
  steps: Step[];
}

export default class FSCheckout extends Component<FSCheckoutProps, FSCheckoutState> {
  constructor(props: FSCheckoutProps) {
    super(props);
    this.stepManager = new StepManager(
      props.steps.map((step) => ({
        name: step.name,
        displayName: step.displayName,
        status: step.status,
      }))
    );

    this.stepManager.onChange((nextSteps: Step[]) => {
      if (this.props.onStepChange) {
        this.props.onStepChange(this.state.steps, nextSteps);
      }
      this.setState({ steps: nextSteps });
    });

    this.state = {
      steps: this.stepManager.steps,
    };

    if (props.stepManagerRef) {
      props.stepManagerRef(this.stepManager);
    }
  }

  private readonly stepManager: StepManager;

  private readonly handleAndroidBackButton = () => {
    if (this.stepManager.back()) {
      // stop propagate
      return true;
    }
    return false;
  };

  private readonly renderContent = (activeStep: Step) => {
    const CustomScrollView = this.props.CustomScrollView || ScrollView;

    return (
      <CustomScrollView ref={this.props.scrollViewRef} {...(this.props.ScrollViewProps as object)}>
        <FSCheckoutSteps
          activeStep={activeStep}
          animated={this.props.animated}
          checkoutActions={this.props.checkoutActions}
          checkoutState={this.props.checkoutState}
          stepManager={this.stepManager}
          steps={this.props.steps}
        />
      </CustomScrollView>
    );
  };

  private readonly renderStepTracker = (activeStep: Step) => {
    if (this.props.renderStepTracker) {
      return this.props.renderStepTracker(this.state.steps, activeStep);
    }

    const stepsFoIndicators = this.props.filterStepTracker
      ? this.state.steps.filter(this.props.filterStepTracker)
      : this.state.steps;
    const shouldShowStepTracker = stepsFoIndicators.find((step) => step.name === activeStep.name);

    if (!shouldShowStepTracker) {
      return null;
    }

    return (
      <StepTracker
        animated={this.props.animated}
        steps={stepsFoIndicators}
        {...this.props.StepTrackerProps}
      />
    );
  };

  private readonly renderLoading = ({ isLoading }: { isLoading: boolean }) => {
    if (this.props.renderLoading) {
      return this.props.renderLoading(isLoading);
    }

    return (
      <View style={[styles.loadingContainer, !isLoading && styles.hide]}>
        <View style={[styles.loadingInner, !isLoading && styles.hide]}>
          <ActivityIndicator color="white" />
        </View>
      </View>
    );
  };

  public componentDidMount(): void {
    BackHandler.addEventListener('hardwareBackPress', this.handleAndroidBackButton);
  }

  public componentWillUnmount(): void {
    BackHandler.removeEventListener('hardwareBackPress', this.handleAndroidBackButton);
  }

  public render(): JSX.Element {
    const activeStep = this.stepManager.getActive() || this.props.steps[0];
    if (!activeStep) {
      return <React.Fragment />;
    }

    return (
      <View style={[styles.constainer, this.props.style]}>
        {this.renderStepTracker(activeStep)}
        {this.renderContent(activeStep)}
        {this.renderLoading({ isLoading: Boolean(this.props.isLoading) })}
      </View>
    );
  }
}

export { type Step } from './types';
export { default as StepManager } from './StepManager';
