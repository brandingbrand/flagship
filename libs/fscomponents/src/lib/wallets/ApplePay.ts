import { default as ApplePayBase } from './ApplePay.base';

export default class ApplePay extends ApplePayBase {
  public isEnabled(): boolean {
    return false;
  }

  public canCallSetup(): boolean {
    return false;
  }

  public async hasActiveCard(): Promise<boolean> {
    throw new Error('hasActiveCard Not Implemented');
  }

  public async setupApplePay(): Promise<boolean> {
    // TODO: implement
    throw new Error('setupApplePay Not Implemented');
  }
}
