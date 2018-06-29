import {
  CommerceTypes as FSCommerceTypes,
  ProductCatalogDataSource
} from '@brandingbrand/fscommerce';

import brandCMSNormalizer from './BrandCMSNormalizer';
import { ContentManagementSystem } from '@brandingbrand/fsengage';

export interface BrandCMSConfig {
  CMS: ContentManagementSystem;
}

export class BrandCMSProductCatalog implements ProductCatalogDataSource {
  private CMS: ContentManagementSystem;

  constructor(config: BrandCMSConfig) {
    this.CMS = config.CMS;
  }

  // using template [Pirate Commerce Category]
  async fetchCategory(
    id: string,
    query?: FSCommerceTypes.CategoryQuery
  ): Promise<FSCommerceTypes.Category> {
    // known issue: all three attributes cannot contain '/'
    // TODO: design a better rule parsing this
    const [group, slot, identifier] = id.split('/');
    if (!group || !slot) {
      return Promise.reject(`WARN: [${id}] is not a valid identifier`);
    }

    return this.CMS.contentForSlot(group, slot, identifier).then(
      (data: any) => {
        if (!data || !data.instances) {
          throw new Error(`WARN: [${id}] is not correctly setup.`);
        }

        return {
          id: '',
          title: '',
          handle: '',
          categories: data.instances.map(brandCMSNormalizer.category)
        };
      }
    );
  }

  async fetchProductIndex(
    query: FSCommerceTypes.ProductQuery
  ): Promise<FSCommerceTypes.ProductIndex> {
    return Promise.reject('Not Implemented');
  }

  async fetchProduct(id: string): Promise<FSCommerceTypes.Product> {
    return Promise.reject('Not Implemented');
  }
}
