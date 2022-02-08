import { CommerceTypes } from '@brandingbrand/fscommerce';
import { DefaultCurrencyCode, Products } from '../../helpers';

export class Base {
  public minRefinements: number = 0;
  public storeCurrencyCode: string = DefaultCurrencyCode;

  async fetchProducts(ids: string[]): Promise<CommerceTypes.Product[]> {
    const products: CommerceTypes.Product[] = [];

    ids.forEach((id) => {
      const product = Products.find((product) => product.id === id);
      if (product) {
        products.push(product);
      }
    });
    return products;
  }
}
