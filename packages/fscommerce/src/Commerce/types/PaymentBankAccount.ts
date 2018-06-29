/**
 * Information about a bank account used to make a payment for an order.
 */
export interface PaymentBankAccount {
  /**
   * The driver's license number of the customer making the payment.
   *
   * @example '113451341531413'
   */
  driversLicense?: string;

  /**
   * The last four digits of the customer's drivers license number
   *
   * @example '1413'
   */
  driversLicenseLastDigits?: string;

  /**
   * The two-digit state code of the customer's drivers license.
   *
   * @example 'PA'
   */
  driversLicenseStateCode: string;

  /**
   * The name of the holder of the bank account used to make payment.
   */
  holder: string;

  /**
   * The masked value of the customer's drivers license.
   *
   * @example 'XXXXXX1413'
   */
  maskedDriverLicense?: string;

  /**
   * The masked number of the bank account used to make payment.
   *
   * @example 'XXXXXXXX1234'
   */
  maskedNumber?: string;

  /**
   * The number of the bank account used to make payment.
   *
   * @example '1314133141234'
   */
  number?: string;

  /**
   * The last four digits of the bank account number used to make payment.
   *
   * @example '1234'
   */
  numberLastDigits?: string;
}
