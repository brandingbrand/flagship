import { default as ApplePayBase } from './ApplePay.base';

export default class ApplePayIos extends ApplePayBase {
  public isEnabled(): boolean {
    // TODO: implement
    return true;
  }

  public canCallSetup(): boolean {
    // TODO: implement
    return false;
  }

  public async hasActiveCard(): Promise<boolean> {
    // TODO: implement
    return true;
  }

  public async setupApplePay(): Promise<boolean> {
    // TODO: implement
    throw new Error('setupApplePay Not Implemented');
  }
}
