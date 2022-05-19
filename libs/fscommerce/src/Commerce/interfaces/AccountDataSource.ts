import type {
  CustomerAccount,
  CustomerAddress,
  CustomerProductList,
  CustomerProductListItem,
  LoginOptions,
  Order,
  PaymentMethod,
  ProductListAddItemOptions,
  ProductListsOptions,
  SessionToken,
} from '../CommerceTypes';

/**
 * Methods to interact with user accounts from a data source.
 */
export default interface AccountDataSource {
  /**
   * Retrieve information about the logged-in user's product lists. Requires a valid session token
   * to exist in local storage.
   *
   * @param options - The options of the request
   * @return A Promise representing an array of product
   * lists
   */
  fetchProductLists?: (options?: ProductListsOptions) => Promise<CustomerProductList[]>;

  /**
   * Create customer product list
   *
   * @param productList - The product list of the request
   * @return A Promise representing the customer product list
   */
  createProductList?: (productList: CustomerProductList) => Promise<CustomerProductList>;

  /**
   * Add item to the logged-in user's product list. Requires a valid session token
   * to exist in local storage.
   *
   * @param listId - The id of the list
   * @param options - The options of the request
   * @return A Promise representing an array of product
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
   * @param listId - The id of the list
   * @param itemId - The id of the item
   * @return A Promise representing an array of product
   * lists
   */
  deleteItemFromProductList?: (listId: string, itemId: string) => Promise<void>;

  /**
   * Log a user in via their username and password.
   *
   * @param username
   * @param password
   * @param options
   * @return A Promise representing the user's session token
   */
  login: (username: string, password: string, options?: LoginOptions) => Promise<SessionToken>;

  /**
   * Log a user out via their username and password.
   *
   * @param username
   * @param password
   * @return A Promise which is rejected if the operation fails
   */
  logout: (username: string, password: string) => Promise<boolean>;

  /**
   * Create a new customer account with customer metadata and an account password.
   *
   * @param account - Metadata about the new customer's account
   * @param password - The password by which the user will log in
   * @return A Promise representing a new user's account
   */
  register: (account: CustomerAccount, password: string) => Promise<CustomerAccount>;

  /**
   * Deletes an existing customer account.
   *
   * @param account - Metadata about the new customer's account
   * @return A Promise representing a new user's account
   */
  deleteAccount?: (account?: CustomerAccount) => Promise<boolean>;

  /**
   * Fetch saved addresses for the active user's account.
   *
   * @return A Promise representing saved addresses for a user
   */
  fetchSavedAddresses: () => Promise<CustomerAddress[]>;

  /**
   * Add a new saved address to the active user's account.
   *
   * @param address - Metadata about the address to be added
   * @return A Promise representing a new address
   */
  addSavedAddress: (address: CustomerAddress) => Promise<CustomerAddress>;

  /**
   * Edit a saved address in the active user's account.
   *
   * @param address - Metadata about the address to be edited
   * @return A Promise representing an edited address
   */
  editSavedAddress: (address: CustomerAddress) => Promise<CustomerAddress>;

  /**
   * Delete an address specified by an identifier from the active user's account.
   *
   * @param addressId - The id of the address to be deleted
   * @return A Promise which will be rejected if the operation fails
   */
  deleteSavedAddress: (addressId: string) => Promise<boolean>;

  /**
   * Fetch all saved payments for the active user, optionally filtered by payment method type
   *
   * @param methodId - An optional payment method id to filter the results
   * @return A Promise representing an array of saved payments
   */
  fetchSavedPayments: (methodId?: string) => Promise<PaymentMethod[]>;

  /**
   * Add a new saved payment to the active user's account.
   *
   * @param payment - Metadata about the payment to be added
   * @return A Promise representing a new payment method
   */
  addSavedPayment: (payment: PaymentMethod) => Promise<PaymentMethod>;

  /**
   * Delete a saved payment specified by id from the active user's account
   *
   * @param paymentId - The id of the payment to be deleted
   * @return A Promise which will be rejected if the operation fails
   */
  deleteSavedPayment: (paymentId: string) => Promise<boolean>;

  /**
   * Invoke a reset password request for the specified email address
   *
   * @param email
   * @return A Promise which will be rejected if the operation fails
   */
  forgotPassword: (email: string) => Promise<boolean>;

  /**
   * Fetch the account for the current active user.
   *
   * @return A Promise representing the active user's account
   */
  fetchAccount: () => Promise<CustomerAccount>;

  /**
   * Update account information for the current user.
   *
   * @param {CustomerAccount} account - Metadata about the user's account to be updated
   * @return {Promise.<CustomerAccount>} A Promise representing an updated user acccount
   */
  updateAccount: (account: CustomerAccount) => Promise<CustomerAccount>;

  /**
   * Update the password of the current active user.
   *
   * @param currentPassword - The user's current password
   * @param password - The new password for the user
   * @return A Promise which will be rejected if the operation fails
   */
  updatePassword: (currentPassword: string, password: string) => Promise<boolean>;

  /**
   * Fetch all orders associated with the current active user.
   *
   * @return A Promise representing orders for the current user
   */
  fetchOrders: () => Promise<Order[]>;

  /**
   * Fetch an order by a specified id.
   *
   * @param orderId - The id of the order to be retrieved
   * @return A Promise representing a single order
   */
  fetchOrder: (orderId: string) => Promise<Order>;
}
