import { default as ApplePayBase } from './ApplePay.base';

export default class ApplePay extends ApplePayBase {
  isEnabled(): boolean {
    return false;
  }

  canCallSetup(): boolean {
    return false;
  }

  async hasActiveCard(): Promise<any> {
    return Promise.reject(new Error('hasActiveCard Not Implemented'));
  }

  async setupApplePay(): Promise<any> {
    // TODO: implement
    return Promise.reject(new Error('setupApplePay Not Implemented'));
  }
}
