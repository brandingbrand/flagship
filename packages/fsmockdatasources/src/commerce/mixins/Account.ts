import { AccountDataSource, CommerceTypes } from '@brandingbrand/fscommerce';
import { Constructor } from '../../helpers';

export const AccountMixin = <T extends Constructor>(superclass: T) => {
  return class AccountMixin extends superclass implements AccountDataSource {
    async login(
      username: string,
      password: string,
      options?: CommerceTypes.LoginOptions
    ): Promise<CommerceTypes.SessionToken> {
      throw new Error('Not implemented yet');
    }

    async logout(username: string, password: string): Promise<boolean> {
      throw new Error('Not implemented yet');
    }

    async register(
      account: CommerceTypes.CustomerAccount,
      password: string
    ): Promise<CommerceTypes.CustomerAccount> {
      throw new Error('Not implemented yet');
    }

    async fetchSavedAddresses(): Promise<CommerceTypes.CustomerAddress[]> {
      throw new Error('Not implemented yet');
    }

    async addSavedAddress(
      address: CommerceTypes.CustomerAddress
    ): Promise<CommerceTypes.CustomerAddress> {
      throw new Error('Not implemented yet');
    }

    async editSavedAddress(
      address: CommerceTypes.CustomerAddress
    ): Promise<CommerceTypes.CustomerAddress> {
      throw new Error('Not implemented yet');
    }

    async deleteSavedAddress(addressId: string): Promise<boolean> {
      throw new Error('Not implemented yet');
    }

    async fetchSavedPayments(methodId?: string): Promise<CommerceTypes.PaymentMethod[]> {
      throw new Error('Not implemented yet');
    }

    async addSavedPayment(
      payment: CommerceTypes.PaymentMethod
    ): Promise<CommerceTypes.PaymentMethod> {
      throw new Error('Not implemented yet');
    }

    async deleteSavedPayment(paymentId: string): Promise<boolean> {
      throw new Error('Not implemented yet');
    }

    async forgotPassword(email: string): Promise<boolean> {
      throw new Error('Not implemented yet');
    }

    async fetchAccount(): Promise<CommerceTypes.CustomerAccount> {
      throw new Error('Not implemented yet');
    }

    async updateAccount(
      account: CommerceTypes.CustomerAccount
    ): Promise<CommerceTypes.CustomerAccount> {
      throw new Error('Not implemented yet');
    }

    async updatePassword(currentPassword: string, password: string): Promise<boolean> {
      throw new Error('Not implemented yet');
    }

    async fetchOrders(): Promise<CommerceTypes.Order[]> {
      throw new Error('Not implemented yet');
    }

    async fetchOrder(orderId: string): Promise<CommerceTypes.Order> {
      throw new Error('Not implemented yet');
    }
  };
};
