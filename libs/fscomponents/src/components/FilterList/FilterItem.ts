import type { CommerceTypes } from '@brandingbrand/fscommerce';

import type { FilterItemValue } from './FilterItemValue';

export interface FilterItem extends CommerceTypes.Refinement {
  values?: FilterItemValue[];
  [key: string]: any;
}
