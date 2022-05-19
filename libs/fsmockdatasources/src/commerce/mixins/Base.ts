import type { CommerceTypes } from '@brandingbrand/fscommerce';

import { DefaultCurrencyCode, Products } from '../../helpers';

export class Base {
  public minRefinements = 0;
  public storeCurrencyCode: string = DefaultCurrencyCode;

  public async fetchProducts(ids: string[]): Promise<CommerceTypes.Product[]> {
    const products: CommerceTypes.Product[] = [];

    for (const id of ids) {
      const product = Products.find((product) => product.id === id);
      if (product) {
        products.push(product);
      }
    }
    return products;
  }
}
