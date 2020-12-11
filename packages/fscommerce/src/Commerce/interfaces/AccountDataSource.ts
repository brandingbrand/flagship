import {
  CustomerAccount,
  CustomerAddress,
  CustomerProductList,
  CustomerProductListItem,
  LoginOptions,
  Order,
  PaymentMethod,
  ProductListAddItemOptions,
  ProductListsOptions,
  SessionToken
} from '../CommerceTypes';

/**
 * Methods to interact with user accounts from a data source.
 */
export default interface AccountDataSource {
  /**
   * Retrieve information about the logged-in user's product lists. Requires a valid session token
   * to exist in local storage.
   *
   * @param {ProductListsOptions} options - The options of the request
   * @returns {Promise.<Array.<CustomerProductList>>} A Promise representing an array of product
   * lists
   */
  fetchProductLists?: (
    options?: ProductListsOptions
  ) => Promise<CustomerProductList[]>;

  /**
   * Add item to the logged-in user's product list. Requires a valid session token
   * to exist in local storage.
   *
   * @param {string} listId - The id of the list
   * @param {ProductListAddItemOptions} options - The options of the request
   * @returns {Promise.<Array.<CustomerProductList>>} A Promise representing an array of product
   * lists
   */
  addItemToProductList?: (
    listId: string,
    options?: ProductListAddItemOptions
  ) => Promise<CustomerProductListItem>;

  /**
   * Delete item from the logged-in user's product list. Requires a valid session token
   * to exist in local storage.
   *
   * @param {string} listId - The id of the list
   * @param {string} itemId - The id of the item
   * @returns {Promise.<Array.<CustomerProductList>>} A Promise representing an array of product
   * lists
   */
  deleteItemFromProductList?: (
    listId: string,
    itemId: string
  ) => Promise<void>;

  /**
   * Log a user in via their username and password.
   *
   * @param {string} username
   * @param {string} password
   * @param {LoginOptions} [options]
   * @returns {Promise.<SessionToken>} A Promise representing the user's session token
   */
  login(username: string, password: string, options?: LoginOptions): Promise<SessionToken>;

  /**
   * Log a user out via their username and password.
   *
   * @param {string} username
   * @param {string} password
   * @returns {Promise.<void>} A Promise which is rejected if the operation fails
   */
  logout(username: string, password: string): Promise<boolean>;

  /**
   * Create a new customer account with customer metadata and an account password.
   *
   * @param {CustomerAccount} account - Metadata about the new customer's account
   * @param {string} password - The password by which the user will log in
   * @returns {Promise.<CustomerAccount>} A Promise representing a new user's account
   */
  register(
    account: CustomerAccount,
    password: string
  ): Promise<CustomerAccount>;

  /**
   * Fetch saved addresses for the active user's account.
   *
   * @returns {Promise.<Array.<CustomerAddress>>} A Promise representing saved addresses for a user
   */
  fetchSavedAddresses(): Promise<CustomerAddress[]>;

  /**
   * Add a new saved address to the active user's account.
   *
   * @param {CustomerAddress} address - Metadata about the address to be added
   * @returns {Promise.<CustomerAddress>} A Promise representing a new address
   */
  addSavedAddress(address: CustomerAddress): Promise<CustomerAddress>;

  /**
   * Edit a saved address in the active user's account.
   *
   * @param {CustomerAddress} address - Metadata about the address to be edited
   * @returns {Promise.<CustomerAddress>} A Promise representing an edited address
   */
  editSavedAddress(address: CustomerAddress): Promise<CustomerAddress>;

  /**
   * Delete an address specified by an identifier from the active user's account.
   *
   * @param {string} addressId - The id of the address to be deleted
   * @returns {Promise.<void>} A Promise which will be rejected if the operation fails
   */
  deleteSavedAddress(addressId: string): Promise<boolean>;

  /**
   * Fetch all saved payments for the active user, optionally filtered by payment method type
   *
   * @param {string} [methodId] - An optional payment method id to filter the results
   * @returns {Promise.<Array.<PaymentMethod>>} A Promise representing an array of saved payments
   */
  fetchSavedPayments(methodId?: string): Promise<PaymentMethod[]>;

  /**
   * Add a new saved payment to the active user's account.
   *
   * @param {PaymentMethod} payment - Metadata about the payment to be added
   * @returns {Promise.<PaymentMethod>} A Promise representing a new payment method
   */
  addSavedPayment(payment: PaymentMethod): Promise<PaymentMethod>;

  /**
   * Delete a saved payment specified by id from the active user's account
   *
   * @param {string} paymentId - The id of the payment to be deleted
   * @returns {Promise.<void>} A Promise which will be rejected if the operation fails
   */
  deleteSavedPayment(paymentId: string): Promise<boolean>;

  /**
   * Invoke a reset password request for the specified email address
   *
   * @param {string} email
   * @returns {Promise.<void>} A Promise which will be rejected if the operation fails
   */
  forgotPassword(email: string): Promise<boolean>;

  /**
   * Fetch the account for the current active user.
   *
   * @returns {Promise.<CustomerAccount>} A Promise representing the active user's account
   */
  fetchAccount(): Promise<CustomerAccount>;

  /**
   * Update account information for the current user.
   *
   * @param {CustomerAccount} account - Metadata about the user's account to be updated
   * @returns {Promise.<CustomerAccount>} A Promise representing an updated user acccount
   */
  updateAccount(account: CustomerAccount): Promise<CustomerAccount>;

  /**
   * Update the password of the current active user.
   *
   * @param {string} currentPassword - The user's current password
   * @param {string} password - The new password for the user
   * @returns {Promise.<void>} A Promise which will be rejected if the operation fails
   */
  updatePassword(currentPassword: string, password: string): Promise<boolean>;

  /**
   * Fetch all orders associated with the current active user.
   *
   * @returns {Promise.<Array.<Order>>} A Promise representing orders for the current user
   */
  fetchOrders(): Promise<Order[]>;

  /**
   * Fetch an order by a specified id.
   *
   * @param {string} orderId - The id of the order to be retrieved
   * @returns {Promise.<Order>} A Promise representing a single order
   */
  fetchOrder(orderId: string): Promise<Order>;
}
