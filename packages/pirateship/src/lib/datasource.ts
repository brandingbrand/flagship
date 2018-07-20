import { BazaarvoiceDataSource } from '@brandingbrand/fsbazaarvoice';
import BBPlatformDataSource from './BBPlatformDataSource';
import { CommerceCloudDataSource } from '@brandingbrand/fssalesforce';
import FSNetwork from '@brandingbrand/fsnetwork';
import { commerceCloudMiddleware } from './commerceCloudMiddleware';
import { ShopifyDataSource } from '@brandingbrand/fsshopify';
import { env } from '@brandingbrand/fsapp';
import { MockCommerceDataSource } from '@brandingbrand/fsmockdatasources';

const { dataSourceConfigs } = env;

let dataSourceToExport: import ('@brandingbrand/fscommerce').CommerceDataSource;

export interface DataSourceConfig {
  type: 'bbplatform' | 'commercecloud' | 'shopify' | 'mock';
  categoryFormat: 'grid' | 'list';
  apiConfig: any;
}

if (env.dataSource.type === 'bbplatform') {
  dataSourceToExport = new BBPlatformDataSource(env.dataSource.apiConfig.apiHost);
} else if (env.dataSource.type === 'commercecloud') {
  const config: any = env.dataSource.apiConfig;
  config.middleware = commerceCloudMiddleware;

  if (config.networkClient) {
    config.networkClient = new FSNetwork(config.networkClient);
  }

  dataSourceToExport = new CommerceCloudDataSource(config);
} else if (env.dataSource.type === 'shopify') {
  const config: any = env.dataSource.apiConfig;
  dataSourceToExport = new ShopifyDataSource(config);
} else if (env.dataSource.type === 'mock') {
  dataSourceToExport = new MockCommerceDataSource();
} else {
  throw new Error('No data source specified in env!');
}

export const dataSource = dataSourceToExport;
export const dataSourceConfig: DataSourceConfig = env.dataSource;

export const bvDataSource = new BazaarvoiceDataSource(dataSourceConfigs.bazaarVoice);
