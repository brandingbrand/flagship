import { Person } from './Person';

/**
 * Information about an address.
 */
export interface Address extends Person {
  /**
   * An identifier for an address.
   *
   * @example '135141'
   */
  id?: string;

  /**
   * The first line of an address, typically comprised of street number and name.
   *
   * @example '2313 E Carson St'
   */
  address1: string;

  /**
   * The second line of an address. This is typically P.O. box, apartment number, or similar.
   *
   * @example 'Suite 100'
   */
  address2?: string;

  /**
   * The city of an address.
   *
   * @example 'Pittsburgh'
   */
  city: string;

  /**
   * The company name of an address.
   *
   * @example 'Branding Brand'
   */
  companyName?: string;

  /**
   * The address' two-character ISO 3166 country code.
   *
   * @see https://www.iso.org/iso-3166-country-codes.html
   * @example 'US'
   */
  countryCode: string;

  /**
   * The full name of a person associated with an address.
   *
   * @example 'Alex Trebek'
   */
  fullName?: string;

  /**
   * The job title of a person associated with an address.
   *
   * @example 'Software Engineer'
   */
  jobTitle?: string;

  /**
   * The phone number of a person associated with an address. This number should not contain
   * dashes or other formatting characters.
   *
   * @example '7245555555'
   */
  phone?: string;

  /**
   * A P.O. box number for an address.
   *
   * @example '15314'
   */
  postBox?: string;

  /**
   * The postal code of an address.
   *
   * @example '15203'
   */
  postalCode: string;

  /**
   * Two-digit state code for an address.
   *
   * @example 'PA'
   */
  stateCode: string;

  /**
   * The suite associated with an address.
   *
   * @example '100'
   */
  suite?: string;

  /**
   * A title given to the address, typically used when saving addresses to an account.
   *
   * @example 'Work'
   */
  title?: string;
}
