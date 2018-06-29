import { FilterItemValue } from './FilterItemValue';

export interface FilterItem {
  id: string;
  title: string;
  values: FilterItemValue[];
  [key: string]: any;
}
