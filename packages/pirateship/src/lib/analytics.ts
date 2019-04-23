import {
  Analytics as FSAnalytics,
  AnalyticsProvider
} from '@brandingbrand/fsengage';
import { CommerceTypes } from '@brandingbrand/fscommerce';

const providers: AnalyticsProvider.AnalyticsProvider[] = [];
const Analytics = new FSAnalytics(providers);
export default Analytics;

export function mapProductToAnalytics(
  product: CommerceTypes.Product,
  quantity?: number
): any {
  const analyticsProduct: any = {
    identifier: product.id,
    name: product.title,
    brand: product.brand,
    price: product.price
  };

  if (quantity) {
    analyticsProduct.quantity = quantity;
  }

  return analyticsProduct;
}

// Names of screens in which automatic pageview tracking should not occur (e.g., if
// tracking is handled in a subcomponent)
export const screensToIgnore = ['ProductDetail'];
