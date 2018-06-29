/**
 * Information about a specific card type that is accepted for payment.
 */
export interface ApplicablePaymentCard {
  /**
   * The type of a card.
   *
   * @example 'Visa'
   */
  cardType: string;

  /**
   * Whether checksum verification is enabled for a card.
   */
  checksumVerificationEnabled?: boolean;

  /**
   * A description for a card.
   */
  description?: string;

  /**
   * A location for an image to be used to visually identify a card.
   *
   * @example 'https://www.brandingbrand.com/images/visa.jpeg'
   */
  image?: string;

  /**
   * A title for a card.
   */
  name: string;

  /**
   * An array of valid lengths of account numbers for a card.
   *
   * @example ['16']
   */
  numberLengths?: string[];

  /**
   * An array of numbers that are valid prefixes for a card.
   *
   * @example ['4']
   */
  numberPrefixes?: string[];

  /**
   * The length of valid security codes for a card.
   *
   * @example 3
   */
  securityCodeLength?: number;
}

/**
 * Information about a type of payment that is accepted for an order.
 */
export interface ApplicablePayment {
  /**
   * An identifier for the payment type.
   *
   * @example 'ccard'
   */
  id: string;

  /**
   * A location for an image used to visually identify a payment type.
   *
   * @example 'https://www.brandingbrand.com/images/creditCard.jpeg'
   */
  image?: string;

  /**
   * The name of a payment type.
   *
   * @example 'Credit Card'
   */
  name: string;

  /**
   * The description of a payment type.
   */
  description?: string;

  /**
   * An array of card types that are valid for a specific payment type.
   */
  cards?: ApplicablePaymentCard[];
}
