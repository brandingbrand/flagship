import {
  CommerceTypes as FSCommerceTypes
} from '@brandingbrand/fscommerce';
import * as ResponseTypes from '../util/ShopifyResponseTypes';

export function category(
  category: ResponseTypes.ShopifyCollection
): FSCommerceTypes.Category {
  const imageSrc = category.image && category.image.src;

  return {
    id: category.id,
    title: category.title,
    handle: category.handle,
    pageTitle: category.title,
    pageDescription: category.description,
    image: imageSrc ? {
      uri: imageSrc
    } : undefined
  };
}
