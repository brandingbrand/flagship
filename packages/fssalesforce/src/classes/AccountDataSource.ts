import { DemandwareBase } from './Base';
import {
  AccountDataSource,
  CommerceTypes as FSCommerceTypes,
  runMiddleware
} from '@brandingbrand/fscommerce';
import demandwareNormalizer from '../DemandwareNormalizer';
import demandwareDenormalizer from '../DemandwareDenormalizer';

const kErrorMessageNoAccount = 'cannot get customer account';

export class DemandwareAccountDataSource extends DemandwareBase
                                         implements AccountDataSource {

  /**
   * Log a user in via a specified username and password.
   *
   * @param {string} username - The username by which the user will be logged in
   * @param {string} password - The password by which the user will be logged in
   * @param {LoginOptions} options - Options to be passed to Demandware login
   * @returns {Promise.<SessionToken>} A Promise representing a token created for the
   * authenticated session
   */
  async login(
    username: string,
    password: string,
    options?: FSCommerceTypes.LoginOptions
  ): Promise<FSCommerceTypes.SessionToken> {
    const guestToken = await this.sessionManager.get();
    const userToken = await this.sessionManager.login({
      username,
      password
    });

    if (guestToken && userToken) {
      try {
        await this.updateUserCartWithGuestCart(guestToken, userToken, {
          shouldMergeCart: options && options.shouldMergeCart || false
        });
      } catch (e) {
        console.warn('Failed to merge or replace user cart with guest cart', e);
      }
    }

    return userToken;
  }

  /**
   * Fetch a specified order for the current user by its identifier. Requires a valid session
   * token to exist in local storage.
   *
   * @param {string} orderId - An identifier specifying the order to be fetched
   * @returns {Promise.<Order>} A Promise representing a normalized order
   */
  async fetchOrder(orderId: string): Promise<FSCommerceTypes.Order> {
    const url = '/orders/' + orderId;
    const response = await this.authRequest<SFCC.Order>('get', url);
    if (response && response.status === 200) {
      return demandwareNormalizer.order(response.data, this.storeCurrencyCode);
    } else {
      return Promise.reject(response);
    }
  }

  /**
   * Fetch all orders for the current user. Requires a valid session token to exist in
   * local storage.
   *
   * @returns {Promise.<Array.<Order>>} A Promise representing an array of orders for the current
   * user
   */
  async fetchOrders(): Promise<FSCommerceTypes.Order[]> {
    // TODO: paging, grouping products per shipment
    const url = (token: FSCommerceTypes.SessionToken) =>
      `/customers/${encodeURIComponent(token.token.customer_id)}/orders`;
    const response = await this.authRequest<SFCC.CustomerOrderResult>('get', url);

    // if (response has a 200), and (has a total of 0 orders OR has order data)
    if (response.status === 200 && (response.data.total === 0 || response.data.data)) {
      return demandwareNormalizer.orders(response.data.data || [], this.storeCurrencyCode);
    } else {
      return Promise.reject(response);
    }
  }

  /**
   * Trigger a forgotten password request for a specified email address.
   *
   * @param {string} email - The email for which the password was forgotten
   * @returns {Promise.<boolean>} A Promise representing whether the operation was successful.
   * Note that the Promise will be rejected if an error occurs.
   */
  async forgotPassword(email: string): Promise<boolean> {
    await this.client.post<void>('/customers/password_reset', {
      identification: email,
      type: 'email'
    });
    return true;
  }

  /**
   * Change a user's password. Requires that a valid session token exist in local storage.
   *
   * @param {string} currentPassword - The user's current password
   * @param {string} password - The new password specified by the user
   * @returns {Promise.<boolean>} A Promise representing whether the API returned a "success"
   * status code. Note that the Promise will be rejected if an error occurs.
   */
  async updatePassword(
    currentPassword: string,
    password: string
  ): Promise<boolean> {
    const url = (token: FSCommerceTypes.SessionToken) =>
      `/customers/${encodeURIComponent(token.token.customer_id)}/password`;
    const response = await this.authRequest<void>('post', url, {
      headers: {
        'x-dw-http-method-override': 'PUT'
      },
      data: {
        current_password: currentPassword,
        password
      }
    });
    return response && response.status === 204;
  }

  /**
   * Create a new user account by providing account information and a password.
   *
   * @param {CustomerAccount} account - Metadata about the customer
   * @param {string} password - A password which the user will log in with
   * @returns {Promise.<CustomerAccount>} A Promise representing normalized account
   * information. Note that the Promise will be rejected if an error occurs.
   */
  async register(
    account: FSCommerceTypes.CustomerAccount,
    password: string
  ): Promise<FSCommerceTypes.CustomerAccount> {
    const url = '/customers';
    const response = await this.authRequest<SFCC.Customer>('post', url, {
      data: {
        password,
        customer: {
          email: account.email,
          login: account.email,
          first_name: account.firstName,
          last_name: account.lastName
        }
      }
    });
    if (response && response.status === 200) {
      const userToken = demandwareNormalizer.sessionToken(response);
      if (!userToken) {
        throw new Error('cannot get user token');
      }

      await this.sessionManager.set(userToken);

      const customerAccount = demandwareNormalizer.customerAccount(response.data);
      if (!customerAccount) {
        throw new Error(kErrorMessageNoAccount);
      }
      return customerAccount;
    } else {
      return Promise.reject(response);
    }
  }

  /**
   * Log out the current user.
   *
   * @returns {Promise.<Object>} A Promise representing the response from the API. This
   * information is not normalized.
   */
  async logout(): Promise<boolean> {
    return this.sessionManager.logout();
  }


  /**
   * Retrieve addresses that a user has saved to their account. Requires a valid session
   * token to exist in local storage.
   *
   * @returns {Promise.<Array.<CustomerAddress>>} A Promise representing an array of addresses
   */
  async fetchSavedAddresses(): Promise<FSCommerceTypes.CustomerAddress[]> {
    const url = (token: FSCommerceTypes.SessionToken) =>
      `/customers/${encodeURIComponent(token.token.customer_id)}/addresses`;
    const response = await this.authRequest<SFCC.CustomerAddressResult>('GET', url);

    return runMiddleware(
      response.data,
      demandwareNormalizer.customerAddresses(response.data),
      this.middleware.fetchSavedAddresses
    );
  }

  /**
   * Save a new address to a user's account. Requires a valid session token to exist in local
   * storage.
   *
   * @param {CustomerAddress} address - The address to be saved to the user's account
   * @returns {Promise.<CustomerAddress>} A Promise that will be rejected if an error occurs.
   */
  async addSavedAddress(
    address: FSCommerceTypes.CustomerAddress
  ): Promise<FSCommerceTypes.CustomerAddress> {
    const url = (token: FSCommerceTypes.SessionToken) =>
      `/customers/${encodeURIComponent(token.token.customer_id)}/addresses`;

    const denormalizedAddress = demandwareDenormalizer.customerAddress(address);
    if (denormalizedAddress === null) {
      throw new Error('Unable to add address');
    }

    const formData = await runMiddleware(
      address,
      denormalizedAddress,
      this.middleware.addSavedAddress
    );

    const response = await this.authRequest<SFCC.CustomerAddress>('post', url, { data: formData });
    const customerAddress = demandwareNormalizer.customerAddress(response.data);
    if (!customerAddress) {
      throw new Error('cannot get customer address');
    }

    return customerAddress;
  }

  /**
   * Modify an address saved to a user's account. Requires a valid session token to exist
   * in local storage.
   *
   * @param {CustomerAddress} address - The modified address
   * @returns {Promise.<CustomerAccount>} The normalized modified address
   */
  async editSavedAddress(
    address: FSCommerceTypes.CustomerAddress
  ): Promise<FSCommerceTypes.CustomerAddress> {
    const url = (token: FSCommerceTypes.SessionToken) =>
      `/customers/${encodeURIComponent(token.token.customer_id)}/addresses/${address.id}`;

    const denormalizedAddress = demandwareDenormalizer.customerAddress(address);
    if (denormalizedAddress === null) {
      throw new Error('Unable to edit address');
    }

    const formData = await runMiddleware(
      address,
      denormalizedAddress,
      this.middleware.editSavedAddress
    );
    const response = await this.authRequest<SFCC.CustomerAddress>('patch', url, {
      data: formData
    });
    const customerAddress = demandwareNormalizer.customerAddress(response.data);
    if (!customerAddress) {
      throw new Error('cannot get customer address');
    }

    return customerAddress;
  }

  /**
   * Delete a saved address from a user's account. Requires a valid session token to exist
   * in local storage.
   *
   * @param {string} addressId - An identifier for the address to be deleted
   * @returns {Promise.<boolean>} A Promise representing whether the API returned a "valid"
   * status code. Note that the Promise will be rejected if an error occurs.
   */
  async deleteSavedAddress(addressId: string): Promise<boolean> {
    const url = (token: FSCommerceTypes.SessionToken) =>
      `/customers/${encodeURIComponent(
        token.token.customer_id
      )}/addresses/${addressId}`;
    const response = await this.authRequest<void>('delete', url);
    return response && response.status === 204;
  }

  /**
   * Retrieved saved payment methods (e.g., a credit card) that a user has saved to their
   * account. Requires a valid session token to exist in local storage.
   *
   * @param {string} methodId - The type of payment to show (e.g., CREDIT_CARD)
   * @returns {Promise.<Array.<PaymentMethod>>} A Promise representing an array of saved payments
   */
  async fetchSavedPayments(methodId?: string): Promise<FSCommerceTypes.PaymentMethod[]> {
    const url = (token: FSCommerceTypes.SessionToken) => {
      return (
        `/customers/${encodeURIComponent(
          token.token.customer_id
        )}/payment_instruments` +
        (methodId ? `?payment_method_id=${encodeURIComponent(methodId)}` : '')
      );
    };
    const response = await this.authRequest<SFCC.CustomerPaymentInstrumentResult>('GET', url);
    return demandwareNormalizer.paymentMethods(response.data);
  }

  /**
   * Save a new payment method (e.g., credit card) to the user's account. Requires a valid
   * session token to exist in local storage.
   *
   * @param {PaymentMethod} payment - The payment to be added to the user's account
   * @returns {Promise.<PaymentMethod>} A Promise representing a new normalized payment method
   */
  async addSavedPayment(
    payment: FSCommerceTypes.PaymentMethod
  ): Promise<FSCommerceTypes.PaymentMethod> {
    const url = (token: FSCommerceTypes.SessionToken) =>
      `/customers/${encodeURIComponent(
        token.token.customer_id
      )}/payment_instruments`;
    const response = await this.authRequest<SFCC.CustomerPaymentInstrument>('post', url, {
      data: demandwareDenormalizer.paymentMethod(payment)
    });
    return demandwareNormalizer.paymentMethod(response.data);
  }

  /**
   * Delete a saved payment method from the user's account. Requires a valid session token to
   * exist in local storage.
   *
   * @param {string} paymentsId - An identifier corresponding to the payment method to delete
   * @returns {Promise.<boolean>} A Promise indicating whether a "success" status code was
   * returned. Note that the Promise will be rejected if an error occurs.
   */
  async deleteSavedPayment(paymentsId: string): Promise<boolean> {
    const url = (token: FSCommerceTypes.SessionToken) =>
      `/customers/${encodeURIComponent(
        token.token.customer_id
      )}/payment_instruments/${paymentsId}`;
    const response = await this.authRequest<void>('delete', url);
    return response && response.status === 204;
  }

  /**
   * Retrieve information about the logged-in user's account. Requires a valid session token
   * to exist in local storage.
   *
   * @returns {Promise.<CustomerAccount>} A Promise representing metadata about the current user
   */
  async fetchAccount(): Promise<FSCommerceTypes.CustomerAccount> {
    const url = (token: FSCommerceTypes.SessionToken) =>
      '/customers/' + encodeURIComponent(token.token.customer_id);

    const response = await this.authRequest<SFCC.Customer>('get', url);
    if (response && response.status === 200) {
      const customerAccount = demandwareNormalizer.customerAccount(response.data);
      if (!customerAccount) {
        throw new Error(kErrorMessageNoAccount);
      }
      return customerAccount;
    } else {
      return Promise.reject(response);
    }
  }

  /**
   * Update the current user's account information. Requires a valid session token to exist in
   * local storage.
   *
   * @param {CustomerAccount} account - The modified account information
   * @returns {Promise.<CustomerAccount>} A Promise representing the normalized account profile
   */
  async updateAccount(
    account: FSCommerceTypes.CustomerAccount
  ): Promise<FSCommerceTypes.CustomerAccount> {
    const url = (token: FSCommerceTypes.SessionToken) =>
      '/customers/' + encodeURIComponent(token.token.customer_id);
    // TODO: allow update email
    const response = await this.authRequest<SFCC.Customer>('patch', url, {
      data: {
        first_name: account.firstName,
        last_name: account.lastName
      }
    });
    if (response && response.status === 200) {
      const customerAccount = demandwareNormalizer.customerAccount(response.data);
      if (!customerAccount) {
        throw new Error(kErrorMessageNoAccount);
      }
      return customerAccount;
    } else {
      return Promise.reject(response);
    }
  }

}
