import * as Types from '../customTypes';
import * as ShopifyResponseTypes from '../util/ShopifyResponseTypes';
import ShopifyAPIError from './ShopifyAPIError';
import ShopifyAPI from './ShopifyAPI';
import { Navigation } from 'react-native-navigation';
import gpayshippingoption from '../components/GooglePayShippingOptionsModal';
import { AppRegistry } from 'react-native';

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

    // if google pay is configured, push the default shipping options modal if the app has not
    // already registered a custom one
    if (this.googlePayKey) {
      const registered = !!AppRegistry.getRunnable('GooglePayShippingOptionsModal');
      if (!registered) {
        Navigation.registerComponent('GooglePayShippingOptionsModal', (): any => {
          return gpayshippingoption;
        });
      }
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
