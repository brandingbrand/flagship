import * as Types from '../customTypes';
import * as ShopifyResponseTypes from '../util/ShopifyResponseTypes';
import ShopifyAPIError from './ShopifyAPIError';
import ShopifyAPI from './ShopifyAPI';

export default class DataSourceBase {
  api: ShopifyAPI;
  config: Types.ShopifyConfig;
  cartId: string = '';
  googlePayKey?: string;
  iosMerchantIdentifier?: string;
  payment: ShopifyResponseTypes.ShopifyCreditCardPayment = {
    amount: '',
    idempotencyKey: '',
    test: false,
    vaultId: ''
  };

  constructor(config: Types.ShopifyConfig) {
    this.config = config;
    this.api = new ShopifyAPI(config.domain, config.storefrontAccessToken);
    this.googlePayKey = config.googlePayPublicKey;
    this.iosMerchantIdentifier = config.iosMerchantIdentifier;
    if (this.googlePayKey && !config.googlePayScreenName) {
      throw new Error('You must provide the name of the screen to ' +
        'be used for the Google Pay Shipping Options Modal');
    }
  }

  protected async getOrStartCart(): Promise<string> {
    if (!this.cartId) {
      this.cartId = await this.createCart();
    }

    return this.cartId;
  }

  protected async createCart(): Promise<string> {
    const checkout = await this.api.checkoutCreate();
    return this.cartId = checkout.id;
  }

  protected async paymentResolve(
    id: string,
    tries: number
  ): Promise<ShopifyResponseTypes.ShopifyPayment> {
    if (tries) {
      const paymentInfo = await this.api.getPayment(id);
      if (paymentInfo.transaction.status === 'PENDING') {
        await this.timeout(1000);
        return this.paymentResolve(id, tries - 1);
      }
      return paymentInfo;
    } else {
      throw new ShopifyAPIError(`Payment resolve timeout: ${id}`);
    }
  }

  private async timeout(ms: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
  }
}
