/**
 * Document representing a customer product list registrant.
 */
export interface CustomerProductListRegistrant {
  /**
   * The email of the registrant.
   */
  email: string;

  /**
   * The first name of the registrant.
   */
  firstName: string;

  /**
   * The last name of the registrant.
   */
  lastName: string;

  /**
   * The role of the registrant.
   */
  role?: string;
}
