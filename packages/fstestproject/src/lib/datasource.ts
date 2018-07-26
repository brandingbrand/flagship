import { CommerceCloudDataSource } from '@brandingbrand/fssalesforce';
import { MockCommerceDataSource, MockReviewDataSource } from '@brandingbrand/fsmockdatasources';
import {
  ContentManagementSystem,
  CoreContentManagementSystemProvider
} from '@brandingbrand/fsengage';

import {
  BrandCMSProductCatalog
} from '@brandingbrand/fsbrandcmsproductcatalog';
import FSNetwork from '@brandingbrand/fsnetwork';
import { PowerReviewsDataSource } from '@brandingbrand/fspowerreviews';

const origin = 'https://demo-ocapi.demandware.net';
const endpoint = 'https://demo-ocapi.demandware.net/s/SiteGenesis/dw/shop/v18_6';
const clientId = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

const networkClient = new FSNetwork({
  baseURL: endpoint,
  headers: {
    origin,
    'x-dw-client-id': clientId
  }
});

export const demandware = new CommerceCloudDataSource({
  endpoint,
  clientId,
  networkClient,
  middleware: {
    fetchCategory: [
      (data: any, normalized: any) => {
        normalized.middle = 'middle';
        normalized.ware = 'middle';
        return normalized;
      },
      (data: any, normalized: any) => {
        normalized.ware = 'ware';
        return normalized;
      }
    ],
    addSavedAddress: [
      (data: any, normalized: any) => {
        normalized.c_email = data.email;
        return normalized;
      }
    ],
    fetchSavedAddresses: [
      (data: any, normalized: any) => {
        if (normalized && normalized.length) {
          for (let i = 0; i < normalized.length; i++) {
            const dataAddress = data.data[i];
            if (dataAddress) {
              normalized[i].email = dataAddress.c_email;
            }
          }
        }
        return normalized;
      }
    ]
  },
  storeCurrencyCode: 'USD'
});

export const cmsProductCatalog = new BrandCMSProductCatalog({
  CMS: new ContentManagementSystem(new CoreContentManagementSystemProvider({
    propertyId: '443',
    environment: 1
  }))
});

export const mockCommerceDataSource = new MockCommerceDataSource();
export const mockReviewDataSource = new MockReviewDataSource();
export const powerreviews = new PowerReviewsDataSource({
  endpoint: 'https://readservices-b2c.powerreviews.com/',
  apikey: '',
  merchantId: ''
});
