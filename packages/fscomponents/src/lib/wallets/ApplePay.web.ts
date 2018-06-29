import { default as ApplePayBase } from './ApplePay.base';

export default class ApplePayWeb extends ApplePayBase {
  theWindow: any;

  constructor(merchantIdentifier: string) {
    super(merchantIdentifier);

    this.theWindow = window;
  }

  isEnabled(): boolean {
    return this.theWindow && this.theWindow.ApplePaySession;
  }

  canCallSetup(): boolean {
    return this.theWindow
      && this.theWindow.ApplePaySession
      && this.theWindow.ApplePaySession.openPaymentSetup;
  }

  async hasActiveCard(): Promise<boolean> {
    if (this.theWindow && this.theWindow.ApplePaySession) {
      const ApplePaySession = this.theWindow.ApplePaySession;

      return ApplePaySession.canMakePaymentsWithActiveCard(this.merchantIdentifier);
    } else {
      return Promise.reject(new Error('Apple Pay is not enabled on this device.'));
    }
  }

  async setupApplePay(): Promise<boolean> {
    if (this.theWindow && this.theWindow.ApplePaySession) {
      const ApplePaySession = this.theWindow.ApplePaySession;

      return ApplePaySession.openPaymentSetup(this.merchantIdentifier);
    } else {
      return Promise.reject(new Error('Apple Pay is not enabled on this device.'));
    }
  }
}
