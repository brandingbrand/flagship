import { CustomerAddress } from './CustomerAddress';
import { PaymentMethod } from './PaymentMethod';
import { Person } from './Person';

/**
 * The possible authentication states of a customer.
 */
export enum AuthType {
  /**
   * A customer without a registered account.
   */
  Guest,

  /**
   * A customer who has previously created an account.
   */
  Registered,
}

/**
 * Information about a user's saved account.
 */
export interface CustomerAccount extends Person {
  /**
   * An array of address objects that a customer has saved to their account.
   */
  addresses?: CustomerAddress[];

  /**
   * Whether the user authenticated as a guest or has previously registered.
   */
  authType?: AuthType;

  /**
   * The customer's birthday.
   *
   * @example '2011-05-06'
   */
  birthday?: Date;

  /**
   * The company that the customer is representing.
   *
   * @example 'Branding Brand'
   */
  companyName?: string;

  /**
   * The date in which the customer's account was created.
   *
   * @example '2018-04-11T15:06:11.097Z'
   */
  creationDate?: Date;

  /**
   * A unique identifier for the customer. For Demandware requests this value is a hash.
   *
   * @example 'ac2aGikBq3UsnLjNsq0mTAOvIh'
   */
  customerId?: string;

  /**
   * A secondary identifier for the customer.
   *
   * @example '135141'
   */
  customerNumber?: string;

  /**
   * A customer's e-mail address.
   *
   * @example 'test@example.com'
   */
  email: string;

  /**
   * Whether the customer's account is able to be accessed.
   */
  enabled?: boolean;

  /**
   * The fax number associated with the customer's account. This number shouldn't
   * contain dashes or other formatting characters.
   *
   * @example '7245555555'
   */
  fax?: string;

  /**
   * The customer's gender.
   */
  gender?: string | number;

  /**
   * The customer's job title.
   *
   * @example 'Software Engineer'
   */
  jobTitle?: string;

  /**
   * The date and time at which the customer last logged in.
   *
   * @example '2018-04-11T15:06:11.097Z'
   */
  lastLoginTime?: Date;

  /**
   * The date and time at which the customer last modified their account.
   *
   * @example '2018-04-11T15:06:11.097Z'
   */
  lastModified?: Date;

  /**
   * The date and time at which the customer last accessed the application.
   *
   * @example '2018-04-11T15:06:11.097Z'
   */
  lastVisitTime?: Date;

  /**
   * A customer's username for authentication.
   *
   * @example 'johndoe'
   */
  login: string;

  /**
   * A note associated with a customer's account.
   */
  note?: string;

  /**
   * An array of PaymentMethod objects. These represent saved credit cards or other
   * methods that a user added to their account.
   */
  paymentInstruments?: PaymentMethod[];

  /**
   * The customer's business phone number. This number shouldn't contain dashes or other
   * formatting characters.
   *
   * @example '7245555555'
   */
  phoneBusiness?: string;

  /**
   * The customer's home phone number. This number shouldn't contain dashes or other
   * formatting characters.
   *
   * @example '7245555555'
   */
  phoneHome?: string;

  /**
   * The customer's mobile phone number. This number shouldn't contain dashes or other
   * formatting characters.
   *
   * @example '7245555555'
   */
  phoneMobile?: string;

  /**
   * The customer's preferred locale.
   *
   * @example 'en_US'
   */
  preferredLocale?: string;

  /**
   * The date and time at which the user previously logged into the application.
   *
   * @example '2018-04-11T15:06:11.097Z'
   */
  previousLoginTime?: Date;

  /**
   * The date and time at which the user previously visited the application.
   *
   * @example '2018-04-11T15:06:11.097Z'
   */
  previousVisitTime?: Date;

  /**
   * The customer's title.
   *
   * @example 'Dr.'
   */
  title?: string;
}
