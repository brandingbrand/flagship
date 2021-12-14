
import { CommerceDataSource } from '@brandingbrand/fscommerce';
import {
  AccountMixin,
  Base,
  CartMixin,
  ProductCatalogMixin
} from './mixins';

const Mixins = (
  AccountMixin(
    CartMixin(
      ProductCatalogMixin(Base)
    )
  )
);


export class MockDataSource extends Mixins implements CommerceDataSource {}
