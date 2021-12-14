import { FilterItemValue } from './FilterItemValue';
import { CommerceTypes } from '@brandingbrand/fscommerce';

export interface FilterItem extends CommerceTypes.Refinement {
  values?: FilterItemValue[];
  [key: string]: any;
}
