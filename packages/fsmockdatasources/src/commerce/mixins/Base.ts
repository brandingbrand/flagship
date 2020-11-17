import { CommerceTypes } from '@brandingbrand/fscommerce';
import { DefaultCurrencyCode } from '../../helpers';

export class Base {
  public minRefinements: number = 0;
  public storeCurrencyCode: string = DefaultCurrencyCode;

  async fetchProducts(ids: string[]): Promise<CommerceTypes.Product[]> {
    throw new Error('Not implemented yet');
  }
}
