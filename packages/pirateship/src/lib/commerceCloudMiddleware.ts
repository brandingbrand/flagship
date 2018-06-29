import { CommerceTypes } from '@brandingbrand/fscommerce';

export const commerceCloudMiddleware = {
  fetchProduct: (data: any, normalized: CommerceTypes.Product): CommerceTypes.Product => {
    if (!normalized.description) {
      normalized.description = data.long_description;
    }

    return normalized;
  }
};
