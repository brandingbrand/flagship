export default abstract class ApplePayBase {
  merchantIdentifier: string;

  constructor(merchantIdentifier: string) {
    this.merchantIdentifier = merchantIdentifier;
  }

  // Whether the user's device/browser supports Apple Pay
  abstract isEnabled(): boolean;

  // If Apple Pay permits the setup wizard to be invoked
  abstract canCallSetup(): boolean;

  // Whether the user has a credit card set up
  abstract hasActiveCard(): Promise<boolean>;

  // Function to invoke the Apple Pay setup wizard
  abstract setupApplePay(): Promise<boolean>;
}
