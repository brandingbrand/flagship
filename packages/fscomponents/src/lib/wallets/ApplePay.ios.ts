import { default as ApplePayBase } from './ApplePay.base';

export default class ApplePayIos extends ApplePayBase {
  isEnabled(): boolean {
    // TODO: implement
    return true;
  }

  canCallSetup(): boolean {
    // TODO: implement
    return false;
  }

  async hasActiveCard(): Promise<boolean> {
    // TODO: implement
    return Promise.resolve(true);
  }

  async setupApplePay(): Promise<boolean> {
    // TODO: implement
    return Promise.reject(new Error('setupApplePay Not Implemented'));
  }
}
