import type { AccountDataSource, CommerceTypes } from '@brandingbrand/fscommerce';

import type { Constructor } from '../../helpers';

export const AccountMixin = <T extends Constructor>(superclass: T) =>
  class AccountMixin extends superclass implements AccountDataSource {
    public async login(
      username: string,
      password: string,
      options?: CommerceTypes.LoginOptions
    ): Promise<CommerceTypes.SessionToken> {
      throw new Error('Not implemented yet');
    }

    public async logout(username: string, password: string): Promise<boolean> {
      throw new Error('Not implemented yet');
    }

    public async register(
      account: CommerceTypes.CustomerAccount,
      password: string
    ): Promise<CommerceTypes.CustomerAccount> {
      throw new Error('Not implemented yet');
    }

    public async fetchSavedAddresses(): Promise<CommerceTypes.CustomerAddress[]> {
      throw new Error('Not implemented yet');
    }

    public async addSavedAddress(
      address: CommerceTypes.CustomerAddress
    ): Promise<CommerceTypes.CustomerAddress> {
      throw new Error('Not implemented yet');
    }

    public async editSavedAddress(
      address: CommerceTypes.CustomerAddress
    ): Promise<CommerceTypes.CustomerAddress> {
      throw new Error('Not implemented yet');
    }

    public async deleteSavedAddress(addressId: string): Promise<boolean> {
      throw new Error('Not implemented yet');
    }

    public async fetchSavedPayments(methodId?: string): Promise<CommerceTypes.PaymentMethod[]> {
      throw new Error('Not implemented yet');
    }

    public async addSavedPayment(
      payment: CommerceTypes.PaymentMethod
    ): Promise<CommerceTypes.PaymentMethod> {
      throw new Error('Not implemented yet');
    }

    public async deleteSavedPayment(paymentId: string): Promise<boolean> {
      throw new Error('Not implemented yet');
    }

    public async forgotPassword(email: string): Promise<boolean> {
      throw new Error('Not implemented yet');
    }

    public async fetchAccount(): Promise<CommerceTypes.CustomerAccount> {
      throw new Error('Not implemented yet');
    }

    public async updateAccount(
      account: CommerceTypes.CustomerAccount
    ): Promise<CommerceTypes.CustomerAccount> {
      throw new Error('Not implemented yet');
    }

    public async updatePassword(currentPassword: string, password: string): Promise<boolean> {
      throw new Error('Not implemented yet');
    }

    public async fetchOrders(): Promise<CommerceTypes.Order[]> {
      throw new Error('Not implemented yet');
    }

    public async fetchOrder(orderId: string): Promise<CommerceTypes.Order> {
      throw new Error('Not implemented yet');
    }

    public async fetchProductLists(
      options?: CommerceTypes.ProductListsOptions
    ): Promise<CommerceTypes.CustomerProductList[]> {
      throw new Error('Not implemented yet');
    }

    public async createProductList(
      productList: CommerceTypes.CustomerProductList
    ): Promise<CommerceTypes.CustomerProductList> {
      throw new Error('Not implemented yet');
    }

    public async addItemToProductList(
      listId: string,
      options?: CommerceTypes.ProductListAddItemOptions
    ): Promise<CommerceTypes.CustomerProductListItem> {
      throw new Error('Not implemented yet');
    }

    async deleteItemFromProductList(listId: string, itemId: string): Promise<void> {
      throw new Error('Not implemented yet');
    }
  };
