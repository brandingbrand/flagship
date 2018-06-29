/**
 * Information about a person.
 */
export interface Person {
  /**
   * A person's given name.
   *
   * @example 'Alex'
   */
  firstName: string;

  /**
   * A person's surname.
   *
   * @example 'Trebek'
   */
  lastName: string;

  /**
   * A term used to address a person.
   *
   * @example 'Mr.'
   */
  salutation?: string;

  /**
   * A person's middle name or initial.
   *
   * @example 'G'
   */
  secondName?: string;

  /**
   * The suffix of a person's name.
   *
   * @example 'Jr.'
   */
  suffix?: string;
}
