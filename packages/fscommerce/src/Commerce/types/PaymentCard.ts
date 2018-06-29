/**
 * Information about a credit, debit, or loyalty card used to make payment against an order.
 */
export interface PaymentCard {
  /**
   * Identifier for the type of card used to make payment.
   *
   * @example 'VISA'
   */
  cardType?: string;

  /**
   * Whether the card is expired.
   */
  creditCardExpired?: boolean;

  /**
   * A tokenized representation of a card allowing for secure storage of card information during
   * a transaction.
   */
  creditCardToken?: string;

  /**
   * The one- or two-digit month of year in which the card expires.
   *
   * @example 3
   */
  expirationMonth: number;

  /**
   * The four-digit year in which the card expires.
   *
   * @example '2001'
   */
  expirationYear: number;

  /**
   * The name of the person who wholds the account for the card.
   *
   * @example 'Test User'
   */
  holder?: string;

  /**
   * A value indicating the number of times that a card has been re-issued. This
   * is most typically found on cards issued within the United Kingdom.
   *
   * @example '01'
   */
  issueNumber?: string;

  /**
   * The masked account number of the card.
   *
   * @example 'XXXXXXXXXXXX1234'
   */
  maskedNumber?: string;

  /**
   * The account number of the card.
   *
   * @example '1234123412341234'
   */
  number?: string;

  /**
   * The last four digits of the account number of the card.
   *
   * @example '1234'
   */
  numberLastDigits?: string;

  /**
   * The security code of the card.
   *
   * @example '123'
   */
  securityCode?: string;

  /**
   * The one- or two-digit month of year in which the card was issued.
   *
   * @example '3'
   */
  validFromMonth?: number;

  /**
   * The four-digit year in which the card was issued.
   *
   * @example '2001'
   */
  validFromYear?: number;
}
