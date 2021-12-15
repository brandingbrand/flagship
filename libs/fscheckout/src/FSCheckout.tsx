import React, { Component, ComponentClass, StatelessComponent } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import StepManager from './StepManager';
import StepTracker, { StepTrackerProps } from './components/StepTracker';
import FSCheckoutSteps from './FSCheckoutSteps';
import { Omit, Step } from './types';

const styles = StyleSheet.create({
  constainer: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingInner: {
    width: 50,
    height: 50,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hide: {
    display: 'none',
  },
});

export interface FSCheckoutProps {
  /**
   * An array description of all checkout steps. Component, identifer, display
   * name and status.
   * @example [{
   *   name: 'shipping',
   *   displayName: 'Shipping',
   *   status: 'active',
   *   component: StepShipping
   * }]
   */
  steps: (Step & { component: StatelessComponent<any> })[];

  /**
   * Your entire checkout state; this usually is `this.state`
   * It includes checkout data from api, and internal states like
   * `isSameAsShipping`, form values, selected checkbox value for
   * shipping methods and payment methods
   */
  checkoutState: any;

  /**
   * An object that defines checkout actions that interact with
   * checkout state. This is usually where you make a request to
   * the API and update checkout state, or update your internal
   * state like changing selected shipping method.
   */
  checkoutActions: { [key: string]: any };

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
  scrollViewRef?: (ref: any) => void;

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
  CustomScrollView?: ComponentClass<any>;

  /**
   * Extra props to pass to ScrollView or CustomScrollView
   */
  ScrollViewProps?: any;

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

export { StepManager, Step };
export default class FSCheckout extends Component<FSCheckoutProps, FSCheckoutState> {
  stepManager: StepManager;

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

  componentDidMount(): void {
    BackHandler.addEventListener('hardwareBackPress', this.handleAndroidBackButton);
  }

  componentWillUnmount(): void {
    BackHandler.removeEventListener('hardwareBackPress', this.handleAndroidBackButton);
  }

  handleAndroidBackButton = () => {
    if (this.stepManager.back()) {
      // stop propagate
      return true;
    } else {
      return false;
    }
  };

  render(): JSX.Element {
    const activeStep = this.stepManager.getActive() || this.props.steps[0];

    return (
      <View style={[styles.constainer, this.props.style]}>
        {this.renderStepTracker(activeStep)}
        {this.renderContent(activeStep)}
        {this.renderLoading({ isLoading: !!this.props.isLoading })}
      </View>
    );
  }

  renderContent = (activeStep: Step) => {
    const CustomScrollView = this.props.CustomScrollView || ScrollView;

    return (
      <CustomScrollView ref={this.props.scrollViewRef} {...this.props.ScrollViewProps}>
        <FSCheckoutSteps
          activeStep={activeStep}
          steps={this.props.steps}
          stepManager={this.stepManager}
          checkoutState={this.props.checkoutState}
          checkoutActions={this.props.checkoutActions}
          animated={this.props.animated}
        />
      </CustomScrollView>
    );
  };

  renderStepTracker = (activeStep: Step) => {
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
        steps={stepsFoIndicators}
        animated={this.props.animated}
        {...this.props.StepTrackerProps}
      />
    );
  };

  renderLoading = ({ isLoading }: { isLoading: boolean }) => {
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
}
