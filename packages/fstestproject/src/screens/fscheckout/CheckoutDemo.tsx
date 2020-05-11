import React, { Component } from 'react';
import { Navigation } from 'react-native-navigation';
import { FSCheckout, FSCheckoutStepProps, Step, StepManager } from '@brandingbrand/fscheckout';
import { CheckoutDataType, datasource } from './datasource';
import StepShipping from './StepShipping';
import StepPayment from './StepPayment';
import StepReview from './StepReview';
import StepReceipt from './StepReceipt';
import StepSignIn from './StepSignIn';

export interface CheckoutDemoState {
  checkoutData: CheckoutDataType;
  address: string;
  payment: string;
  useShippingAsBilling: boolean;
  isLoading: boolean;
}

export interface CheckoutActions {
  fetchCheckoutData: () => Promise<void>;
  submitShipping: () => Promise<void>;
  submitPayment: () => Promise<void>;
  placeOrder: () => Promise<void>;
  exitCheckout: () => void;
  showLoading: () => void;
  hideLoading: () => void;
  updateAddress: (address: string) => void;
  updatePayment: (payment: string) => void;
  handleError: (error: Error) => void;
  getShippingFormRef: (ref: any) => void;
}

export interface StepProps extends FSCheckoutStepProps<CheckoutActions, CheckoutDemoState> {}

export default class CheckoutDemo extends Component<CheckoutDemoState> {
  shippingFormRef?: any;
  stepManager?: StepManager;
  state: CheckoutDemoState = {
    checkoutData: {},
    address: '',
    payment: '',
    useShippingAsBilling: true,
    isLoading: false
  };

  checkoutActions: CheckoutActions = {
    fetchCheckoutData: async () => {
      this.checkoutActions.showLoading();
      this.setState({
        checkoutData: await datasource.startCheckout()
      });
      this.checkoutActions.hideLoading();
    },

    submitShipping: async () => {
      if (!this.state.address) {
        throw new Error('address is required');
      }

      this.checkoutActions.showLoading();
      this.setState({
        checkoutData: await datasource.addShipping(this.state.address)
      });
      this.checkoutActions.hideLoading();
    },

    submitPayment: async () => {
      if (!this.state.payment) {
        throw new Error('payment is required');
      }

      this.checkoutActions.showLoading();
      this.setState({
        checkoutData: await datasource.addPayment(this.state.payment)
      });
      this.checkoutActions.hideLoading();
    },

    placeOrder: async () => {
      this.checkoutActions.showLoading();
      this.setState({
        checkoutData: await datasource.placeOrder()
      });
      this.checkoutActions.hideLoading();
    },

    exitCheckout: () => {
      Navigation.dismissAllModals()
      .catch(err => console.warn('exitCheckout DISMISSALLMODALS error: ', err));
    },

    showLoading: () => {
      this.setState({ isLoading: true });
    },

    hideLoading: () => {
      this.setState({ isLoading: false });
    },

    updateAddress: address => {
      this.setState({ address });
    },

    updatePayment: payment => {
      this.setState({ payment });
    },

    handleError: error => {
      alert(error.message);
    },

    getShippingFormRef: ref => {
      if (ref) {
        ref.focus();
      }
    }
  };

  componentDidMount(): void {
    this.checkoutActions.fetchCheckoutData()
      .catch(err => {
        console.warn('Error loading checkout data', err);
      });
  }

  filterStepTracker = (step: Step) => ['signin', 'receipt'].indexOf(step.name) === -1;

  render(): JSX.Element {
    return (
      <FSCheckout
        isLoading={this.state.isLoading}
        checkoutState={this.state}
        checkoutActions={this.checkoutActions}
        filterStepTracker={this.filterStepTracker}
        animated={true}
        StepTrackerProps={{
          itemStyle: { backgroundColor: 'rgba(0,0,0,0.1)' },
          titleStyle: { color: '#000' },
          titleActiveStyle: { color: 'red' },
          titleDoneStyle: { color: 'red' },
          checkStyle: { color: 'red' },
          sliderStyle: { backgroundColor: 'red' }
        }}
        steps={[
          {
            name: 'signin',
            displayName: 'Sign In',
            status: 'active',
            component: StepSignIn
          },
          {
            name: 'shipping',
            displayName: 'Shipping',
            status: 'pending',
            component: StepShipping
          },
          {
            name: 'payment',
            displayName: 'Payment',
            status: 'pending',
            component: StepPayment
          },
          {
            name: 'review',
            displayName: 'Review',
            status: 'pending',
            component: StepReview
          },
          {
            name: 'receipt',
            displayName: 'Receipt',
            status: 'pending',
            component: StepReceipt
          }
        ]}
      />
    );
  }
}
