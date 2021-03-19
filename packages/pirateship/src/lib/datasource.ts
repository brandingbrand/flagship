import BBPlatformDataSource from './BBPlatformDataSource';
import { env } from '@brandingbrand/fsapp';
import { MockCommerceDataSource, MockReviewDataSource } from '@brandingbrand/fsmockdatasources';

type CommerceDataSource = import ('@brandingbrand/fscommerce').CommerceDataSource;
type ReviewDataSource = import ('@brandingbrand/fscommerce').ReviewDataSource;

let dataSourceToExport: CommerceDataSource;
let reviewDataSource: ReviewDataSource;

export interface DataSourceConfig {
  type: 'bbplatform' | 'commercecloud' | 'shopify' | 'mock';
  categoryFormat: 'grid' | 'list';
  apiConfig: {
    apiHost: string;
  };
  enableProxy?: boolean;
}

if (env.dataSource.type === 'bbplatform') {
  dataSourceToExport = new BBPlatformDataSource(env.dataSource.apiConfig.apiHost);
} else if (env.dataSource.type === 'mock') {
  dataSourceToExport = new MockCommerceDataSource();
  reviewDataSource = new MockReviewDataSource();
} else {
  throw new Error('No data source specified in env!');
}

export const dataSource = dataSourceToExport;
export const dataSourceConfig: DataSourceConfig = env.dataSource;

export { reviewDataSource };
