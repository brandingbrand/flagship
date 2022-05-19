import { default as ApplePayBase } from './ApplePay.base';

export interface ApplePaySession {
  openPaymentSetup: (identifier: string) => Promise<boolean>;
  canMakePaymentsWithActiveCard: (identifier: string) => Promise<boolean>;
}

export type WindowApplePay = Window & {
  ApplePaySession?: ApplePaySession;
};

export default class ApplePayWeb extends ApplePayBase {
  constructor(merchantIdentifier: string) {
    super(merchantIdentifier);

    this.theWindow = window as WindowApplePay;
  }

  private readonly theWindow: WindowApplePay;

  public isEnabled(): boolean {
    return this.theWindow && Boolean(this.theWindow.ApplePaySession);
  }

  public canCallSetup(): boolean {
    return Boolean(this.theWindow && this.theWindow.ApplePaySession?.openPaymentSetup);
  }

  public async hasActiveCard(): Promise<boolean> {
    if (this.theWindow && this.theWindow.ApplePaySession) {
      const { ApplePaySession } = this.theWindow;

      return ApplePaySession.canMakePaymentsWithActiveCard(this.merchantIdentifier);
    }
    throw new Error('Apple Pay is not enabled on this device.');
  }

  public async setupApplePay(): Promise<boolean> {
    if (this.theWindow && this.theWindow.ApplePaySession) {
      const { ApplePaySession } = this.theWindow;

      return ApplePaySession.openPaymentSetup(this.merchantIdentifier);
    }
    throw new Error('Apple Pay is not enabled on this device.');
  }
}
