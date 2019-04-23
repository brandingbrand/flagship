import BBPlatformDataSource from './BBPlatformDataSource';
import { env } from '@brandingbrand/fsapp';
import { MockCommerceDataSource, MockReviewDataSource } from '@brandingbrand/fsmockdatasources';

type CommerceDataSource = import ('@brandingbrand/fscommerce').CommerceDataSource;
type ReviewDataSource = import ('@brandingbrand/fscommerce').ReviewDataSource;

let dataSourceToExport: CommerceDataSource;
const reviewDataSource: ReviewDataSource = new MockReviewDataSource();

export interface DataSourceConfig {
  type: 'bbplatform' | 'mock';
  categoryFormat: 'grid' | 'list';
  apiConfig: any;
}

if (env.dataSource.type === 'bbplatform') {
  dataSourceToExport = new BBPlatformDataSource(env.dataSource.apiConfig.apiHost);
} else if (env.dataSource.type === 'mock') {
  dataSourceToExport = new MockCommerceDataSource();
} else {
  throw new Error('No data source specified in env!');
}

export const dataSource = dataSourceToExport;
export const dataSourceConfig: DataSourceConfig = env.dataSource;

export { reviewDataSource };
