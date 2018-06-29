import {
  CommerceTypes as FSCommerceTypes
} from '@brandingbrand/fscommerce';
import * as ResponseTypes from '../util/ShopifyResponseTypes';
import {product} from './product';

export function productIndex(
  data: ResponseTypes.ShopifyProductIndex,
  currency: string
): FSCommerceTypes.ProductIndex {
  const products = data.products.edges.map(
    (edge: ResponseTypes.ShopifyProductIndexProductContainer) => product(edge.node, currency)
  );

  return {
    total: products.length,
    products
  };
}
